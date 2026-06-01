"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const FOOTER_LINKS = [
  {
    heading: "Explore",
    links: [
      { label: "Category", href: "/tunes" },
      { label: "Trending", href: "/tunes?sort=trending" },
      { label: "New Releases", href: "/tunes?sort=new" },
      { label: "Top Artists", href: "/tunes?filter=artists" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Custom Tune", href: "/custom-tunes" },
      { label: "Licensing", href: "/licensing" },
      { label: "Collaborate", href: "/collaborate" },
      { label: "Upload a Tune", href: "/upload" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "X / Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@l.o.s.t.m.u.s.i.c",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "SoundCloud",
    href: "https://soundcloud.com",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.175 12.225c-.017 0-.033.002-.049.003l-.117-1.075.117-2.05a.55.55 0 01.049-.003c.601 0 1.075.481 1.075 1.063v.999c0 .582-.474 1.063-1.075 1.063zm2.694 1.109a.55.55 0 01-.549.549.55.55 0 01-.549-.549v-4.988a.55.55 0 01.549-.549.55.55 0 01.549.549v4.988zm2.09.325a.55.55 0 01-.549.549.55.55 0 01-.549-.549V9.554a.55.55 0 01.549-.549.55.55 0 01.549.549v4.105zm2.09.22a.55.55 0 01-.549.549.55.55 0 01-.549-.549V9.33a.55.55 0 01.549-.549.55.55 0 01.549.549v4.55zm2.09-.018a.55.55 0 01-.549.549.55.55 0 01-.549-.549V9.015a.55.55 0 01.549-.549.55.55 0 01.549.549v4.846zm2.09-.228a.55.55 0 01-.549.549.55.55 0 01-.549-.549V8.91a.55.55 0 01.549-.549.55.55 0 01.549.549v4.723zm2.673.518a3.34 3.34 0 01-3.34-3.34 3.34 3.34 0 013.34-3.34c.344 0 .676.052.99.149A5.04 5.04 0 0119 7.375a5.04 5.04 0 015.04 5.04 5.04 5.04 0 01-5.04 5.04H14.812z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer style={{ width: "100%", position: "relative", marginTop: "4rem" }}>
      {/* Glowing top accent line */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(225,29,72,0.6) 30%, #e11d48 50%, rgba(225,29,72,0.6) 70%, transparent 100%)",
          boxShadow: "0 0 20px rgba(225,29,72,0.4)",
        }}
      />

      {/* Main footer surface */}
      <div
        style={{
          background: isLight
            ? "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,246,255,0.95) 100%)"
            : "linear-gradient(180deg, rgba(10,9,13,0.98) 0%, rgba(6,5,9,1) 100%)",
          backdropFilter: "blur(24px)",
          transition: "background 0.3s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background glows */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(225,29,72,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "15%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Newsletter CTA Banner (HIDDEN ON MOBILE) ── */}
        {!isMobile && (
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "3.5rem 2.5rem 0",
            }}
          >
            <div
              style={{
                background: isLight
                  ? "linear-gradient(135deg, rgba(225,29,72,0.06) 0%, rgba(124,58,237,0.04) 100%)"
                  : "linear-gradient(135deg, rgba(225,29,72,0.1) 0%, rgba(124,58,237,0.08) 100%)",
                border: `1px solid ${isLight ? "rgba(225,29,72,0.12)" : "rgba(225,29,72,0.18)"}`,
                borderRadius: "24px",
                padding: "2.5rem 3rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "-30px",
                  top: "-30px",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(225,29,72,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>🎵</span>
                  <h3
                    style={{
                      fontSize: "1.45rem",
                      fontWeight: "800",
                      color: isLight ? "#111827" : "#fff",
                      margin: 0,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    Stay in the loop
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)",
                    margin: 0,
                    lineHeight: "1.4",
                  }}
                >
                  Get the freshest drops, trending tracks & creator updates straight to your inbox.
                </p>
              </div>

              {/* Email subscribe form */}
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "0.75rem",
                  width: "auto",
                  flexShrink: 0,
                }}
              >
                {subscribed ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      color: "#34d399",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      background: "rgba(52,211,153,0.1)",
                      border: "1px solid rgba(52,211,153,0.3)",
                      borderRadius: "9999px",
                      padding: "0.65rem 1.25rem",
                      width: "auto",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    You're subscribed!
                  </div>
                ) : (
                  <>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "9999px",
                        padding: "0.75rem 1.25rem",
                        fontSize: "0.88rem",
                        color: isLight ? "#111" : "#fff",
                        outline: "none",
                        width: "240px",
                        boxSizing: "border-box",
                        transition: "border 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.border = "1px solid #e11d48";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border = `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`;
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
                        border: "none",
                        borderRadius: "9999px",
                        padding: "0.75rem 1.5rem",
                        color: "#fff",
                        fontWeight: "700",
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(225,29,72,0.35)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        width: "auto",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 6px 24px rgba(225,29,72,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(225,29,72,0.35)";
                      }}
                    >
                      Subscribe
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        )}

        {/* ── Brand Section Layout ── */}
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: isMobile ? "2rem 1.5rem" : "3.5rem 2.5rem 2.5rem",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.8fr repeat(3, 1fr)",
            gap: isMobile ? "2rem" : "3rem",
          }}
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link href="/" style={{ display: "inline-block" }}>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: "#e11d48",
                  letterSpacing: "-0.5px",
                  textShadow: "0 0 30px rgba(225,29,72,0.3)",
                }}
              >
                nmg-_-Tunes
              </span>
            </Link>

            <p
              style={{
                fontSize: "0.88rem",
                color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
                maxWidth: "300px",
                margin: 0,
              }}
            >
              Your premium destination for discovering, sharing, and commissioning high-quality tunes from creators worldwide.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.45)",
                    border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
                    background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)",
                    transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#e11d48";
                    e.currentTarget.style.borderColor = "rgba(225,29,72,0.4)";
                    e.currentTarget.style.background = "rgba(225,29,72,0.08)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.45)";
                    e.currentTarget.style.borderColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
                    e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns (HIDDEN COMPLETELY ON MOBILE) */}
          {!isMobile && FOOTER_LINKS.map((col) => (
            <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.15rem" }}>
                <div
                  style={{
                    width: "18px",
                    height: "2px",
                    background: "linear-gradient(90deg, #e11d48, #be123c)",
                    borderRadius: "9999px",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "800",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: isLight ? "#111827" : "#fff",
                    margin: 0,
                  }}
                >
                  {col.heading}
                </p>
              </div>

              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: "0.88rem",
                    color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.5)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#e11d48";
                    e.currentTarget.style.paddingLeft = "6px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.5)";
                    e.currentTarget.style.paddingLeft = "0px";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
            maxWidth: "1400px",
            margin: "0 auto",
            padding: isMobile ? "1.5rem 1rem" : "1.5rem 2.5rem",
            display: "flex",
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontSize: "0.8rem", color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#e11d48" }}>nmg-_-Tunes</span>
            <span style={{ fontSize: "0.8rem", color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.3)" }}>
              · All rights reserved.
            </span>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link
                key={item}
                href="#"
                style={{
                  fontSize: "0.8rem",
                  color: isLight ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.32)",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#e11d48";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isLight ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.32)";
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}