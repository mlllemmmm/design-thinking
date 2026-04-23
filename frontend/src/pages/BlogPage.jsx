const articles = [
  {
    title: "AI in Healthcare: From Screening to Early Prevention",
    summary:
      "How machine learning can support earlier wellness interventions through predictive risk trends and personalized guidance.",
    category: "AI & Health",
  },
  {
    title: "Ayurveda and Everyday Wellness",
    summary:
      "Simple Ayurvedic routines for improving digestion, energy balance, and consistency in daily self-care.",
    category: "Ayurveda",
  },
  {
    title: "Practical Stress Management in Busy Lifestyles",
    summary:
      "A science-backed and holistic mix of breathwork, sleep hygiene, and digital boundaries to reduce mental fatigue.",
    category: "Mental Wellness",
  },
  {
    title: "Building Emotional Resilience Through Micro-Habits",
    summary:
      "Small daily check-ins that improve emotional regulation, focus, and well-being over time.",
    category: "Emotional Wellness",
  },
];

export default function BlogPage() {
  return (
    <div className="wellness-page">
      <section className="wellness-hero-card">
        <p className="wellness-eyebrow">Knowledge Hub</p>
        <h1>Wellness Blog</h1>
        <p>
          Practical insights at the intersection of AI, holistic wellness, and
          preventive healthcare.
        </p>
      </section>

      <section className="wellness-grid blog-grid">
        {articles.map((article) => (
          <article key={article.title} className="wellness-card blog-card">
            <span className="blog-tag">{article.category}</span>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <button className="btn">Read Article</button>
          </article>
        ))}
      </section>
    </div>
  );
}
