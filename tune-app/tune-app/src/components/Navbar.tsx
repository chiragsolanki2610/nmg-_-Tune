"use client";

import { useState, useEffect, useRef, type PointerEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const THEME_PULL_THRESHOLD = 72;
const THEME_PULL_MAX = 120;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const [showLinks, setShowLinks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [ropePull, setRopePull] = useState(0);
  const [isRopeDragging, setIsRopeDragging] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ropeStartYRef = useRef(0);
  const ropePullRef = useRef(0);
  const toggleThemeRef = useRef(toggleTheme);

  const isLight = theme === "light";
  const isRopeReady = ropePull >= THEME_PULL_THRESHOLD;

  const isAccountPage = pathname === "/account";
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const shouldHideNavbar = isAccountPage || isLoginPage || isRegisterPage;

  const navLinks = [
    { name: "Category", path: "/tunes" },
    { name: "Custom Tune", path: "/custom-tunes" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    toggleThemeRef.current = toggleTheme;
  }, [toggleTheme]);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isRopeDragging) return;

    function handlePointerMove(event: globalThis.PointerEvent) {
      const pullDistance = Math.min(
        THEME_PULL_MAX,
        Math.max(0, event.clientY - ropeStartYRef.current)
      );
      ropePullRef.current = pullDistance;
      setRopePull(pullDistance);
    }

    function handlePointerRelease() {
      if (ropePullRef.current >= THEME_PULL_THRESHOLD) {
        toggleThemeRef.current();
      }
      ropePullRef.current = 0;
      setRopePull(0);
      setIsRopeDragging(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerRelease);
    window.addEventListener("pointercancel", handlePointerRelease);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerRelease);
      window.removeEventListener("pointercancel", handlePointerRelease);
    };
  }, [isRopeDragging]);

  const handleRopePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    ropeStartYRef.current = event.clientY;
    ropePullRef.current = 0;
    setRopePull(0);
    setIsRopeDragging(true);
  };

  if (shouldHideNavbar) {
    return (
      <div style={{ position: "fixed", top: "2.25rem", left: "2.5rem", zIndex: 1000 }}>
        <Link
          href="/"
          aria-label="Back to home"
          title="Back to Home"
          className="glass-panel"
          style={{
            background: isLight ? "rgba(255, 255, 255, 0.75)" : "rgba(19, 18, 21, 0.7)",
            border: isLight ? "1px solid rgba(225, 29, 72, 0.1)" : "1px solid rgba(225, 29, 72, 0.15)",
            backdropFilter: "blur(20px)",
            color: "var(--accent-primary)",
            height: "44px",
            padding: "0 1.25rem",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            outline: "none",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "0.95rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.border = "1px solid var(--accent-primary)";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 8, 68, 0.15)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isLight ? "rgba(255, 255, 255, 0.75)" : "rgba(19, 18, 21, 0.7)";
            e.currentTarget.style.border = isLight ? "1px solid rgba(225, 29, 72, 0.1)" : "1px solid rgba(225, 29, 72, 0.15)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ filter: "drop-shadow(0 0 4px rgba(225, 29, 72, 0.3))" }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .navbar-rope { display: none !important; }
          .navbar-desktop-links { display: none !important; }
          .navbar-search-form { display: none !important; }
          .navbar-hamburger { display: flex !important; }
          .navbar-root {
            padding: 0.6rem 1rem !important;
            margin: 0.6rem auto !important;
            top: 0.6rem !important;
            width: calc(100% - 1.2rem) !important;
          }
          .navbar-brand-text {
            font-size: 1.3rem !important;
          }
        }
        .navbar-hamburger { display: none; }
      `}</style>

      {/* ── Mobile full-screen menu overlay ── */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            background: isLight ? "rgba(251, 249, 249, 0.97)" : "rgba(10, 9, 11, 0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "none",
              border: "1px solid var(--border-color)",
              borderRadius: "9999px",
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-primary)",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Brand */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              color: "var(--accent-primary)",
              textDecoration: "none",
              marginBottom: "0.5rem",
            }}
          >
            nmg-_-Tunes
          </Link>

          {/* Search bar in mobile menu */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setIsMobileMenuOpen(false);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(225,29,72,0.2)",
              borderRadius: "9999px",
              padding: "0.65rem 1.25rem",
              gap: "0.5rem",
              width: "80%",
              maxWidth: "340px",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search tunes, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                width: "100%",
              }}
            />
          </form>

          {/* Nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: "1.65rem",
                fontWeight: "700",
                color: pathname === link.path ? "var(--accent-primary)" : "var(--text-primary)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {link.name}
            </Link>
          ))}

          {/* Account CTA */}
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              marginTop: "0.5rem",
              padding: "0.8rem 2.5rem",
              borderRadius: "9999px",
              background: "var(--accent-gradient)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "1rem",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(225,29,72,0.3)",
            }}
          >
            {isAuthenticated ? "My Account" : "Sign In"}
          </Link>

          {/* Theme toggle */}
          <button
            onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
            style={{
              background: "none",
              border: "1px solid var(--border-color)",
              borderRadius: "9999px",
              padding: "0.65rem 1.75rem",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            {isLight ? "🌙  Switch to Dark" : "☀️  Switch to Light"}
          </button>
        </div>
      )}

      {/* ── Main Navbar ── */}
      <nav
        className="glass-panel navbar-root"
        style={{
          position: "sticky",
          top: "1.5rem",
          left: "1.5rem",
          right: "1.5rem",
          margin: "1.5rem auto",
          width: "calc(100% - 3rem)",
          maxWidth: "1400px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 2.5rem",
          borderRadius: "9999px",
          border: isLight ? "1px solid rgba(225, 29, 72, 0.1)" : "1px solid rgba(225, 29, 72, 0.15)",
          background: isLight ? "rgba(255, 255, 255, 0.75)" : "rgba(19, 18, 21, 0.7)",
          backdropFilter: "blur(20px)",
          boxShadow: isLight ? "0 4px 30px rgba(0, 0, 0, 0.03)" : "none",
          transition: "background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease",
          overflow: "visible",
        }}
      >
        {/* Rope (desktop only) */}
        <div
          className="navbar-rope"
          style={{
            position: "absolute",
            top: "50%",
            right: "100px",
            transform: "translateY(-50%)",
            width: "56px",
            height: `${130 + ropePull}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 3,
            pointerEvents: "none",
            transition: isRopeDragging ? "none" : "height 0.42s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              width: "4px",
              flex: 1,
              borderRadius: "9999px",
              background: "rgba(245, 101, 142, 0.95)",
              boxShadow: isRopeDragging ? "0 0 24px rgba(245, 101, 142, 0.9)" : "0 0 16px rgba(245, 101, 142, 0.6)",
              transition: "box-shadow 0.2s ease",
            }}
          />
          <button
            type="button"
            onPointerDown={handleRopePointerDown}
            aria-label="Pull down to change theme"
            title="Pull down to change theme"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "9999px",
              border: isRopeReady ? "1px solid var(--accent-primary)" : isLight ? "1px solid rgba(0, 0, 0, 0.12)" : "1px solid rgba(255, 255, 255, 0.16)",
              background: isRopeReady ? "var(--accent-primary)" : isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(19, 18, 21, 0.98)",
              color: isRopeReady ? "#fff" : "var(--accent-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              cursor: isRopeDragging ? "grabbing" : "grab",
              pointerEvents: "auto",
              touchAction: "none",
              outline: "none",
              boxShadow: isRopeReady ? "0 8px 20px rgba(225, 29, 72, 0.35), 0 0 16px rgba(225, 29, 72, 0.55)" : isLight ? "0 6px 18px rgba(0, 0, 0, 0.08)" : "0 6px 18px rgba(0, 0, 0, 0.35)",
              transform: isRopeDragging ? "scale(1.06)" : "scale(1)",
              transition: isRopeDragging ? "background 0.18s ease, border 0.18s ease, color 0.18s ease, box-shadow 0.18s ease" : "all 0.24s ease",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v2" /><path d="M12 19v2" />
              <path d="M3 12h2" /><path d="M19 12h2" />
              <path d="m5.6 5.6 1.4 1.4" /><path d="m17 17 1.4 1.4" />
              <path d="m18.4 5.6-1.4 1.4" /><path d="m7 17-1.4 1.4" />
              <circle cx="12" cy="12" r="3.5" />
            </svg>
          </button>
        </div>

        {/* Left: Brand + Desktop sliding nav links */}
        <div
          onMouseEnter={() => setShowLinks(true)}
          onMouseLeave={() => setShowLinks(false)}
          style={{ display: "flex", alignItems: "center", flex: 1 }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <span
              className="navbar-brand-text"
              style={{
                fontSize: "1.8rem",
                fontWeight: "800",
                color: "var(--accent-primary)",
                letterSpacing: "-0.5px",
                cursor: "pointer",
                transition: "transform 0.2s ease, text-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.textShadow = "0 0 10px rgba(255, 8, 68, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              nmg-_-Tunes
            </span>
          </Link>

          {/* Desktop sliding links */}
          <div
            className="navbar-desktop-links"
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
              opacity: showLinks ? 1 : 0,
              transform: showLinks ? "translateX(0)" : "translateX(-15px)",
              maxWidth: showLinks ? "600px" : "0px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              marginLeft: showLinks ? "2.5rem" : "0px",
              pointerEvents: showLinks ? "auto" : "none",
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              const linkColor = isActive
                ? (isLight ? "#000" : "#fff")
                : (isLight ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.65)");

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  style={{
                    fontSize: "1rem",
                    fontWeight: isActive ? "600" : "500",
                    color: linkColor,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isLight ? "#000" : "#fff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = isLight ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.65)";
                    }
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Center: Search bar (desktop only) */}
        <form
          className="navbar-search-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            background: isSearchFocused
              ? (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)")
              : (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)"),
            border: isSearchFocused ? "1px solid rgba(225, 29, 72, 0.35)" : "1px solid transparent",
            borderRadius: "9999px",
            padding: "0.5rem 1.1rem",
            gap: "0.5rem",
            
            /* ── CHANGER APPLIED HERE ── */
            width: showLinks ? "0px" : "260px",
            opacity: showLinks ? 0 : 1,
            visibility: showLinks ? "hidden" : "visible",
            pointerEvents: showLinks ? "none" : "auto",
            paddingLeft: showLinks ? "0px" : "1.1rem",
            paddingRight: showLinks ? "0px" : "1.1rem",
            borderWidth: showLinks ? "0px" : "1px",
            /* ───────────────────────── */
            
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tunes, creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.88rem",
              width: "100%",
            }}
          />
        </form>

        {/* Right: Account icon + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, justifyContent: "flex-end" }}>
          {/* Account icon */}
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            aria-label={isAuthenticated ? "My Account" : "Sign In"}
            title={isAuthenticated ? `Signed in as ${user?.email ?? ""}` : "Sign In"}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              transition: "all 0.2s ease",
              flexShrink: 0,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-primary)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.border = "1px solid var(--accent-primary)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(225,29,72,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.border = "1px solid var(--border-color)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            className="navbar-hamburger"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            style={{
              background: "none",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "0.4rem 0.5rem",
              cursor: "pointer",
              color: "var(--text-primary)",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}