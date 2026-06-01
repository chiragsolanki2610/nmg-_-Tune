"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const whiteKeys = [
  { label: "C", key: "A", frequency: 261.63 },
  { label: "D", key: "S", frequency: 293.66 },
  { label: "E", key: "D", frequency: 329.63 },
  { label: "F", key: "F", frequency: 349.23 },
  { label: "G", key: "G", frequency: 392 },
  { label: "A", key: "H", frequency: 440 },
  { label: "B", key: "J", frequency: 493.88 },
  { label: "C", key: "K", frequency: 523.25 },
];

const blackKeys = [
  { label: "C#", left: "10.5%", frequency: 277.18 },
  { label: "D#", left: "23%", frequency: 311.13 },
  { label: "F#", left: "48%", frequency: 369.99 },
  { label: "G#", left: "60.5%", frequency: 415.3 },
  { label: "A#", left: "73%", frequency: 466.16 },
];

export default function AuthInstrument() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  const playNote = useCallback((frequency: number, label: string) => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const overtone = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const overtoneGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const now = audioContext.currentTime;

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);

    overtone.type = "sine";
    overtone.frequency.setValueAtTime(frequency * 2, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + 0.55);
    filter.Q.setValueAtTime(5, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);

    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.035, now + 0.02);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    overtone.connect(overtoneGain);
    overtoneGain.connect(audioContext.destination);

    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(now + 0.76);
    overtone.stop(now + 0.5);

    setActiveNote(label);
    window.setTimeout(() => setActiveNote(current => (current === label ? null : current)), 180);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const note = whiteKeys.find(item => item.key.toLowerCase() === event.key.toLowerCase());
      if (note) playNote(note.frequency, note.label);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playNote]);

  return (
    <div className="auth-instrument" aria-label="Interactive piano">
      <div className="auth-instrument-display">
        <span className="auth-instrument-label">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="4" y="5" width="3" height="14" rx="1" />
            <rect x="9" y="5" width="3" height="14" rx="1" />
            <rect x="14" y="5" width="3" height="14" rx="1" />
            <rect x="19" y="5" width="1.5" height="14" rx="0.75" />
          </svg>
          Interactive Piano
        </span>
        <span>{activeNote ? `Playing ${activeNote}` : "Touch a key"}</span>
      </div>

      <div className="auth-piano">
        <div className="auth-white-keys">
          {whiteKeys.map(note => (
            <button
              key={`${note.label}-${note.key}`}
              type="button"
              className={`auth-piano-white ${activeNote === note.label ? "active" : ""}`}
              onPointerDown={() => playNote(note.frequency, note.label)}
              aria-label={`Play ${note.label}`}
            >
              <span>{note.label}</span>
            </button>
          ))}
        </div>

        {blackKeys.map(note => (
          <button
            key={note.label}
            type="button"
            className={`auth-piano-black ${activeNote === note.label ? "active" : ""}`}
            style={{ left: note.left }}
            onPointerDown={() => playNote(note.frequency, note.label)}
            aria-label={`Play ${note.label}`}
          />
        ))}
      </div>

      <div className="auth-keyboard-hints">
        {whiteKeys.map(note => (
          <span key={note.key}>{note.key}</span>
        ))}
      </div>
    </div>
  );
}
