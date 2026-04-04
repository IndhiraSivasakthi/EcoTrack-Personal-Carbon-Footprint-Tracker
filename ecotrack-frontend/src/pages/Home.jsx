import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const features = [
    "Track transport, food, and energy emissions",
    "Visualize daily and weekly CO₂ trends",
    "Get smart eco-friendly suggestions"
  ];

  const highlights = [
    {
      title: "Easy daily logging",
      text: "Add your activities in seconds and keep your footprint record up to date."
    },
    {
      title: "Clear progress view",
      text: "Understand your habits with simple insights and a clean personal dashboard."
    },
    {
      title: "Smarter choices",
      text: "Discover practical ways to reduce emissions without changing everything at once."
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>

        <div className="hero-content">
          <span className="hero-pill">Personal Carbon Footprint Tracker</span>
          <h1>Build a greener lifestyle with smarter daily tracking.</h1>
          <p>
            EcoTrack helps you monitor your carbon emissions from everyday
            activities and gives you clear insights to reduce your impact.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-btn primary">
              Get Started
            </Link>
            <Link to="/login" className="hero-btn secondary">
              Login
            </Link>
          </div>

          <div className="feature-list">
            {features.map((item, index) => (
              <div className="feature-item" key={index}>
                <span className="feature-dot"></span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-panel hero-info-panel">
          <div className="info-box">
            <span className="info-label">Why EcoTrack?</span>
            <h3>Simple tools for better eco habits</h3>
            <p>
              Start with small actions, understand your impact, and improve
              your routine with better daily awareness.
            </p>
          </div>

          <div className="info-grid">
            {highlights.map((item, index) => (
              <div className="info-card" key={index}>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}