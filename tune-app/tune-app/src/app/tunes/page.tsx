"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 🚀 Import the Next.js router engine

const TYPEWRITER_TEXT = "What is your genre?";
const TYPEWRITER_DURATION_MS = 2000;

const CATEGORIES = [
  {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    desc: "Melancholic & heartfelt melodies",
    color: "#60a5fa",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0c1a2e 100%)",
    glow: "rgba(96, 165, 250, 0.3)",
    count: "1.2K tunes",
  },
  {
    id: "happy",
    label: "Happy",
    emoji: "😄",
    desc: "Upbeat, joyful & feel-good",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #5c3d0a 0%, #2c1a02 100%)",
    glow: "rgba(251, 191, 36, 0.3)",
    count: "2.4K tunes",
  },
  {
    id: "romantic",
    label: "Romantic",
    emoji: "💕",
    desc: "Love songs & soulful vibes",
    color: "#f472b6",
    gradient: "linear-gradient(135deg, #5b1a3c 0%, #2a0a1c 100%)",
    glow: "rgba(244, 114, 182, 0.3)",
    count: "980 tunes",
  },
  {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    desc: "High-tempo & hype anthems",
    color: "#e11d48",
    gradient: "linear-gradient(135deg, #5c0a1c 0%, #2a0209 100%)",
    glow: "rgba(225, 29, 72, 0.3)",
    count: "3.1K tunes",
  },
  {
    id: "chill",
    label: "Chill",
    emoji: "🌊",
    desc: "Relaxed lo-fi & ambient beats",
    color: "#34d399",
    gradient: "linear-gradient(135deg, #0a3d2c 0%, #031a12 100%)",
    glow: "rgba(52, 211, 153, 0.3)",
    count: "1.8K tunes",
  },
  {
    id: "motivational",
    label: "Motivational",
    emoji: "🔥",
    desc: "Push your limits every day",
    color: "#fb923c",
    gradient: "linear-gradient(135deg, #5c2808 0%, #2a0f02 100%)",
    glow: "rgba(251, 146, 60, 0.3)",
    count: "750 tunes",
  },
  {
    id: "dark",
    label: "Dark",
    emoji: "🌑",
    desc: "Intense & cinematic atmosphere",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #2e1a5c 0%, #120a2a 100%)",
    glow: "rgba(167, 139, 250, 0.3)",
    count: "640 tunes",
  },
  {
    id: "party",
    label: "Party",
    emoji: "🎉",
    desc: "Dance floors & late-night bangers",
    color: "#22d3ee",
    gradient: "linear-gradient(135deg, #0a3d4a 0%, #021a20 100%)",
    glow: "rgba(34, 211, 238, 0.3)",
    count: "1.5K tunes",
  },
];

function useTypewriter(text: string, durationMs: number) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text.length) return;

    const intervalMs = durationMs / text.length;
    let index = 0;

    const timer = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [text, durationMs]);

  return { displayed, done };
}

export default function TunesMarketplace() {
  const router = useRouter(); // Initialize router hook
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT, TYPEWRITER_DURATION_MS);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "2rem", paddingBottom: "6rem" }}>

      {/* ── Typewriter Heading ── */}
      <h1
        className="heading-gradient dynamic-genre-heading"
        style={{ marginBottom: "0.75rem" }}
      >
        {displayed}
        <span
          className="typewriter-cursor"
          style={{
            display: "inline-block",
            background: "var(--accent-primary)",
            marginLeft: "4px",
            verticalAlign: "middle",
            borderRadius: "2px",
            animation: done ? "none" : "blink 0.75s step-end infinite",
            opacity: done ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        />
      </h1>
      
      {/* Scope block styling for layout responsiveness */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Desktop Sizing defaults */
        .dynamic-genre-heading {
          font-size: 3.5rem;
          min-height: 4.5rem;
        }
        .typewriter-cursor {
          width: 3px;
          height: 3.2rem;
        }

        /* Mobile Layout Sizing (Max width breaks at 768px devices) */
        @media (max-width: 768px) {
          .dynamic-genre-heading {
            font-size: 2.1rem;
            min-height: 5.5rem; /* Room for broken multi lines layout text container wrappers */
            line-height: 1.25;
          }
          .typewriter-cursor {
            width: 2.5px;
            height: 2.0rem;
          }
          /* 🚀 Hide description subtitle on mobile layout viewports */
          .mobile-hide-desc {
            display: none !important;
          }
        }
      `}</style>

      {/* 🚀 Added className "mobile-hide-desc" to manage display state responsiveness */}
      <p 
        className="mobile-hide-desc" 
        style={{ color: "var(--text-secondary)", marginBottom: "3.5rem", fontSize: "1.15rem" }}
      >
        Pick a mood and discover tunes made for that feeling.
      </p>

      {/* ── Category Cards Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {CATEGORIES.map((cat) => {
          const isHovered = hoveredCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => router.push(`/tunes/${cat.id}`)}
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                background: isHovered ? cat.gradient : "rgba(255,255,255,0.025)",
                border: `1px solid ${isHovered ? cat.color + "40" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "24px",
                padding: "2.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "1rem",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isHovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
                boxShadow: isHovered ? `0 12px 32px ${cat.glow}` : "0 4px 16px rgba(0,0,0,0.15)",
                textAlign: "left",
                outline: "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background decoration circle */}
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: cat.color,
                  opacity: isHovered ? 0.08 : 0.04,
                  transition: "opacity 0.35s ease",
                  pointerEvents: "none",
                }}
              />

              {/* Emoji bubble */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "18px",
                  background: `${cat.color}20`,
                  border: `1px solid ${cat.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isHovered ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
                  flexShrink: 0,
                }}
              >
                {cat.emoji}
              </div>

              {/* Text group */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%" }}>
                <span
                  style={{
                    fontWeight: "800",
                    fontSize: "1.35rem",
                    color: isHovered ? cat.color : "var(--text-primary)",
                    transition: "color 0.25s ease",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {cat.label}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: isHovered ? "rgba(255,255,255,0.65)" : "var(--text-secondary)",
                    lineHeight: 1.5,
                    transition: "color 0.25s ease",
                  }}
                >
                  {cat.desc}
                </span>
              </div>

              {/* Footer row: tune count + arrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "0.25rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: isHovered ? cat.color : "var(--text-secondary)",
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}30`,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    transition: "all 0.25s ease",
                  }}
                >
                  {cat.count}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isHovered ? cat.color : "var(--text-secondary)"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transition: "all 0.25s ease",
                    transform: isHovered ? "translateX(4px)" : "translateX(0)",
                  }}
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}