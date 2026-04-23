const individualServices = [
  {
    title: "Physical Wellness Assessment",
    description:
      "AI-assisted screening for mobility, lifestyle risk, nutrition, and recovery indicators to support preventive care planning.",
  },
  {
    title: "Mental Wellness Assessment",
    description:
      "Structured emotional and stress check-ins with guided routines for focus, sleep quality, and mind-body balance.",
  },
  {
    title: "Emotional Wellness Assessment",
    description:
      "Insight-driven reflection tools that map mood patterns and daily habits to improve resilience and emotional stability.",
  },
];

const organizationServices = [
  "Corporate wellness screening programs",
  "School and college wellness readiness diagnostics",
  "Institution-level preventive health reporting",
  "Periodic employee/student wellness monitoring",
];

export default function ServicesPage() {
  return (
    <div className="wellness-page">
      <section className="wellness-hero-card">
        <p className="wellness-eyebrow">Services</p>
        <h1>Wellness Solutions for Individuals and Organizations</h1>
        <p>
          Aarogya AI delivers an AI-powered holistic wellness platform designed
          for physical health, mental health, and emotional well-being through
          practical, preventive assessments.
        </p>
      </section>

      <section className="wellness-grid two-col">
        <article className="wellness-card">
          <h2>Individual Wellness Services</h2>
          <div className="wellness-subgrid">
            {individualServices.map((service) => (
              <div key={service.title} className="wellness-subcard">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="wellness-card">
          <h2>Organizational Wellness Services</h2>
          <p>
            We partner with schools, corporate teams, and institutions to
            provide scalable, data-guided wellness programs that improve
            readiness and long-term health outcomes.
          </p>
          <ul className="wellness-list">
            {organizationServices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="wellness-highlight">
            <h3>Wellness Index for Organizations</h3>
            <p>
              A unified benchmark that combines attendance trends, stress
              markers, lifestyle risk factors, and engagement data into one
              actionable wellness index for leadership teams.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
