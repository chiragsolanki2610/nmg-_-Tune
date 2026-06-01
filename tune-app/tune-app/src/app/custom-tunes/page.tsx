"use client";

import { useState } from "react";

export default function CustomTunes() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: "800px" }}>
      <h1 className="heading-gradient" style={{ fontSize: "3rem", marginBottom: "1rem" }}>Custom Services</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "3rem", fontSize: "1.2rem" }}>
        Need something unique? Request a custom tune directly from our top producers.
      </p>

      {submitted ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
          <h2 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>Request Submitted!</h2>
          <p style={{ color: "var(--text-secondary)" }}>We will get back to you with a quote shortly.</p>
          <button className="btn btn-secondary" style={{ marginTop: "2rem" }} onClick={() => setSubmitted(false)}>
            Submit Another Request
          </button>
        </div>
      ) : (
        <form 
          className="glass-panel" 
          style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600 }}>Your Email</label>
            <input type="email" required style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)" }} placeholder="Enter your email" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600 }}>Tune Style / Genre</label>
            <input type="text" required style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)" }} placeholder="e.g. Cinematic Orchestral, Lo-Fi" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600 }}>Description</label>
            <textarea required rows={5} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", resize: "vertical" }} placeholder="Describe the mood, instruments, and any specific requirements..." />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "1rem", fontSize: "1.1rem", marginTop: "1rem" }}>
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
