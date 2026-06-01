"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface Tune {
  id: string;
  title: string;
  artist: string;
  genre: string;
  fileUrl: string;
}

interface AudioContextType {
  playingTrack: Tune | null;
  isPlaying: boolean;
  trackLoadingId: string | null;
  currentTime: number;
  duration: number;
  seek: (seconds: number) => void;
  handlePlayTrack: (track: Tune) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingTrack, setPlayingTrack] = useState<Tune | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackLoadingId, setTrackLoadingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const cleanAudioUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("/object/sign/")) return url.replace("/object/sign/", "/object/public/");
    if (!url.startsWith("http")) {
      return `https://oryqeyborroqypklzbrw.supabase.co/storage/v1/object/public/tunes/${url}`;
    }
    return url;
  };

  const safeEncodeUrl = (url: string) => {
    return cleanAudioUrl(url)
      .split("/")
      .map((segment, i) => (i === 0 ? segment : encodeURIComponent(decodeURIComponent(segment))))
      .join("/");
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const handlePlayTrack = async (track: Tune) => {
    if (playingTrack?.id === track.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((e) => console.error("Playback failed:", e));
        setIsPlaying(true);
      }
      return;
    }

    try {
      setTrackLoadingId(track.id);
      if (audioRef.current) audioRef.current.pause();

      const dynamicSource = safeEncodeUrl(track.fileUrl);
      const audio = new Audio(dynamicSource);

      audio.onended = () => {
        setIsPlaying(false);
        setPlayingTrack(null);
        setCurrentTime(0);
        setDuration(0);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onloadedmetadata = () => {
        setDuration(audio.duration || 0);
      };

      audioRef.current = audio;
      setCurrentAudio(audio);
      setPlayingTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      setTrackLoadingId(null);

      await audio.play();
    } catch (err) {
      console.error("❌ Playback failed:", err);
      setTrackLoadingId(null);
    }
  };

  return (
    <AudioContext.Provider value={{ playingTrack, isPlaying, trackLoadingId, currentTime, duration, seek, handlePlayTrack }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within an AudioProvider");
  return context;
};