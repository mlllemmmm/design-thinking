const userInfo = {
  name: "Aarogya User",
  email: "user@aarogyaai.com",
  phone: "+91 90000 00000",
  wellnessLevel: "Balanced",
};

const assessmentHistory = [
  {
    type: "Risk Prediction",
    date: "21 Apr 2026",
    result: "Moderate diabetes risk",
  },
  {
    type: "X-Ray Analysis",
    date: "20 Apr 2026",
    result: "No significant abnormality detected",
  },
  {
    type: "Blood Test Analysis",
    date: "18 Apr 2026",
    result: "Mild vitamin D deficiency indicator",
  },
  {
    type: "Mental Wellness Check",
    date: "17 Apr 2026",
    result: "Elevated stress markers",
  },
];

export default function ProfilePage() {
  return (
    <div className="wellness-page">
      <section className="wellness-hero-card">
        <p className="wellness-eyebrow">Profile</p>
        <h1>User Wellness Profile</h1>
        <p>
          Your personal dashboard for account details and historical wellness
          assessments.
        </p>
      </section>

      <section className="wellness-grid two-col">
        <article className="wellness-card">
          <h2>Basic Information</h2>
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {userInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {userInfo.phone}
            </p>
            <p>
              <strong>Current Wellness Level:</strong> {userInfo.wellnessLevel}
            </p>
          </div>
        </article>

        <article className="wellness-card">
          <h2>Assessment History</h2>
          <div className="history-list">
            {assessmentHistory.map((item) => (
              <div key={`${item.type}-${item.date}`} className="history-item">
                <h3>{item.type}</h3>
                <p>{item.result}</p>
                <span>{item.date}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
