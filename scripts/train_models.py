# train_models.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import joblib
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "backend")
MODELS_DIR = os.path.join(BACKEND_DIR, "models")

# Create models directory if not exists
os.makedirs(MODELS_DIR, exist_ok=True)


def train_model(csv_path, target_column, model_name):
    df = pd.read_csv(csv_path)

    # Store encoders for inference time
    encoders = {}

    # Encode categorical columns
    for col in df.columns:
        if df[col].dtype == "object":
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le  # Save encoder for this column

    # Separate features and target
    X = df.drop(target_column, axis=1)
    y = df[target_column]

    # Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train model
    model = LogisticRegression(max_iter=1000, class_weight="balanced")
    model.fit(X_train, y_train)

    # Save model, encoders, and column order
    model_package = {
        "model": model,
        "encoders": encoders,
        "columns": X.columns.tolist()
    }

    joblib.dump(model_package, os.path.join(MODELS_DIR, f"{model_name}.pkl"))

    print(f"{model_name} trained successfully!")
    print(f"Saved columns: {X.columns.tolist()}")
    print("-" * 50)


# ===================== Train models =====================

train_model(os.path.join(BACKEND_DIR, "data", "heart.csv"), "Heart_Disease", "heart_model")
train_model(os.path.join(BACKEND_DIR, "data", "diabetes.csv"), "diabetes", "diabetes_model")
train_model(os.path.join(BACKEND_DIR, "data", "lung.csv"), "LUNG_CANCER", "lung_model")