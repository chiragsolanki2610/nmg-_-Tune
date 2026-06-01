"use client";

import React, { useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function AudioPlayer() {
  const { theme } = useTheme();
  const { playingTrack, isPlaying, currentTime, duration, seek, handlePlayTrack } = useAudio();
  const isLight = theme === "light";
  const seekBarRef = useRef<HTMLDivElement>(null);

  const barHeights = [22, 30, 26, 34, 24, 32, 28, 20, 36, 25, 31, 23, 29, 35, 21, 33, 27, 19, 34, 26, 30, 22, 28, 24];

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarRef.current || duration === 0) return;
    const rect = seekBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * duration);
  };

  const handleSeekTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!seekBarRef.current || duration === 0) return;
    const rect = seekBarRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, touchX / rect.width));
    seek(ratio * duration);
  };

  if (!playingTrack) return null;

  return (
    <>
      <style>{`
        .audio-player-desktop { display: flex; }
        .audio-player-mobile-bar { display: none !important; }

        @media (max-width: 768px) {
          .audio-player-desktop { display: none !important; }
          .audio-player-mobile-bar { display: flex !important; }
        }

        @keyframes mobileEqBounce {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }

        @keyframes slideUpPlayer {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .seek-bar-track:active .seek-bar-thumb {
          transform: scale(1.4);
        }
      `}</style>

      {/* ── DESKTOP: Original circular disc player (unchanged) ── */}
      <div
        className="animate-fade-in audio-player audio-player-desktop"
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          left: "auto",
          zIndex: 1000,
          padding: "0.5rem 0.75rem",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.85rem",
          background: "transparent",
          boxShadow: "none",
          border: "none",
          minWidth: "auto",
          width: "auto",
          color: isLight ? "#111827" : "#fff",
        }}
      >
        <div
          onClick={() => handlePlayTrack(playingTrack)}
          style={{
            cursor: "pointer",
            position: "relative",
            width: "220px",
            height: "220px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
            padding: 0,
          }}
          title={isPlaying ? "Pause" : "Play"}
        >
          <div
            className={`${isPlaying ? "rotate-disc" : "rotate-disc rotate-disc-paused"}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              margin: 0,
              padding: 0,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[...Array(24)].map((_, index) => {
              const angle = index * 15;
              const height = barHeights[index % barHeights.length];
              const delay = (index * 0.08).toFixed(2);
              return (
                <span
                  key={angle}
                  className={`eq-ring-bar eq-ring-bar-${index}`}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-65px) scaleY(var(--bar-scale, 1))`,
                    height: `${height}px`,
                    width: "3px",
                    animationDelay: `${delay}s`,
                    opacity: isPlaying ? 1 : 0.2,
                    transformOrigin: "center",
                    margin: 0,
                    padding: 0,
                  }}
                />
              );
            })}
            <div
              className="cd-disc"
              style={{
                position: "absolute",
                width: "100px",
                height: "100px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", width: "100%", maxWidth: "150px" }}>
          <p style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            margin: 0,
            color: isLight ? "#111827" : "#fff",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}>
            {playingTrack.title}
          </p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--accent-primary)", textAlign: "center" }}>
            By {playingTrack.artist}
          </p>
          <div style={{ width: "60px", height: "3px", borderRadius: "9999px", background: "var(--accent-primary)", marginTop: "4px" }} />
        </div>
      </div>

      {/* ── MOBILE: Rectangular bottom bar with seek timeline ── */}
      {playingTrack && (
        <div
          className="audio-player-mobile-bar"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            background: isLight ? "rgba(255,255,255,0.97)" : "rgba(13,12,15,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(225,29,72,0.2)",
            flexDirection: "column",
            animation: "slideUpPlayer 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* ── Progress / Seek bar ── */}
          <div
            ref={seekBarRef}
            className="seek-bar-track"
            onClick={handleSeekClick}
            onTouchMove={handleSeekTouch}
            onTouchStart={handleSeekTouch}
            style={{
              width: "100%",
              height: "28px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "0 1.25rem",
              boxSizing: "border-box",
              touchAction: "none",
            }}
          >
            {/* Track background */}
            <div style={{ position: "relative", width: "100%", height: "4px", borderRadius: "9999px", background: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}>
              {/* Filled portion */}
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${progress}%`,
                borderRadius: "9999px",
                background: "linear-gradient(90deg, #e11d48, #ff5e84)",
                transition: "width 0.25s linear",
              }} />
              {/* Thumb dot */}
              <div
                className="seek-bar-thumb"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${progress}%`,
                  transform: "translate(-50%, -50%)",
                  width: "14px",
                  height: "14px",
                  borderRadius: "9999px",
                  background: "#e11d48",
                  boxShadow: "0 0 8px rgba(225,29,72,0.7)",
                  transition: "left 0.25s linear, transform 0.15s ease",
                }}
              />
            </div>
          </div>

          {/* Time labels */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 1.25rem", marginTop: "-6px", marginBottom: "4px" }}>
            <span style={{ fontSize: "0.68rem", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(currentTime)}
            </span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Bottom row: EQ bars + track info + play button */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0 1.25rem 0.9rem" }}>
            {/* Mini EQ bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "28px", flexShrink: 0 }}>
              {[40, 70, 55, 85, 60, 75, 45, 65, 80, 50].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: "3px",
                    height: `${isPlaying ? h : h * 0.3}%`,
                    borderRadius: "2px",
                    background: "var(--accent-primary)",
                    transformOrigin: "bottom",
                    animation: isPlaying
                      ? `mobileEqBounce ${0.4 + (i % 4) * 0.1}s ease-in-out ${i * 50}ms infinite alternate`
                      : "none",
                    transition: "height 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* Track info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontWeight: "700",
                fontSize: "0.92rem",
                color: isLight ? "#111827" : "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {playingTrack.title}
              </p>
              <p style={{
                margin: 0,
                fontSize: "0.75rem",
                color: "var(--accent-primary)",
                fontWeight: "500",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {playingTrack.artist}
              </p>
            </div>

            {/* Play / Pause button */}
            <button
              onClick={() => handlePlayTrack(playingTrack)}
              aria-label={isPlaying ? "Pause" : "Play"}
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "9999px",
                background: "var(--accent-primary)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                boxShadow: "0 4px 16px rgba(225,29,72,0.4)",
                transition: "transform 0.15s ease",
              }}
              onPointerDown={(e) => { e.currentTarget.style.transform = "scale(0.9)"; }}
              onPointerUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
