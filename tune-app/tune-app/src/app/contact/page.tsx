"use client";

import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: "600px" }}>
      <h1 className="heading-gradient" style={{ fontSize: "3rem", marginBottom: "1rem" }}>Contact Us</h1>
      
      {submitted ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
          <h2 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>Message Sent!</h2>
          <p style={{ color: "var(--text-secondary)" }}>Thank you for reaching out. We will get back to you soon.</p>
        </div>
      ) : (
        <form 
          className="glass-panel" 
          style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600 }}>Name</label>
            <input type="text" required style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)" }} placeholder="Your Name" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600 }}>Email</label>
            <input type="email" required style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)" }} placeholder="you@example.com" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: 600 }}>Message</label>
            <textarea required rows={5} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-main)", color: "var(--text-primary)", resize: "vertical" }} placeholder="How can we help you?" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "1rem", fontSize: "1.1rem", marginTop: "1rem" }}>
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
