import React from "react";
import "../styles/wellness-pages.css"; // Ensure standard CSS flows in

export default function WellnessPage() {
  return (
    <div className="page-container" style={{ textAlign: "center", padding: "40px 20px" }}>
      <h2 style={{ fontSize: "2.5rem", color: "#064e3b", marginBottom: "10px" }}>Wellness Hub</h2>
      <p style={{ color: "#334155", marginBottom: "40px", fontSize: "1.1rem" }}>
        Take a moment for your physical and mental health. Follow these guided sessions to feel your best.
      </p>

      {/* Quick Workouts Section */}
      <section style={{ marginBottom: "50px" }}>
        <h3 style={{ fontSize: "1.8rem", color: "#166534", marginBottom: "20px" }}>Quick Workouts</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ maxWidth: "560px", width: "100%" }}>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", border: "2px solid #bbf7d0" }}>
              <iframe
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                src="https://www.youtube.com/embed/ml6cT4AZdqI"
                title="10 Minute Home Workout"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p style={{ marginTop: "10px", color: "#475569", fontWeight: "bold" }}>10-Minute Full Body Workout</p>
          </div>
        </div>
      </section>

      {/* Meditation & Stress Relief Section */}
      <section>
        <h3 style={{ fontSize: "1.8rem", color: "#166534", marginBottom: "20px" }}>Meditation & Stress Relief</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", maxWidth: "1000px", margin: "0 auto" }}>
          
          <div>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", border: "2px solid #bbf7d0" }}>
              <iframe
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                src="https://www.youtube.com/embed/inpok4MKVLM"
                title="5 Minute Meditation"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p style={{ marginTop: "10px", color: "#475569", fontWeight: "bold" }}>5-Minute Guided Meditation</p>
          </div>

          <div>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", border: "2px solid #bbf7d0" }}>
              <iframe
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                src="https://www.youtube.com/embed/v7AYKMP6rOE"
                title="Yoga for Stress Relief"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p style={{ marginTop: "10px", color: "#475569", fontWeight: "bold" }}>15-Minute Yoga for Stress Relief</p>
          </div>

        </div>
      </section>
    </div>
  );
}
