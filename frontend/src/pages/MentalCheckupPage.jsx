import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/onboarding.css";

const defaultAnswers = {
  stress: 3,
  sleep: 3,
  energy: 3,
  motivation: 3,
};

const questionLabels = [
  { key: "stress", label: "Stress level" },
  { key: "sleep", label: "Sleep quality" },
  { key: "energy", label: "Energy level" },
  { key: "motivation", label: "Motivation level" },
];

export default function MentalCheckupPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(defaultAnswers);

  const handleSliderChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = Object.values(answers);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    const score = Math.round(average * 20);

    const payload = {
      ...answers,
      average: Number(average.toFixed(2)),
      score,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem("aarogya_mental_checkup", JSON.stringify(payload));
    navigate("/dashboard");
  };

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card">
        <p className="onboarding-eyebrow">Step 2 of 2</p>
        <h1>Mental Wellness Checkup</h1>
        <p className="onboarding-subtitle">
          Rate each area from 1 (low) to 5 (high). Your score is calculated out of
          100.
        </p>

        <form className="checkup-form" onSubmit={handleSubmit}>
          {questionLabels.map((question) => (
            <label key={question.key} className="checkup-slider-group">
              <div className="checkup-slider-header">
                <span>{question.label}</span>
                <strong>{answers[question.key]}</strong>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                name={question.key}
                value={answers[question.key]}
                onChange={handleSliderChange}
              />
              <div className="checkup-slider-scale">
                <span>1</span>
                <span>5</span>
              </div>
            </label>
          ))}

          <button type="submit" className="onboarding-btn">
            Calculate Score & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
