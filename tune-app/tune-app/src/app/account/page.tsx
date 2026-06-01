"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flexDirection: "column", gap: "1rem" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "9999px",
          border: "3px solid var(--accent-primary)", borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Loading your profile…</p>
      </div>
    );
  }

  const displayName = user.username || (user as any).name || user.email?.split("@")[0] || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const memberSince = (user as any).createdAt
    ? new Date((user as any).createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Member";

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 24px rgba(225,29,72,0.3); }
          50% { box-shadow: 0 0 48px rgba(225,29,72,0.6); }
        }
        .account-card { animation: floatUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .account-card:nth-child(1) { animation-delay: 0ms; }
        .account-card:nth-child(2) { animation-delay: 80ms; }
        .account-card:nth-child(3) { animation-delay: 160ms; }
        .account-card:nth-child(4) { animation-delay: 240ms; }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(225,29,72,0.12);
          border-radius: 20px;
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.3s ease;
          cursor: default;
        }
        .stat-card:hover {
          background: rgba(225,29,72,0.05);
          border-color: rgba(225,29,72,0.3);
          transform: translateY(-3px);
        }
        .quick-link-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 1.5rem;
          text-decoration: none;
          color: var(--text-primary);
          transition: background 0.2s ease;
        }
        .quick-link-row:hover { background: rgba(225,29,72,0.05); }
        .sign-out-btn {
          background: transparent;
          border: 1px solid rgba(225,29,72,0.35);
          color: var(--accent-primary);
          padding: 0.8rem 2.5rem;
          border-radius: 9999px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
          width: 100%;
          max-width: 220px;
        }
        .sign-out-btn:hover {
          background: rgba(225,29,72,0.1);
          border-color: var(--accent-primary);
          box-shadow: 0 0 20px rgba(225,29,72,0.2);
          transform: translateY(-1px);
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .account-hero { padding: 1.75rem 1.25rem !important; }
          .account-hero-name { font-size: 1.5rem !important; }
          .avatar-circle { width: 60px !important; height: 60px !important; font-size: 1.5rem !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        padding: "5.5rem 1.5rem 6rem",
        maxWidth: "680px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}>

        {/* ── Hero: avatar + name ── */}
        <div
          className="account-card glass-panel account-hero"
          style={{
            padding: "2.5rem 2rem",
            borderRadius: "28px",
            background: "linear-gradient(135deg, rgba(225,29,72,0.08) 0%, rgba(19,18,21,0.7) 60%)",
            border: "1px solid rgba(225,29,72,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow blob */}
          <div style={{
            position: "absolute",
            top: "-40px", right: "-40px",
            width: "160px", height: "160px",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(225,29,72,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Avatar */}
          <div
            className="avatar-circle"
            style={{
              width: "80px", height: "80px",
              borderRadius: "9999px",
              background: "var(--accent-gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", color: "white", fontWeight: "800",
              flexShrink: 0,
              animation: "pulseGlow 3s ease-in-out infinite",
              border: "2px solid rgba(225,29,72,0.4)",
            }}
          >
            {avatarLetter}
          </div>

          {/* Name + email + badge */}
          <div style={{ minWidth: 0 }}>
            <h2
              className="account-hero-name"
              style={{
                fontSize: "1.9rem", fontWeight: "800",
                margin: "0 0 0.2rem 0",
                color: "var(--text-primary)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}
            >
              {displayName}
            </h2>
            <p style={{
              margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {user.email}
            </p>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.35rem",
              marginTop: "0.65rem", fontSize: "0.72rem", fontWeight: "600",
              color: "var(--accent-primary)",
              background: "rgba(225,29,72,0.1)",
              border: "1px solid rgba(225,29,72,0.2)",
              padding: "0.2rem 0.65rem", borderRadius: "9999px",
            }}>
              <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
              {memberSince}
            </span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div
          className="account-card stats-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
        >
          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15V6" /><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" />
              </svg>
              <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                My Uploads
              </span>
            </div>
            <p style={{ fontSize: "2.6rem", fontWeight: "800", margin: 0, color: "var(--text-primary)", lineHeight: 1 }}>0</p>
            <p style={{ fontSize: "0.73rem", color: "var(--text-secondary)", margin: 0 }}>tracks shared</p>
          </div>

          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
              <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Custom Requests
              </span>
            </div>
            <p style={{ fontSize: "2.6rem", fontWeight: "800", margin: 0, color: "var(--text-primary)", lineHeight: 1 }}>0</p>
            <p style={{ fontSize: "0.73rem", color: "var(--text-secondary)", margin: 0 }}>commissions</p>
          </div>
        </div>

        {/* ── Quick links ── */}
        <div
          className="account-card"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {[
            {
              label: "Browse Tunes",
              sub: "Explore the full catalog",
              href: "/tunes",
              icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              ),
            },
            {
              label: "Request Custom Tune",
              sub: "Commission a track from creators",
              href: "/custom-tunes",
              icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              ),
            },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="quick-link-row"
              style={{ borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            >
              <div style={{
                width: "38px", height: "38px", borderRadius: "10px",
                background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent-primary)", flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "0.95rem" }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: "0.77rem", color: "var(--text-secondary)" }}>{item.sub}</p>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          ))}
        </div>

        {/* ── Sign out ── */}
        <div className="account-card" style={{ display: "flex", justifyContent: "center", paddingTop: "0.25rem" }}>
          <button onClick={logout} className="sign-out-btn">
            Sign Out
          </button>
        </div>

      </div>
    </>
  );
}