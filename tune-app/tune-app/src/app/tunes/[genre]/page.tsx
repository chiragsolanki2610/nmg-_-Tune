"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAudio } from "@/context/AudioContext"; // ✅ Access global audio controller

interface Tune {
  id: string;
  title: string;
  artist: string;
  genre: string;
  fileUrl: string;
  durationSeconds: number;
  downloadCount: number;
  createdAt: string;
}

export default function GenreTracksPage() {
  const params = useParams();
  const genreSlug = typeof params?.genre === "string" ? params.genre : "";

  const [tunes, setTunes] = useState<Tune[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // 🎵 Sync directly with the main layout audio engine
  const { playingTrack, isPlaying, trackLoadingId, handlePlayTrack } = useAudio();

  async function fetchTracksFromBackend() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://nmg-tune.onrender.com/api/Tunes/genre/${encodeURIComponent(genreSlug)}?_cb=${Date.now()}`);
      if (!response.ok) throw new Error(`Backend returned status: ${response.status}`);
      const data: Tune[] = await response.json();
      setTunes(data);
    } catch (err: any) {
      setError("Could not connect to the C# backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (genreSlug) fetchTracksFromBackend();
  }, [genreSlug]);

  const handleDownloadTrack = async (track: Tune) => {
    try {
      setDownloadingId(track.id);
      const cleanUrl = track.fileUrl.startsWith("http") 
        ? track.fileUrl 
        : `https://oryqeyborroqypklzbrw.supabase.co/storage/v1/object/public/tunes/${track.fileUrl}`;
      const tempLink = document.createElement("a");
      tempLink.href = cleanUrl;
      tempLink.setAttribute("download", `${track.title} - ${track.artist}.wav`);
      tempLink.target = "_blank";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    } catch (err) {
      alert("Error processing track download.");
    } finally {
      setDownloadingId(null);
    }
  };

  const cleanTitle = genreSlug.charAt(0).toUpperCase() + genreSlug.slice(1);

  return (
    <div className="container" style={{ paddingTop: "3rem", paddingBottom: "8rem", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
        <Link href="/tunes" style={{ color: "var(--accent-primary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", border: "1px solid rgba(225, 29, 72, 0.2)", padding: "0.5rem 1.2rem", borderRadius: "9999px", background: "rgba(225, 29, 72, 0.05)" }}>
          ← Back to Genres
        </Link>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "800", margin: 0 }}>
          {cleanTitle} <span style={{ color: "var(--accent-primary)" }}>Tunes</span>
        </h1>
      </div>

      {loading ? (
        <p>Connecting to backend...</p>
      ) : error ? (
        <p>{error}</p>
      ) : tunes.length === 0 ? (
        <p>No tracks exist in this genre context yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tunes.map((track) => {
            const isThisTrackPlaying = playingTrack?.id === track.id && isPlaying;
            const isThisTrackLoading = trackLoadingId === track.id;

            return (
              <div
                key={track.id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "1.25rem 2rem",
                  background: playingTrack?.id === track.id ? "rgba(225, 29, 72, 0.05)" : "rgba(255, 255, 255, 0.02)",
                  border: playingTrack?.id === track.id ? "1px solid rgba(225, 29, 72, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "20px"
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.25rem", color: playingTrack?.id === track.id ? "var(--accent-primary)" : "inherit" }}>
                    {track.title}
                  </h3>
                  <p style={{ margin: 0, color: "var(--text-secondary)" }}>By {track.artist}</p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => handlePlayTrack(track)} // ✅ Dispatches to global player
                    disabled={isThisTrackLoading}
                    style={{
                      background: isThisTrackPlaying ? "#fff" : "var(--accent-primary)",
                      color: isThisTrackPlaying ? "var(--accent-primary)" : "#fff",
                      padding: "0.6rem 1.5rem", borderRadius: "12px", border: "none", cursor: "pointer"
                    }}
                  >
                    {isThisTrackLoading ? "Loading..." : isThisTrackPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>

                  <button
                    onClick={() => handleDownloadTrack(track)}
                    disabled={downloadingId === track.id}
                    style={{ background: "rgba(255, 255, 255, 0.05)", color: "#fff", padding: "0.6rem 1.5rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", cursor: "pointer" }}
                  >
                    {downloadingId === track.id ? "Downloading..." : "⬇️ Download"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
