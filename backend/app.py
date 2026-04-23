from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

import os
import requests
import tensorflow as tf
import numpy as np
from PIL import Image
from joblib import load
import pandas as pd
import tempfile
import re
import pdfplumber
import pytesseract
from pdf2image import convert_from_path
from tensorflow.keras.applications.efficientnet import preprocess_input

from utils.runtime_helpers import get_backend_env_path

load_dotenv(get_backend_env_path())




print("🔥 Aarogya AI Backend Started Successfully 🔥")

# ===================== APP SETUP =====================
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "covid_dataset", "covid_19_data.csv")


@app.route("/")
def home():
    return jsonify({"status": "Aarogya AI Backend Running 🚀"})


# ====================================================
# ================= IMAGE MODELS =====================
# ====================================================

from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# Load models
lung_xray_model = tf.keras.models.load_model(
    os.path.join(BASE_DIR, "models", "best_lung_model.h5")
)

bones_model = tf.keras.models.load_model(
    os.path.join(BASE_DIR, "models", "best_custom_cnn.h5")
)

kidney_xray_model = tf.keras.models.load_model(
    os.path.join(BASE_DIR, "models", "kidney_stone_ct_model.h5")
)

# -----------------------------
# LUNG PREPROCESS (MobileNetV2)
# -----------------------------
def preprocess_lung_image(image):
    image = image.resize((224, 224))
    img = np.array(image)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)   # IMPORTANT
    return img


# -----------------------------
# BONES PREPROCESS (if trained with /255 scaling)
# -----------------------------
def preprocess_basic(image):
    image = image.resize((224, 224))
    img = np.array(image) / 255.0
    return np.expand_dims(img, axis=0)


# =============================
# ======= LUNG ROUTE =========
# =============================
@app.route("/predict/xray/lung", methods=["POST"])
def predict_lung_xray():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(request.files["file"]).convert("RGB")
    img = preprocess_lung_image(image)

    prob = float(lung_xray_model.predict(img)[0][0])

    # Use your optimized threshold
    threshold = 0.9955

    if prob >= threshold:
        result = "Likely Pneumonia"
    elif prob >= 0.95:
        result = "Moderate Suspicion"
    else:
        result = "Normal"

    return jsonify({
        "confidence": prob,
        "result": result
    })


# =============================
# ======= BONES ROUTE =========
# =============================
@app.route("/predict/xray/bones", methods=["POST"])
def predict_bones_xray():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    image = Image.open(request.files["file"]).convert("RGB")
    img = preprocess_basic(image)

    confidence = float(np.max(bones_model.predict(img)))

    return jsonify({
        "confidence": confidence
    })


# =============================
# ======= KIDNEY ROUTE ========
# =============================
@app.route("/predict/xray/kidney", methods=["POST"])
def predict_kidney_xray():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp:
        file.save(temp.name)

        img = Image.open(temp.name).convert("RGB")
        img = img.resize((224, 224))
        img = np.array(img)
        img = preprocess_input(img)
        img = np.expand_dims(img, axis=0)

    prediction = float(kidney_xray_model.predict(img)[0][0])

    if prediction > 0.7:
        result = "Likely Kidney Stone"
    elif prediction > 0.4:
        result = "Inconclusive"
    else:
        result = "Normal"

    return jsonify({
        "confidence": prediction,
        "result": result
    })




# ====================================================
# =============== HEATMAP DATA =======================
# ====================================================

COUNTRY_COORDS = {
    "US": [37.0902, -95.7129],
    "India": [20.5937, 78.9629],
    "Brazil": [-14.2350, -51.9253],
    "Russia": [61.5240, 105.3188],
    "France": [46.2276, 2.2137],
    "UK": [55.3781, -3.4360],
    "Italy": [41.8719, 12.5674],
    "Spain": [40.4637, -3.7492],
    "Germany": [51.1657, 10.4515],
    "Turkey": [38.9637, 35.2433],
    "China": [35.8617, 104.1954],
    "Mainland China": [35.8617, 104.1954]
}




# --- HEATMAP ROUTE ---
import numpy as np

@app.route('/api/heatmap-data')
def get_covid_heatmap():
    try:
        df = pd.read_csv(DATA_PATH)
        
        # Ensure date format is correct and get latest data
        df['ObservationDate'] = pd.to_datetime(df['ObservationDate'])

        latest_date = df['ObservationDate'].max()
        latest_df = df[df['ObservationDate'] == latest_date]

        cty = latest_df.groupby('Country/Region')['Confirmed'].sum().reset_index()

        heatmap_points = []

        if not cty.empty:
            v_max = cty['Confirmed'].quantile(0.9)

            for _, row in cty.iterrows():
                country = row['Country/Region']
                count = row['Confirmed']

                if country in COUNTRY_COORDS:
                    lat, lng = COUNTRY_COORDS[country]
                    
                    # Logarithmic normalization: count / (count + v_max)
                    # This ensures values stay between 0.1 and 1.0 nicely
                    intensity = float(count / (count + v_max))
                    
                    # Floor the intensity at 0.2 so even small spots are visible
                    intensity = max(intensity, 0.2)
                    
                    heatmap_points.append([lat, lng, intensity])

        return jsonify(heatmap_points)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify([])


# ====================================================
# =============== CHAT ===============================
# ====================================================
# ====================================================
# =============== RISK MODELS ========================
# ====================================================

heart_package = load(os.path.join(BASE_DIR, "models", "heart_model.pkl"))
diabetes_package = load(os.path.join(BASE_DIR, "models", "diabetes_model.pkl"))
lung_package = load(os.path.join(BASE_DIR, "models", "lung_model.pkl"))


def process_input(package, mapped_data):
    model = package["model"]
    encoders = package["encoders"]
    columns = package["columns"]

    cleaned = {}
    for k, v in mapped_data.items():
        if v is None or v == "" or v == "Select":
            cleaned[k] = 0
        else:
            cleaned[k] = v

    df = pd.DataFrame([cleaned])

    for col in df.columns:
        if col not in encoders:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    for col, le in encoders.items():
        if col in df.columns:
            value = str(df[col].iloc[0]).strip()
            classes = [c.lower() for c in le.classes_]

            if value.lower() in classes:
                correct_value = le.classes_[classes.index(value.lower())]
                df[col] = le.transform([correct_value])
            else:
                df[col] = 0

    for col in columns:
        if col not in df:
            df[col] = 0

    df = df[columns]
    df = df.fillna(0)

    prob = model.predict_proba(df)[0][1]
    return round(prob * 100, 2)


def map_heart_input(data):
    return {
        "General_Health": data.get("General_Health"),
        "Checkup": data.get("Checkup"),
        "Exercise": data.get("Exercise"),
        "Skin_Cancer": data.get("Skin_Cancer"),
        "Other_Cancer": data.get("Other_Cancer"),
        "Depression": data.get("Depression"),
        "Arthritis": data.get("Arthritis"),
        "Sex": data.get("gender"),
        "Age_Category": data.get("Age_Category"),
        "Height_(cm)": data.get("height_cm"),
        "Weight_(kg)": data.get("weight_kg"),
        "BMI": data.get("bmi"),
        "Smoking_History": data.get("Smoking_History"),
        "Alcohol_Consumption": data.get("Alcohol_Consumption"),
        "Fruit_Consumption": data.get("Fruit_Consumption"),
        "Green_Vegetables_Consumption": data.get("Green_Vegetables_Consumption"),
        "FriedPotato_Consumption": data.get("FriedPotato_Consumption"),
    }


def smoking_history_map(value):
    if value == "Current":
        return "current"
    elif value == "Former":
        return "former"
    else:
        return "never"


def map_diabetes_input(data):
    return {
        "gender": data.get("gender"),
        "age": int(data.get("age") or 0),
        "hypertension": 1 if data.get("General_Health") == "Poor" else 0,
        "heart_disease": 1 if data.get("General_Health") == "Poor" else 0,
        "smoking_history": smoking_history_map(data.get("Smoking_History")),
        "bmi": float(data.get("bmi") or 0),
        "HbA1c_level": float(data.get("hba1c_level") or 5.5),
        "blood_glucose_level": float(data.get("blood_glucose_level") or 100),
    }


def yn(value):
    return 2 if value == "Yes" else 1


def smoking_map(value):
    return 2 if value == "Current" else 1


def map_lung_input(data):
    return {
        "GENDER": "M" if data.get("gender") == "Male" else "F",
        "AGE": int(data.get("age") or 0),
        "SMOKING": smoking_map(data.get("Smoking_History")),
        "YELLOW_FINGERS": yn(data.get("yellow_fingers")),
        "ANXIETY": yn(data.get("anxiety")),
        "PEER_PRESSURE": 1,
        "CHRONIC DISEASE": yn(data.get("chronic_disease")),
        "FATIGUE ": yn(data.get("fatigue")),
        "ALLERGY ": 1,
        "WHEEZING": yn(data.get("wheezing")),
        "ALCOHOL CONSUMING": yn(
            "Yes" if data.get("Alcohol_Consumption") == "Frequently" else "No"
        ),
        "COUGHING": 1,
        "SHORTNESS OF BREATH": yn(data.get("shortness_of_breath")),
        "SWALLOWING DIFFICULTY": 1,
        "CHEST PAIN": yn(data.get("chest_pain")),
    }


@app.route("/predict/heart", methods=["POST"])
def predict_heart_risk():
    try:
        data = request.get_json()
        mapped = map_heart_input(data)
        risk = process_input(heart_package, mapped)
        return jsonify({"risk_percentage": risk})
    except Exception as e:
        print("Heart error:", e)
        return jsonify({"risk_percentage": 0})


@app.route("/predict/diabetes", methods=["POST"])
def predict_diabetes_risk():
    try:
        data = request.get_json()
        mapped = map_diabetes_input(data)
        risk = process_input(diabetes_package, mapped)
        return jsonify({"risk_percentage": risk})
    except Exception as e:
        print("Diabetes error:", e)
        return jsonify({"risk_percentage": 0})


@app.route("/predict/lung-risk", methods=["POST"])
def predict_lung_risk():
    try:
        data = request.get_json()
        mapped = map_lung_input(data)
        risk = process_input(lung_package, mapped)
        return jsonify({"risk_percentage": risk})
    except Exception as e:
        print("Lung error:", e)
        return jsonify({"risk_percentage": 0})


import requests
import os

@app.route("/chat", methods=["POST"])
def health_chat():
    try:
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"reply": "Please enter a message."})

        groq_api_key = os.environ.get("GROQ_API_KEY")
        if not groq_api_key:
            return jsonify({"reply": "Groq API key not set."})

        headers = {
            "Authorization": f"Bearer {groq_api_key.strip()}",
            "Content-Type": "application/json"
        }

        json_data = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are Aarogya AI, a holistic wellness assistant focused on Ayurveda and "
                        "acupressure/acupuncture-inspired lifestyle guidance. "
                        "Your role is to help people with practical herbal and routine-based suggestions "
                        "for everyday wellness concerns such as stress, digestion, sleep, immunity, and "
                        "energy balance. "
                        "Always answer in a warm, supportive tone and use clean formatting with short headings "
                        "and bullet points when helpful. "
                        "Prefer safe, non-invasive suggestions like hydration, gentle routines, breathing, "
                        "food timing, and common household herbs. "
                        "Never claim to diagnose, cure, or replace a doctor. For red-flag symptoms, severe "
                        "pain, breathing issues, high fever, bleeding, or emergencies, clearly advise urgent "
                        "medical care. "
                        "If the user asks for medicine dosage or risky interventions, give general wellness "
                        "guidance and recommend consultation with a licensed professional."
                    )
                },
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.4
        }

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=json_data,
            timeout=30
        )

        result = response.json()

        if "choices" in result:
            reply = result["choices"][0]["message"]["content"]
        else:
            print("Groq API raw response:", result)
            reply = "Groq did not return a valid reply."

        return jsonify({"reply": reply})

    except Exception as e:
        print("Groq error:", e)
        return jsonify({"reply": "Connection failed."})

def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    return np.expand_dims(image, axis=0)

def calculate_bmi(weight, height):
    if weight > 0 and height > 0:
        return round(weight / ((height / 100) ** 2), 2)
    return 0

gender_map = {"Male": 0, "Female": 1}
yes_no_map = {"Yes": 1, "No": 0}

# =========================================================
# ================= TEXT EXTRACTION =======================
# =========================================================

def extract_text_from_file(file_path):
    text = ""

    if file_path.lower().endswith(".pdf"):
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"

            # OCR fallback
            if len(text.strip()) < 100:
                print("⚠ Using OCR fallback...")
                images = convert_from_path(file_path)
                for img in images:
                    text += pytesseract.image_to_string(img)

        except Exception as e:
            print("PDF extraction error:", e)

    else:
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
        except Exception as e:
            print("Image OCR error:", e)

    return text


def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.lower()


# =========================================================
# ================= SAFE VALUE EXTRACTION =================
# =========================================================

def extract_value(pattern, text, min_val=None, max_val=None):
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    if match:
        try:
            value = float(match.group(1))

            # Sanity check layer
            if min_val is not None and value < min_val:
                return None
            if max_val is not None and value > max_val:
                return None

            return value
        except:
            return None
    return None


# =========================================================
# ================= CLASSIFIERS ===========================
# =========================================================

def classify_vitamin_d(value):
    if value is None:
        return "Not Found", ""
    if value < 20:
        return "Deficient", "Severe deficiency. Supplementation required."
    elif value < 30:
        return "Insufficient", "Increase sunlight exposure."
    return "Normal", "Healthy level."


def classify_b12(value):
    if value is None:
        return "Not Found", ""
    if value < 211:
        return "Low", "Consider B12 supplements."
    elif value < 300:
        return "Borderline", "Monitor levels."
    return "Normal", "Healthy."


def classify_glucose(value):
    if value is None:
        return "Not Found", ""
    if value < 70:
        return "Low", "Hypoglycemia detected."
    elif value <= 100:
        return "Normal", "Healthy fasting level."
    elif value < 126:
        return "Prediabetic", "Lifestyle changes recommended."
    return "Diabetic Range", "Consult physician."


def classify_hemoglobin(value):
    if value is None:
        return "Not Found", ""
    if value < 12:
        return "Low", "Possible anemia. Iron-rich diet recommended."
    return "Normal", "Healthy."


def classify_ldl(value):
    if value is None:
        return "Not Found", ""
    if value < 100:
        return "Optimal", "Ideal LDL level."
    elif value <= 129:
        return "Near Optimal", "Monitor diet."
    elif value <= 159:
        return "Borderline High", "Reduce saturated fats."
    else:
        return "High", "Consult physician."


def classify_hdl(value):
    if value is None:
        return "Not Found", ""
    if value < 40:
        return "Low", "Increase physical activity."
    return "Normal", "Protective level."


# =========================================================
# ================= BLOOD REPORT ROUTE ====================
# =========================================================

@app.route("/analyze-blood-report", methods=["POST"])
def analyze_blood_report():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_extension = os.path.splitext(file.filename)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp:
        file.save(temp.name)
        file_path = temp.name

    full_text = extract_text_from_file(file_path)
    processed_text = clean_text(full_text)

    print("\n🔥 SAFE BLOOD EXTRACTION ACTIVE 🔥")
    print(processed_text[:500])

    # STRICT UNIT-BASED EXTRACTION

    vitamin_d = extract_value(
        r"25[- ]?oh vitamin d.*?(\d+\.?\d*)\s*ng",
        processed_text,
        2, 150
    )

    b12 = extract_value(
        r"vitamin b[- ]?12.*?(\d+\.?\d*)\s*pg",
        processed_text,
        50, 2000
    )

    glucose = extract_value(
        r"fasting blood sugar.*?(\d+\.?\d*)\s*mg",
        processed_text,
        40, 400
    )

    hemoglobin = extract_value(
        r"hemoglobin.*?(\d+\.?\d*)\s*g",
        processed_text,
        5, 20
    )

    ldl = extract_value(
        r"ldl cholesterol.*?(\d+\.?\d*)\s*mg",
        processed_text,
        10, 400
    )

    hdl = extract_value(
        r"hdl cholesterol.*?(\d+\.?\d*)\s*mg",
        processed_text,
        10, 150
    )

    results = {}

    for name, value, classifier in [
        ("Vitamin D", vitamin_d, classify_vitamin_d),
        ("Vitamin B12", b12, classify_b12),
        ("Fasting Glucose", glucose, classify_glucose),
        ("Hemoglobin", hemoglobin, classify_hemoglobin),
        ("LDL", ldl, classify_ldl),
        ("HDL", hdl, classify_hdl),
    ]:
        status, suggestion = classifier(value)
        results[name] = {
            "value": value,
            "status": status,
            "suggestion": suggestion
        }

    return jsonify(results)



# ===================== RUN APP =====================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)



