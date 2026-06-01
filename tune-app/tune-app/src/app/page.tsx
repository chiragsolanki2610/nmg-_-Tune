"use client";

import Link from "next/link";
import { Pacifico } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import { useAudio } from "@/context/AudioContext";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

// Interface representation matching your C# Swagger response object properties
interface BackendTune {
  id: string;
  title: string;
  artist: string;
  genre: string;
  fileUrl: string;
  durationSeconds?: number; 
  duration?: string;        
  downloadCount: number;
  createdAt: string;
}

// Interface for processed state structure mapping into frontend layout keys
interface DynamicTune {
  id: string | number;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  plays: string | number;
  color: string;
  bars: number[];
  fileUrl: string; 
}

// Dynamic color matching dictionary supporting existing and upcoming genres
function getGenreColor(genre: string): string {
  switch (genre?.toLowerCase()) {
    case "sad":
      return "#0ea5e9"; 
    case "happy":
      return "#10b981"; 
    case "synthwave":
      return "#e11d48"; 
    case "lo-fi":
    case "lo_fi":
      return "#7c3aed"; 
    case "bass":
      return "#38bdf8"; 
    case "ambient":
      return "#f59e0b"; 
    case "chiptune":
      return "#10b981"; 
    case "trap":
      return "#e11d48"; 
    case "romantic":
      return "#ec4899"; 
    case "energetic":
      return "#f43f5e"; 
    case "chill":
      return "#14b8a6"; 
    default:
      return "#ec4899"; 
  }
}

// Utility parsing raw integer seconds strings into classic track timeline displays 
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Generator rendering dummy visualizer bars gracefully where database lists lack metrics arrays
function generateMockBars(): number[] {
  return Array.from({ length: 15 }, () => Math.floor(Math.random() * 60) + 35);
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particlesArray: Particle[] = [];
    
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      velocityX: number;
      velocityY: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 3 + 1.5;
        this.density = (Math.random() * 30) + 15;
        this.velocityX = (Math.random() - 0.5) * 0.18;
        this.velocityY = (Math.random() - 0.5) * 0.18;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        ctx.fillStyle = "rgba(225, 29, 72, 0.65)";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#e11d48"; 
        ctx.fill();
      }

      update() {
        if (!canvas) return;

        this.baseX += this.velocityX;
        this.baseY += this.velocityY;

        const edgePadding = 30;
        if (this.baseX > canvas.width + edgePadding) this.baseX = -edgePadding;
        if (this.baseX < -edgePadding) this.baseX = canvas.width + edgePadding;
        if (this.baseY > canvas.height + edgePadding) this.baseY = -edgePadding;
        if (this.baseY < -edgePadding) this.baseY = canvas.height + edgePadding;

        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density * 0.8;
            let directionY = forceDirectionY * force * this.density * 0.8;

            this.x -= directionX;
            this.y -= directionY;
            return;
          }
        }

        if (this.x !== this.baseX) {
          let dxBase = this.x - this.baseX;
          this.x -= dxBase / 12;
        }
        if (this.y !== this.baseY) {
          let dyBase = this.y - this.baseY;
          this.y -= dyBase / 12;
        }
      }
    }

    function init() {
      if (!canvas) return;
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
      }
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    handleResize();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none", 
        backgroundColor: "transparent",
      }}
    />
  );
}

interface TuneCardProps {
  tune: DynamicTune;
  currentPlayingId: string | null;
  isPlaying: boolean;
  onPlayToggle: (tune: DynamicTune) => void;
}

function TuneCard({ tune, currentPlayingId, isPlaying, onPlayToggle }: TuneCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [displayDuration, setDisplayDuration] = useState(tune.duration);
  const isCurrentTrackPlaying = currentPlayingId === tune.id.toString() && isPlaying;

  // Background Metadata Processing Scanner Engine
  useEffect(() => {
    if ((tune.duration === "0:00" || tune.duration === "3:00") && tune.fileUrl) {
      const audioScanner = new Audio(tune.fileUrl);
      audioScanner.preload = "metadata";
      
      const handleMetadata = () => {
        if (audioScanner.duration && !isNaN(audioScanner.duration)) {
          setDisplayDuration(formatDuration(audioScanner.duration));
        }
      };

      audioScanner.addEventListener("loadedmetadata", handleMetadata);
      return () => {
        audioScanner.removeEventListener("loadedmetadata", handleMetadata);
      };
    } else {
      setDisplayDuration(tune.duration);
    }
  }, [tune.duration, tune.fileUrl]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlayToggle(tune)}
      style={{
        background: isHovered
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(255, 255, 255, 0.02)",
        border: isHovered
          ? `1px solid ${tune.color}40`
          : "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "20px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? `0 16px 40px rgba(0,0,0,0.25), 0 0 30px ${tune.color}18`
          : "0 4px 16px rgba(0,0,0,0.1)",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes eqBounce {
          0% { transform: scaleY(0.15); }
          100% { transform: scaleY(1); }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: tune.color,
          opacity: isHovered ? 0.12 : 0.06,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: tune.color,
            background: `${tune.color}15`,
            border: `1px solid ${tune.color}30`,
            padding: "0.25rem 0.65rem",
            borderRadius: "9999px",
          }}
        >
          {tune.genre || "General"}
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" }}>
          {displayDuration}
        </span>
      </div>

      {/* Visualizer Container */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "3px",
          height: "48px",
        }}
      >
        {tune.bars.map((height, i) => {
          const randomDuration = 0.35 + (i % 5) * 0.11;
          const delayStr = `${(i % 4) * 60}ms`;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${isHovered ? height : height * 0.7}%`,
                borderRadius: "2px",
                background: isCurrentTrackPlaying
                  ? tune.color
                  : isHovered
                  ? `${tune.color}cc`
                  : "rgba(255,255,255,0.15)",
                minHeight: "4px",
                transformOrigin: "bottom",
                animation: isCurrentTrackPlaying 
                  ? `eqBounce ${randomDuration}s ease-in-out ${delayStr} infinite alternate` 
                  : "none",
                transition: isCurrentTrackPlaying 
                  ? "background 0.3s ease" 
                  : `height 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 20}ms, background 0.3s ease`,
              }}
            />
          );
        })}
      </div>

      <div>
        <p
          style={{
            fontWeight: "700",
            fontSize: "1.05rem",
            color: "var(--text-primary)",
            margin: "0 0 0.2rem 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {tune.title}
        </p>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
          {tune.artist}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--text-secondary)">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: "500" }}>
            {tune.plays}
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <a
            href={tune.fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "0.4rem 0.65rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
            title="Download"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayToggle(tune);
            }}
            style={{
              background: isCurrentTrackPlaying ? tune.color : `${tune.color}22`,
              border: `1px solid ${tune.color}60`,
              borderRadius: "9px",
              padding: "0.4rem 0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "all 0.2s ease",
              color: isCurrentTrackPlaying ? "#fff" : tune.color,
              fontSize: "0.78rem",
              fontWeight: "600",
            }}
            onMouseEnter={(e) => {
              if (!isCurrentTrackPlaying) {
                e.currentTarget.style.background = `${tune.color}40`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isCurrentTrackPlaying) {
                e.currentTarget.style.background = `${tune.color}22`;
              }
            }}
          >
            {isCurrentTrackPlaying ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="5" y="4" width="4" height="16" rx="1" />
                  <rect x="15" y="4" width="4" height="16" rx="1" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ transform: "translateX(1px)" }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Play
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [trendingTunes, setTrendingTunes] = useState<DynamicTune[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ FIX: JS-based responsive flag replacing broken CSS variable comparisons
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 992px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Consume audio context parameters globally
  const { playingTrack, isPlaying, handlePlayTrack } = useAudio();

  const handlePlayToggle = (tune: DynamicTune) => {
    handlePlayTrack({
      id: tune.id.toString(),
      title: tune.title,
      artist: tune.artist,
      fileUrl: tune.fileUrl,
      genre: tune.genre,
    });
  };

  useEffect(() => {
    fetch("https://nmg-tune.onrender.com/api/Tunes/trending")
      .then((res) => {
        if (!res.ok) throw new Error("Network issues reaching backend api");
        return res.json();
      })
      .then((data: BackendTune[]) => {
        const formattedData: DynamicTune[] = data.map((item) => {
          let resolvedDuration = "0:00";
          
          if (item.duration && item.duration !== "00:00" && item.duration !== "0:00") {
            resolvedDuration = item.duration; 
          } else if (item.durationSeconds && item.durationSeconds > 0) {
            resolvedDuration = formatDuration(item.durationSeconds);
          }

          return {
            id: item.id,
            title: item.title,
            artist: item.artist,
            genre: item.genre,
            duration: resolvedDuration, 
            plays: item.downloadCount > 0 ? `${item.downloadCount}K` : "0",
            color: getGenreColor(item.genre),
            bars: generateMockBars(),
            fileUrl: item.fileUrl || "" 
          };
        });
        setTrendingTunes(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Fetch Error: ", err);
        setError(err.message || "Failed to load tunes");
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "transparent",
      }}
    >
      <style>{`
        :root {
          --responsive-hero-text: 5.5rem;
          --responsive-section-heading: 1.9rem;
          --hero-panel-padding: 4rem 3.5rem;
          --cta-flex-direction: row;
          --cta-width: auto;
          --hero-flex-direction: row;
          --hero-alignment: left;
          --hero-text-width: 54%;
          --widget-width: 41%;
        }

        @media (max-width: 992px) {
          :root {
            --responsive-hero-text: 3.35rem;
            --responsive-section-heading: 1.45rem;
            --hero-panel-padding: 2.25rem 1.35rem;
            --cta-flex-direction: column;
            --cta-width: 100%;
            --hero-flex-direction: column;
            --hero-alignment: center;
            --hero-text-width: 100%;
            --widget-width: 100%;
          }
        }

        @media (max-width: 560px) {
          :root {
            --responsive-hero-text: 2.7rem;
            --hero-panel-padding: 2rem 1.15rem;
          }

          .home-shell {
            padding-left: 0.9rem !important;
            padding-right: 0.9rem !important;
            padding-top: 1.25rem !important;
          }

          .home-hero {
            border-radius: 20px !important;
            gap: 1.75rem !important;
          }

          .hero-eyebrow {
            margin-bottom: 1.6rem !important;
          }

          .hero-title {
            display: block;
            line-height: 1.25 !important;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-copy {
            font-size: 1rem !important;
            line-height: 1.55 !important;
            max-width: 290px !important;
            margin-bottom: 2rem !important;
          }

          .hero-actions {
            gap: 0.8rem !important;
          }

          .hero-actions .btn {
            min-height: 54px;
            padding: 0.9rem 1.2rem !important;
            font-size: 1rem !important;
          }

          .hero-stats {
            display: none !important;
          }

          .hero-player-widget {
            display: none !important;
          }
        }

        @media (max-width: 380px) {
          :root {
            --responsive-hero-text: 2.35rem;
            --hero-panel-padding: 1.75rem 1rem;
          }
        }

        @keyframes widgetWave {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      <ParticleBackground />

      {/* Primary Layout Container Viewport Override */}
      <div
        className="home-shell"
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "1.75rem",
          position: "relative",
          zIndex: 2, 
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          boxSizing: "border-box"
        }}
      >
        {/* Core Hero Section Structure: Side-By-Side Flex Engine Layout */}
        <div
          className="home-hero"
          style={{ 
            padding: "var(--hero-panel-padding)", 
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "24px",
            backdropFilter: "blur(16px)",
            position: "relative", 
            overflow: "hidden", 
            width: "100%",
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "var(--hero-flex-direction)" as any,
            justifyContent: "space-between",
            alignItems: "center",
            gap: "2.5rem",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, var(--accent-primary) 0%, transparent 60%)",
              opacity: 0.08,
              zIndex: -1,
              pointerEvents: "none",
            }}
          />

          {/* Hero Content Block Left Hand Side */}
          <div style={{ width: "var(--hero-text-width)", textAlign: "var(--hero-alignment)" as any }}>
            {/* Live Counter Badge */}
            <div className="hero-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(225, 29, 72, 0.12)", border: "1px solid rgba(225, 29, 72, 0.25)", borderRadius: "9999px", padding: "0.35rem 0.85rem", marginBottom: "1.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e11d48" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#f43f5e" }}>NOW LIVE · 2,400+ TUNES</span>
            </div>

            <h1
              className={`${pacifico.className} heading-gradient`}
              style={{
                fontSize: "var(--responsive-hero-text)",
                fontWeight: 400,
                marginBottom: "1.5rem",
                lineHeight: 1.15,
                letterSpacing: "0",
              }}
            >
              <span className="hero-title">
                Better Tunes.
                <br />
                Better Music.
              </span>
            </h1>
            <p
              className="hero-copy"
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                marginBottom: "2.5rem",
                lineHeight: 1.6,
                maxWidth: "520px",
                marginRight: "auto",
                // ✅ FIX: replaced "var(--hero-alignment)" === "center" comparison with JS isMobile flag
                marginLeft: isMobile ? "auto" : "0",
              }}
            >
              Discover, upload, and download high-quality tunes. Request custom services directly from
              top creators in one seamless portal.
            </p>

            <div 
              className="hero-actions"
              style={{ 
                display: "flex", 
                gap: "1rem", 
                // ✅ FIX: replaced "var(--hero-alignment)" === "center" comparison with JS isMobile flag
                justifyContent: isMobile ? "center" : "flex-start",
                flexDirection: "var(--cta-flex-direction)" as any
              }}
            >
              <Link 
                href="/tunes" 
                className="btn btn-primary" 
                style={{ padding: "1rem 2rem", fontSize: "1.1rem", width: "var(--cta-width)" }}
              >
                Explore Tunes
              </Link>
              <Link 
                href="/custom-tunes" 
                className="btn btn-secondary" 
                style={{ padding: "1rem 2rem", fontSize: "1.1rem", width: "var(--cta-width)" }}
              >
                Request Custom Tune &rarr;
              </Link>
            </div>

            {/* Statistics Counters Grid layout */}
            <div className="hero-stats" style={{ display: "flex", gap: "2.5rem", marginTop: "3.5rem",
              // ✅ FIX: replaced "var(--hero-alignment)" === "center" comparison with JS isMobile flag
              justifyContent: isMobile ? "center" : "flex-start"
            }}>
              <div>
                <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#fff" }}>12K+</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>Tracks</div>
              </div>
              <div>
                <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#fff" }}>840+</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>Artists</div>
              </div>
              <div>
                <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#fff" }}>98%</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Column Player Interface Widget Display Box */}
          <div 
            className="hero-player-widget"
            style={{ 
              width: "var(--widget-width)", 
              background: "rgba(20, 20, 22, 0.65)", 
              border: "1px solid rgba(255, 255, 255, 0.05)", 
              borderRadius: "24px",
              padding: "1.75rem",
              backdropFilter: "blur(24px)",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              textAlign: "left",
              position: "relative",
              boxSizing: "border-box"
            }}
          >
            {/* Playback Row Meta Element */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                <div style={{ width: "42px", height: "42px", background: "linear-gradient(135deg, #ec4899, #e11d48)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 8px 16px rgba(225, 29, 72, 0.25)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", fontWeight: "700" }}>Now Playing</div>
                  <div style={{ fontSize: "1rem", fontWeight: "700", color: "#fff", marginTop: "0.05rem" }}>Midnight Echo</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.02rem" }}>nmg · 2:48</div>
                </div>
              </div>
              <button style={{ width: "36px", height: "36px", background: "#f43f5e", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>

            {/* Slider Track System */}
            <div style={{ position: "relative", width: "100%", height: "4px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "2px", marginBottom: "0.4rem" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "38%", height: "100%", background: "linear-gradient(90deg, #f43f5e, #ec4899)", borderRadius: "2px" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-secondary)", fontWeight: "500", marginBottom: "1.5rem" }}>
              <span>1:03</span>
              <span>2:48</span>
            </div>

            {/* Waveform Canvas Generator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3px", height: "40px", marginBottom: "1.75rem" }}>
              {Array.from({ length: 32 }).map((_, idx) => {
                const height = Math.sin(idx * 0.25) * 16 + 24;
                const isActive = idx < 12;
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      flex: 1, 
                      height: `${height}%`, 
                      background: isActive ? "linear-gradient(to top, #f43f5e, #ec4899)" : "rgba(255, 255, 255, 0.15)",
                      borderRadius: "1px",
                      transformOrigin: "center",
                      animation: `widgetWave ${1 + (idx % 3) * 0.2}s ease-in-out infinite alternate`
                    }} 
                  />
                );
              })}
            </div>

            {/* Play Queue Up Next Section */}
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "1.25rem" }}>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", fontWeight: "700", marginBottom: "1rem" }}>Up Next</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ width: "28px", height: "28px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>🎵</div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#fff" }}>Neon Pulse</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>nmg</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: "500" }}>2:22</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ width: "28px", height: "28px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>🎵</div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#fff" }}>Solar Drift</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>nmg</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: "500" }}>3:45</span>
              </div>
            </div>

            {/* Glowing Accent Badge floating on bottom perimeter */}
            <div style={{ position: "absolute", bottom: "-12px", right: "20px", display: "flex", alignItems: "center", gap: "0.35rem", background: "linear-gradient(135deg, #7c3aed, #ec4899)", borderRadius: "9999px", padding: "0.4rem 1rem", boxShadow: "0 8px 24px rgba(236, 72, 153, 0.4)", pointerEvents: "none" }}>
              <span style={{ fontSize: "0.75rem" }}>🔥</span>
              <span style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: "#fff" }}>Trending Now</span>
            </div>
          </div>
        </div>

        {/* Trending Tunes Section Container */}
        <div
          style={{
            width: "100%",
            marginTop: "5rem",
            paddingBottom: "2rem",
            textAlign: "left"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--accent-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(225, 29, 72, 0.35)",
                }}
              >
                🔥
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "var(--responsive-section-heading)",
                    fontWeight: "800",
                    color: "var(--text-primary)",
                    margin: 0,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Trending Tunes
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "2px 0 0 0" }}>
                  Most played this week across all categories
                </p>
              </div>
            </div>

            <Link
              href="/tunes"
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "var(--accent-primary)",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "gap 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.gap = "0.6rem";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.gap = "0.35rem";
              }}
            >
              See All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-secondary)", fontSize: "1rem", padding: "2rem 0", textAlign: "center" }}>
              Fetching latest tracks from backend...
            </div>
          ) : error ? (
            <div style={{ color: "#ef4444", fontSize: "1rem", padding: "2rem 0", textAlign: "center", background: "rgba(239, 68, 68, 0.05)", borderRadius: "12px", border: "1px dashed rgba(239, 68, 68, 0.2)" }}>
              ⚠️ Unable to display tracks ({error}). Make sure your C# Web API is actively running on port 7299 with CORS enabled.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {trendingTunes.map((tune) => (
                <TuneCard 
                  key={tune.id} 
                  tune={tune} 
                  currentPlayingId={playingTrack?.id || null} 
                  isPlaying={isPlaying}
                  onPlayToggle={handlePlayToggle} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Features Info Grid Section */}
        <div
          style={{ 
            marginTop: "4rem", 
            width: "100%", 
            paddingBottom: "6rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem"
          }}
        >
          {[
            { title: "Vast Library", desc: "Access thousands of community-uploaded tunes for your next project." },
            { title: "Custom Services", desc: "Commission unique soundtracks directly from talented producers." },
            { title: "Seamless Experience", desc: "Enjoy our premium interface with automatic Light/Dark mode." },
          ].map((feature, i) => (
            <div key={i} style={{ padding: "2rem", textAlign: "left", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "20px", backdropFilter: "blur(12px)" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--text-primary)" }}>
                {feature.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}
