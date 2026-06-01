export default function About() {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: "800px" }}>
      <h1 className="heading-gradient" style={{ fontSize: "3rem", marginBottom: "1rem" }}>About nmg-_-Tunes</h1>
      
      <div className="glass-panel" style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <p style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
          Welcome to <strong style={{ color: "var(--accent-primary)" }}>nmg-_-Tunes</strong>, the premier hybrid digital marketplace and service portal for high-quality audio tunes.
        </p>
        
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
          We created nmg-_-Tunes because we saw a gap between talented creators who make amazing music and the developers, video editors, and creatives who need those exact sounds.
        </p>

        <h3 style={{ fontSize: "1.5rem", marginTop: "1rem" }}>Our Mission</h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Our mission is to empower both sides of the creative aisle. Whether you are browsing our marketplace for the perfect background track or requesting a completely custom composition through our service portal, we ensure a seamless and high-quality experience.
        </p>
      </div>
    </div>
  );
}
