"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthInstrument from "@/components/AuthInstrument";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("https://nmg-tune.onrender.com/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: username,
          username,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || "Registration failed");
        setIsLoading(false);
        return;
      }

      const registerData = await res.json().catch(() => null);

      if (registerData && registerData.token) {
        login(registerData.token, { username: registerData.username || username, email: registerData.email || email });
        router.push("/");
      } else {
        const loginRes = await fetch("https://nmg-tune.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!loginRes.ok) {
          router.push("/login?registered=true");
          return;
        }

        const loginData = await loginRes.json();
        login(loginData.token, { username: loginData.username, email: loginData.email });
        router.push("/");
      }
    } catch {
      setError("Network error during registration process.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-stage animate-fade-in">
      <div className="auth-showcase">
        <div className="auth-brand">
          <div className="auth-brand-mark" />
          <h2>nmg<span>-_-</span>Tunes</h2>
        </div>
        <p className="auth-tagline">Your music. Your world.</p>
        <div className="auth-orbit" />
        <AuthInstrument />
        <div className="auth-eq">
          {[62, 88, 51, 76, 96, 59, 82, 48, 91, 68, 79].map((height, index) => (
            <span key={index} style={{ "--h": height, "--i": index } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-title-row">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join nmg-_-Tunes and keep your favorite sounds close.</p>
        </div>

        <div className="auth-tabs" aria-label="Auth navigation">
          <Link href="/login" className="auth-tab">Sign In</Link>
          <Link href="/register" className="auth-tab active">Sign Up</Link>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input className="auth-input" type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Choose a username" />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="11" width="16" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              <input className="auth-input auth-password-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Create a password" />
              <button className="auth-eye" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20" /><path d="M6.7 6.7C3.9 8.6 2 12 2 12s4 7 10 7c1.7 0 3.2-.5 4.5-1.2" /><path d="M19.3 15.3C21 13.6 22 12 22 12s-4-7-10-7c-.9 0-1.8.2-2.6.5" /></svg>
                ) : (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading} style={{ opacity: isLoading ? 0.75 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}>
            {isLoading ? <div className="auth-spinner" /> : "Sign Up"}
          </button>
        </form>

        <div className="auth-divider">or continue with</div>
        <div className="auth-socials">
          <button type="button">Google</button>
          <button type="button">Twitter</button>
        </div>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
