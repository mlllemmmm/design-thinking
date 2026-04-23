import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../styles/dashboard.css";

const wellnessData = {
  wellnessScore: 72,
  status: "Good",
  risks: [
    { title: "Heart Risk", percentage: 24, level: "Low" },
    { title: "Diabetes Risk", percentage: 38, level: "Moderate" },
    { title: "Lung Risk", percentage: 19, level: "Low" },
  ],
  breakdown: [
    {
      title: "Physical Health Score",
      value: 78,
      note: "Strong vitals with room to improve activity consistency.",
    },
    {
      title: "Mental Health Score",
      value: 64,
      note: "Updated from your latest mental wellness checkup.",
    },
    {
      title: "Lifestyle Score",
      value: 71,
      note: "Sleep quality and hydration are trending in the right direction.",
    },
  ],
  trends: [
    { name: "Mon", score: 66 },
    { name: "Tue", score: 68 },
    { name: "Wed", score: 70 },
    { name: "Thu", score: 69 },
    { name: "Fri", score: 72 },
    { name: "Sat", score: 74 },
    { name: "Sun", score: 72 },
  ],
  comparison: [
    { name: "Physical", value: 78, color: "#10b981" },
    { name: "Mental", value: 64, color: "#34d399" },
    { name: "Lifestyle", value: 71, color: "#6ee7b7" },
  ],
  recommendations: [
    {
      title: "Stress management",
      text: "Schedule two short breathing breaks today and keep your next voice check-in under 5 minutes for faster mood calibration.",
    },
    {
      title: "Diet improvement",
      text: "Increase leafy greens and lean protein in one major meal to support stable glucose and energy levels.",
    },
    {
      title: "Lifestyle habits",
      text: "Aim for a fixed sleep window this week and take a 20-minute evening walk to lift recovery scores.",
    },
  ],
  mentalHealth: {
    emotion: "High Stress",
    summary:
      "Recent voice interaction shows signs of stress and mild fatigue. A short reset routine and reduced evening screen time may help.",
  },
  recentActivity: [
    {
      title: "Blood Test Analysis",
      detail: "Micronutrient summary generated",
      time: "Today, 10:30 AM",
    },
    {
      title: "X-Ray Analysis",
      detail: "Lung scan reviewed with low abnormality confidence",
      time: "Yesterday, 6:45 PM",
    },
    {
      title: "Risk Prediction",
      detail: "Heart and diabetes profile updated",
      time: "Yesterday, 4:10 PM",
    },
  ],
  quickActions: [
    { label: "Start Health Check", to: "/risk", style: "primary" },
    { label: "Upload Report", to: "/blood-test", style: "secondary" },
    { label: "Talk to AI Assistant", to: "/chat", style: "secondary" },
    { label: "Book Appointment", to: "/book-appointment", style: "secondary" },
  ],
};

const DAILY_GOALS = [
  "Drink water",
  "10 min walk",
  "Breathing exercise",
  "Sleep on time",
];

function getStoredMentalScore() {
  const raw = localStorage.getItem("aarogya_mental_checkup");
  if (!raw) return 64;
  try {
    const parsed = JSON.parse(raw);
    return Number.isFinite(parsed.score) ? parsed.score : 64;
  } catch {
    return 64;
  }
}

function parseRiskValue(value, fallback) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function getRiskLevel(percentage) {
  if (percentage >= 70) return "High";
  if (percentage >= 40) return "Moderate";
  return "Low";
}

function getStoredRiskData() {
  const raw = localStorage.getItem("aarogya_risk_assessment");
  if (!raw) {
    return {
      heart: wellnessData.risks[0].percentage,
      diabetes: wellnessData.risks[1].percentage,
      lung: wellnessData.risks[2].percentage,
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      heart: parseRiskValue(parsed.heart, wellnessData.risks[0].percentage),
      diabetes: parseRiskValue(parsed.diabetes, wellnessData.risks[1].percentage),
      lung: parseRiskValue(parsed.lung, wellnessData.risks[2].percentage),
    };
  } catch {
    return {
      heart: wellnessData.risks[0].percentage,
      diabetes: wellnessData.risks[1].percentage,
      lung: wellnessData.risks[2].percentage,
    };
  }
}

function getTodayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function getRiskTone(level) {
  if (level === "High") return "high";
  if (level === "Moderate") return "moderate";
  return "low";
}

function ScoreRing({ score }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="dashboard-ring">
      <svg viewBox="0 0 140 140" className="dashboard-ring-svg" aria-hidden="true">
        <circle
          className="dashboard-ring-track"
          cx="70"
          cy="70"
          r={radius}
          strokeWidth="12"
          fill="none"
        />
        <circle
          className="dashboard-ring-progress"
          cx="70"
          cy="70"
          r={radius}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </svg>
      <div className="dashboard-ring-value">
        <strong>{score}</strong>
        <span>/100</span>
      </div>
    </div>
  );
}

function RiskCard({ title, percentage, level }) {
  return (
    <div className="dashboard-card dashboard-risk-card">
      <div className="dashboard-card-header">
        <h3>{title}</h3>
        <span className={`dashboard-badge ${getRiskTone(level)}`}>{level}</span>
      </div>
      <p className="dashboard-risk-percentage">{percentage}%</p>
      <div className="dashboard-progress-bar">
        <div style={{ width: `${percentage}%` }} />
      </div>
      <p className="dashboard-muted">Latest AI screening estimate</p>
    </div>
  );
}

function BreakdownCard({ title, value, note }) {
  return (
    <div className="dashboard-breakdown-card">
      <div className="dashboard-breakdown-top">
        <h4>{title}</h4>
        <span>{value}%</span>
      </div>
      <div className="dashboard-progress-bar soft">
        <div style={{ width: `${value}%` }} />
      </div>
      <p>{note}</p>
    </div>
  );
}

export default function WellnessDashboard() {
  const [goalChecks, setGoalChecks] = useState(() => {
    const raw = localStorage.getItem("aarogya_daily_goals");
    if (!raw) {
      return DAILY_GOALS.map(() => false);
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.checks) && parsed.checks.length === DAILY_GOALS.length) {
        if (parsed.dateKey === getTodayKey()) {
          return parsed.checks.map(Boolean);
        }
      }
      return DAILY_GOALS.map(() => false);
    } catch {
      return DAILY_GOALS.map(() => false);
    }
  });

  const streak = useMemo(() => {
    const raw = localStorage.getItem("aarogya_goal_streak");
    if (!raw) return 0;
    try {
      const parsed = JSON.parse(raw);
      return Number.isFinite(parsed.streak) ? parsed.streak : 0;
    } catch {
      return 0;
    }
  }, [goalChecks]);

  const dynamicData = useMemo(() => {
    const mentalScore = getStoredMentalScore();
    const storedRiskData = getStoredRiskData();
    const physicalScore = 78;
    const lifestyleScore = 71;
    const overallScore = Math.round((mentalScore + physicalScore + lifestyleScore) / 3);

    return {
      ...wellnessData,
      risks: [
        {
          title: "Heart Risk",
          percentage: storedRiskData.heart,
          level: getRiskLevel(storedRiskData.heart),
        },
        {
          title: "Diabetes Risk",
          percentage: storedRiskData.diabetes,
          level: getRiskLevel(storedRiskData.diabetes),
        },
        {
          title: "Lung Risk",
          percentage: storedRiskData.lung,
          level: getRiskLevel(storedRiskData.lung),
        },
      ],
      wellnessScore: overallScore,
      breakdown: [
        {
          title: "Physical Health Score",
          value: physicalScore,
          note: "Placeholder score from baseline risk screening indicators.",
        },
        {
          title: "Mental Health Score",
          value: mentalScore,
          note: "Calculated from your latest Mental Wellness Checkup.",
        },
        {
          title: "Lifestyle Score",
          value: lifestyleScore,
          note: "Placeholder score from daily habit and recovery signals.",
        },
      ],
      comparison: [
        { name: "Physical", value: physicalScore, color: "#10b981" },
        { name: "Mental", value: mentalScore, color: "#34d399" },
        { name: "Lifestyle", value: lifestyleScore, color: "#6ee7b7" },
      ],
      status: overallScore >= 75 ? "Great" : overallScore >= 55 ? "Good" : "Needs attention",
    };
  }, []);

  const completedCount = goalChecks.filter(Boolean).length;

  const handleGoalToggle = (index) => {
    const updated = goalChecks.map((checked, idx) => (idx === index ? !checked : checked));
    setGoalChecks(updated);

    const todayKey = getTodayKey();
    localStorage.setItem(
      "aarogya_daily_goals",
      JSON.stringify({
        dateKey: todayKey,
        checks: updated,
      })
    );

    const allCompleted = updated.every(Boolean);
    const streakRaw = localStorage.getItem("aarogya_goal_streak");
    let streakData = { streak: 0, lastCompletedDate: "" };
    if (streakRaw) {
      try {
        const parsed = JSON.parse(streakRaw);
        streakData = {
          streak: Number.isFinite(parsed.streak) ? parsed.streak : 0,
          lastCompletedDate: typeof parsed.lastCompletedDate === "string" ? parsed.lastCompletedDate : "",
        };
      } catch {
        streakData = { streak: 0, lastCompletedDate: "" };
      }
    }

    if (!allCompleted) return;
    if (streakData.lastCompletedDate === todayKey) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yDay = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayKey = `${yesterday.getFullYear()}-${yMonth}-${yDay}`;

    const nextStreak =
      streakData.lastCompletedDate === yesterdayKey ? streakData.streak + 1 : 1;

    localStorage.setItem(
      "aarogya_goal_streak",
      JSON.stringify({
        streak: nextStreak,
        lastCompletedDate: todayKey,
      })
    );
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero-card">
        <div className="dashboard-wellness-card dashboard-card">
          <div>
            <p className="dashboard-eyebrow">Personal wellness snapshot</p>
            <h1>Wellness Dashboard</h1>
            <p className="dashboard-muted dashboard-intro">
              A unified view of your risk screening, lifestyle indicators, and
              recent AI health insights.
            </p>
            <div className="dashboard-status-row">
              <span className="dashboard-status-pill">
                {dynamicData.status} overall condition
              </span>
              <span className="dashboard-last-updated">
                Updated from recent health interactions
              </span>
            </div>
          </div>
          <div className="dashboard-score-layout">
            <div>
              <h2>Overall Wellness Score</h2>
              <p className="dashboard-score-caption">
                Balanced risk profile with moderate room for recovery and
                habit improvements.
              </p>
            </div>
            <ScoreRing score={dynamicData.wellnessScore} />
          </div>
        </div>

        <div className="dashboard-risk-grid">
          {dynamicData.risks.map((risk) => (
            <RiskCard key={risk.title} {...risk} />
          ))}
        </div>
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-column-wide">
          <div className="dashboard-card">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-eyebrow">Score breakdown</p>
                <h2>Wellness Breakdown</h2>
              </div>
            </div>
            <div className="dashboard-breakdown-grid">
              {dynamicData.breakdown.map((item) => (
                <BreakdownCard key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="dashboard-chart-grid">
            <div className="dashboard-card dashboard-chart-card">
              <div className="dashboard-section-heading">
                <div>
                  <p className="dashboard-eyebrow">Weekly pattern</p>
                  <h2>Wellness Trends</h2>
                </div>
              </div>
              <div className="dashboard-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dynamicData.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis domain={[50, 100]} stroke="#6b7280" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#059669", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-card dashboard-chart-card">
              <div className="dashboard-section-heading">
                <div>
                  <p className="dashboard-eyebrow">Current comparison</p>
                  <h2>Health Pillars</h2>
                </div>
              </div>
              <div className="dashboard-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicData.comparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis domain={[0, 100]} stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {dynamicData.comparison.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-eyebrow">AI guidance</p>
                <h2>Recommendations</h2>
              </div>
            </div>
            <div className="dashboard-recommendations-grid">
              {dynamicData.recommendations.map((item) => (
                <div key={item.title} className="dashboard-recommendation-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-column-side">
          <div className="dashboard-card">
            <p className="dashboard-eyebrow">Voice insight</p>
            <h2>Mental Health Summary</h2>
            <div className="dashboard-mental-summary">
              <span className="dashboard-badge moderate">
                {dynamicData.mentalHealth.emotion}
              </span>
              <p>{dynamicData.mentalHealth.summary}</p>
              <span className="dashboard-muted">
                Based on your recent voice interaction
              </span>
            </div>
          </div>

          <div className="dashboard-card">
            <p className="dashboard-eyebrow">Recent usage</p>
            <h2>Recent Activity</h2>
            <div className="dashboard-activity-list">
              {dynamicData.recentActivity.map((activity) => (
                <div key={`${activity.title}-${activity.time}`} className="dashboard-activity-item">
                  <div>
                    <h4>{activity.title}</h4>
                    <p>{activity.detail}</p>
                  </div>
                  <span>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <p className="dashboard-eyebrow">Habit tracking</p>
            <h2>Today&apos;s Goals</h2>
            <p className="dashboard-muted dashboard-goals-meta">
              Completed {completedCount}/{DAILY_GOALS.length} goals - Streak: {streak} day
              {streak === 1 ? "" : "s"}
            </p>
            <div className="dashboard-goals-list">
              {DAILY_GOALS.map((goal, index) => (
                <label key={goal} className="dashboard-goal-item">
                  <input
                    type="checkbox"
                    checked={goalChecks[index]}
                    onChange={() => handleGoalToggle(index)}
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <p className="dashboard-eyebrow">Fast access</p>
            <h2>Quick Actions</h2>
            <div className="dashboard-actions-grid">
              {dynamicData.quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`dashboard-action-btn ${action.style}`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
