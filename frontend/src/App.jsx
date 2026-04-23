import { useLocation } from "react-router-dom";
import React, { useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Quiz from "./components/Quiz";
import "./styles/quiz.css";
import "./styles/wellness-pages.css";
import MentalHealth from "./pages/MentalHealth";
import { useLanguage } from "./LanguageContext";
import ChatPage from "./pages/ChatPage";
import DiseaseMap from "./components/heatmap_file";
import WellnessDashboard from "./pages/WellnessDashboard";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";
import LoginPage from "./pages/LoginPage";
import MentalCheckupPage from "./pages/MentalCheckupPage";
import { API } from "./config";


/* ================= NAVBAR ================= */
function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="navbar">
      <Link to="/home" className="nav-logo">
        Aarogya AI
      </Link>

      <div className="nav-links">
        <Link to="/home">{t("navbar.home")}</Link>
        {/* <Link to="/xray">{t("navbar.xray")}</Link> */}
        <Link to="/dashboard">{t("navbar.dashboard")}</Link>
        {/* <Link to="/map">Outbreak Map</Link> */}
        <Link to="/risk">{t("navbar.risk")}</Link>
        <Link to="/mental-checkup">Mental Checkup</Link>
        <Link to="/mental-health">{t("navbar.mentalHealth")}</Link>
        <Link to="/blood-test">Blood Test Analysis</Link>
        <Link to="/chat">AI Assistant</Link>
        <Link to="/book-appointment">Book</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/blog">Blog</Link>

        {/* <Link to="/login" className="btn">
          Login
        </Link> */}

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            marginLeft: "12px",
            padding: "6px 8px",
            borderRadius: "6px",
            background: "#f0fdf4",
            color: "#065f46",
            border: "1px solid #bbf7d0",
            cursor: "pointer",
          }}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
          <option value="bn">Bengali</option>
          <option value="te">Telugu</option>
          <option value="ta">Tamil</option>
        </select>
      </div>
    </nav>
  );
}

/* ================= HOME PAGE ================= */
function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "250px" }}>
            <h1 className="hero-title">{t("hero.title")}</h1>

            <div className="project-desc-container">
              <p className="project-desc">{t("hero.description")}</p>
              <p className="project-desc">
                We are an AI-powered holistic wellness platform focused on
                physical health, mental health, and emotional well-being.
              </p>
            </div>

            <p className="hero-builtfor">{t("hero.builtFor")}</p>
          </div>
        </div>

        {/* ================= FEATURES ================= */}
        <div className="features info-cards">
          {[
            // "xray", // Temporarily hidden
            "risk",
            "chatbot",
            "bloodTest",
            "voice",
            "mentalCheckup",
            "dashboard",
            "booking",
            "blog",
          ].map(
            (feature) => (
              <div key={feature} className="feature-card">
                <h3>
                  {feature === "mentalCheckup" && "Mental Wellness Checkup"}
                  {feature === "dashboard" && "Wellness Dashboard"}
                  {feature === "booking" && "Appointment Booking"}
                  {feature === "blog" && "Health Blog & Insights"}
                  {!["mentalCheckup", "dashboard", "booking", "blog"].includes(feature) &&
                    t(`features.${feature}.title`)}
                </h3>
                <ul style={{ marginTop: "8px", paddingLeft: "18px" }}>
                  {feature === "mentalCheckup" && (
                    <>
                      <li>Track stress, sleep, and emotional patterns</li>
                      <li>Get practical daily routines for better balance</li>
                      <li>Built for quick, non-clinical self-assessment</li>
                      <li>Helps identify when professional support may help</li>
                    </>
                  )}
                  {feature === "dashboard" && (
                    <>
                      <li>View wellness trends in one personalized view</li>
                      <li>Track progress across physical and mental metrics</li>
                      <li>Highlights actionable next wellness steps</li>
                      <li>Supports preventive decision-making over time</li>
                    </>
                  )}
                  {feature === "booking" && (
                    <>
                      <li>Book consultations and follow-up wellness sessions</li>
                      <li>Simple flow with essential profile details</li>
                      <li>Designed for continuity of care and coaching</li>
                      <li>Improves engagement with recommended actions</li>
                    </>
                  )}
                  {feature === "blog" && (
                    <>
                      <li>Read preventive health guides and explainers</li>
                      <li>Learn how to interpret signals from daily habits</li>
                      <li>Stay updated on wellness best practices</li>
                      <li>Content focused on practical lifestyle changes</li>
                    </>
                  )}
                  {!["mentalCheckup", "dashboard", "booking", "blog"].includes(feature) &&
                    t(`features.${feature}.points`).map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                </ul>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="about-section">
        <div className="about-wrapper">
          <div className="about-left">
            <h2>About Aarogya AI</h2>
            <p>
              Aarogya AI combines Artificial Intelligence with holistic wellness
              science to deliver preventive, non-invasive in-person assessments.
            </p>
            <p>
              Our AI layer supports machine learning predictions, risk
              analytics, and personalized guidance across physical, mental, and
              emotional health.
            </p>
            <p>
              Alongside modern diagnostics, we integrate Ayurveda principles and
              acupressure-informed, energy-based wellness observations.
            </p>
            <p>
              Our platform is designed to make preventive wellness simple:
              capture meaningful health signals, interpret them through AI, and
              turn them into clear actions people can follow in daily life.
            </p>
            <p>
              We also emphasize accessibility through multilingual support,
              guided interfaces, and practical recommendations so users from
              different backgrounds can benefit with confidence.
            </p>
          </div>

          <div className="about-right">
            <h2>Our Mission & Vision</h2>
            <p>
              Our mission is to make science-inspired wellness practical by
              blending modern AI intelligence with trusted traditional health
              frameworks.
            </p>
            <p>
              We aim to help people and organizations detect imbalance early
              using non-invasive assessments and lifestyle-first recommendations.
            </p>
            <p>
              Aarogya AI supports informed wellness decisions and complements
              healthcare professionals, not replaces them.
            </p>
            <p>
              Our long-term vision is to build an ecosystem where communities,
              workplaces, and institutions can monitor wellness proactively and
              intervene early to reduce future health burdens.
            </p>
            <p>
              By combining data intelligence with human-centered care pathways,
              we aim to create healthier routines, stronger resilience, and
              better quality of life at scale.
            </p>
          </div>
        </div>

        <footer className="main-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <h2>Aarogya AI</h2>
              <p>
                AI-powered holistic wellness platform for physical, mental, and
                emotional well-being with preventive, early screening support.
              </p>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <p>About Us</p>
              <p>Careers</p>
              <p>Contact</p>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <p>FAQs</p>
              <p>Privacy Policy</p>
              <p>Terms of Use</p>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>
              <p>Email: support@aarogyaai.com</p>
              <p>Phone: +91-XXXXXXXXXX</p>
              <p>India</p>
            </div>
          </div>

          <div className="footer-bottom">
            © 2026 Aarogya AI. All rights reserved.
          </div>
        </footer>
      </section>
    </>
  );
}



/* ================= XRAY PAGE ================= */
function XrayPage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const getEndpoint = () => {
    if (selectedArea === "Lungs") return "/predict/xray/lung";
    if (selectedArea === "Bones") return "/predict/xray/bones";
    if (selectedArea === "Kidney") return "/predict/xray/kidney";
    return null;
  };

  const handlePredict = async () => {
    if (!selectedFile || !selectedArea) return;

    const endpoint = getEndpoint();
    if (!endpoint) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch(
        `${API}${endpoint}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      let assessment, color;
      if (data.confidence >= 0.75) {
        assessment = "High likelihood of abnormality detected";
        color = "#dc2626";
      } else if (data.confidence >= 0.4) {
        assessment = "Inconclusive — further evaluation recommended";
        color = "#ca8a04";
      } else {
        assessment = "No significant abnormality detected";
        color = "#059669";
      }

      setResult({ confidence: data.confidence, assessment, color });
    } catch {
      alert("Backend connection failed. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xray-container">
      <h2>X-Ray Upload</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["Kidney", "Lungs", "Bones"].map((area) => (
          <button
            key={area}
            className={`btn ${
              selectedArea === area ? "btn-active" : ""
            }`}
            onClick={() => {
              setSelectedArea(area);
              setSelectedFile(null);
              setResult(null);
            }}
          >
            {area}
          </button>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />

      <button
        className="btn"
        onClick={() => fileInputRef.current.click()}
      >
        Select X-Ray Image
      </button>

      {selectedFile && <p>{selectedFile.name}</p>}

      <button
        className="btn"
        disabled={!selectedFile || !selectedArea || loading}
        onClick={handlePredict}
      >
        {loading ? "Scanning..." : "Scan X-Ray"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: result.color }}>
            <b>Assessment:</b> {result.assessment}
          </p>
          <p>
            <b>Confidence:</b>{" "}
            {(result.confidence * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}




/* ================= RISK PAGE ================= */
function RiskPage() {
  return (
    <div className="page-container">
      <Quiz />
    </div>
  );
}
/* ================= BLOOD REPORT PAGE ================= */
function BloodTestPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a PDF");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await fetch(`${API}/analyze-blood-report`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch {
      alert("Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Blood Report Analysis</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="btn" onClick={handleAnalyze}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          {Object.keys(result).map((key) => (
            <div
              key={key}
              style={{
                marginBottom: "15px",
                padding: "15px",
                border: "1px solid #334155",
                borderRadius: "10px",
              }}
            >
              <h4>{key}</h4>
              <p>Value: {result[key].value}</p>
              <p>Status: {result[key].status}</p>
              <p>Suggestion: {result[key].suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= MAP PAGE ================= */
function MapPage() {
  return (
    <div className="page-container">
      <h2 style={{ marginBottom: "20px" }}>
        Live Disease Outbreak Surveillance
      </h2>
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #334155",
        }}
      >
        <DiseaseMap />
      </div>
    </div>
  );
}

/* ================= APP ROOT ================= */
function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/home";
  const isLoggedIn = localStorage.getItem("aarogya_is_logged_in") === "true";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {isHomePage && (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: -1,
            opacity: 0.85,
            pointerEvents: "none",
          }}
        >
          <source src="/home-bg.mp4" type="video/mp4" />
        </video>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          padding: "0 20px",
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/mental-checkup"
            element={
              isLoggedIn ? <MentalCheckupPage /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/xray" element={<XrayPage />} />
          <Route path="/dashboard" element={<WellnessDashboard />} />
          <Route path="/wellness-dashboard" element={<WellnessDashboard />} />
          <Route path="/risk" element={<RiskPage />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/book-appointment" element={<BookingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/blood-test" element={<BloodTestPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
