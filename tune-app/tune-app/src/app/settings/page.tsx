"use client";

import { useTheme } from "@/context/ThemeContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: "800px" }}>
      <h1 className="heading-gradient" style={{ fontSize: "3rem", marginBottom: "1rem" }}>Settings</h1>
      
      <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Appearance</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontWeight: 600 }}>Theme Preference</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Toggle between Light and Dark mode.</p>
            </div>
            <button className="btn btn-secondary" onClick={toggleTheme}>
              {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            </button>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Account</h2>
          <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
            Account management features are coming soon.
          </p>
        </div>
        
      </div>
    </div>
  );
}
