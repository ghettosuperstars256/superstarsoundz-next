"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ── Constants ────────────────────────────────────────────────────────────────

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

// Krumhansl-Kessler key profiles (major and minor)
const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

interface KeyCandidate {
  root: number;
  mode: "major" | "minor";
  name: string;
  confidence: number;
  correlation: number;
}

// Frequency of A4 = 440 Hz
const A4 = 440;
const C0 = A4 * Math.pow(2, -4.75); // ~16.35 Hz

// ── helpers ──────────────────────────────────────────────────────────────────

function freqToMidi(freq: number): number {
  return 12 * Math.log2(freq / C0);
}

function midiToNoteIndex(midi: number): number {
  return ((Math.round(midi) % 12) + 12) % 12;
}

function rotateArray<T>(arr: T[], n: number): T[] {
  const len = arr.length;
  const offset = ((n % len) + len) % len;
  return [...arr.slice(offset), ...arr.slice(0, offset)];
}

function correlate(a: number[], b: number[]): number {
  const n = a.length;
  const meanA = a.reduce((s, v) => s + v, 0) / n;
  const meanB = b.reduce((s, v) => s + v, 0) / n;
  let num = 0,
    denA = 0,
    denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const den = Math.sqrt(denA * denB);
  return den === 0 ? 0 : num / den;
}

// ── Chord compatibility map ──────────────────────────────────────────────────

const DIATONIC_CHORDS: Record<string, { major: string[]; minor: string[] }> = {
  major: {
    major: ["I", "IV", "V"],
    minor: ["ii", "iii", "vi"],
  },
  minor: {
    major: ["III", "VI", "VII"],
    minor: ["i", "iv", "v"],
  },
};

function getDiatonicChords(root: number, mode: "major" | "minor"): string[] {
  const names = NOTE_NAMES;
  const scaleDegrees = mode === "major" ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];

  const profiles = DIATONIC_CHORDS[mode];
  const results: string[] = [];

  for (let deg = 0; deg < 7; deg++) {
    const idx = (root + scaleDegrees[deg]) % 12;
    const label = deg === 0 ? "" : deg === 1 ? "" : ""; // placeholder, unused
    if (profiles.major.includes(["I", "ii", "iii", "IV", "V", "vi", "vii°"][deg])) {
      results.push(`${names[idx]}`);
    } else if (profiles.minor.includes(["i", "ii°", "III", "iv", "v", "VI", "VII"][deg])) {
      results.push(`${names[idx]}m`);
    }
  }

  return results;
}

function getAllCompatibleChords(root: number, mode: "major" | "minor"): string[] {
  const names = NOTE_NAMES;
  const scaleDegrees = mode === "major" ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];

  const romanMajor = ["I", "", "ii", "iii", "IV", "V", "vi"];
  const romanMinor = ["i", "", "II", "III", "iv", "v", "VI"];

  const results: string[] = [];

  for (let deg = 0; deg < 7; deg++) {
    const idx = (root + scaleDegrees[deg]) % 12;
    const chordType = deg === 3 ? (mode === "major" ? "m" : "") : ""; // naive placeholder
    void romanMajor;
    void romanMinor;
    void chordType;

    // Determine chord quality based on diatonic triad
    let quality = "";
    if (mode === "major") {
      const qualities = ["", "m", "m", "", "", "m", "dim"];
      quality = qualities[deg];
    } else {
      const qualities = ["m", "dim", "", "m", "m", "", ""];
      quality = qualities[deg];
    }
    results.push(`${names[idx]}${quality}`);
  }

  // Also add relative key chords
  if (mode === "major") {
    const relMinorRoot = (root + 9) % 12;
    results.push(`${names[relMinorRoot]}m (relative min)`);
  } else {
    const relMajorRoot = (root + 3) % 12;
    results.push(`${names[relMajorRoot]} (relative maj)`);
  }

  return results;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function KeyFinder() {
  const [listening, setListening] = useState(false);
  const [detectedKey, setDetectedKey] = useState<KeyCandidate | null>(null);
  const [noteHistogram, setNoteHistogram] = useState<number[]>(new Array(12).fill(0));
  const [allCandidates, setAllCandidates] = useState<KeyCandidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const stopListening = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setListening(false);
  }, []);

  const analyze = useCallback(() => {
    if (!runningRef.current || !analyserRef.current || !audioCtxRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyser.getFloatFrequencyData(dataArray);

    // Build note histogram from FFT bins
    const sampleRate = audioCtxRef.current.sampleRate;
    const hist = new Array(12).fill(0);
    let activeFrames = 0;

    for (let i = 0; i < bufferLength; i++) {
      const freq = (i * sampleRate) / analyser.fftSize;
      if (freq < 60 || freq > 4000) continue;
      const amp = dataArray[i];
      if (amp < -60) continue; // noise gate

      activeFrames++;
      const midi = freqToMidi(freq);
      const noteIdx = midiToNoteIndex(midi);
      // Convert dB to linear amplitude
      const linear = Math.pow(10, amp / 20);
      hist[noteIdx] += linear;
    }

    if (activeFrames > 5) {
      // Normalize histogram
      const maxVal = Math.max(...hist, 0.001);
      const normalized = hist.map((v) => v / maxVal);
      setNoteHistogram([...normalized]);

      // Correlate against all 24 key profiles
      const candidates: KeyCandidate[] = [];

      for (let root = 0; root < 12; root++) {
        const rotatedMajor = rotateArray(MAJOR_PROFILE, root);
        const rMajor = correlate(normalized, rotatedMajor);
        candidates.push({
          root,
          mode: "major",
          name: `${NOTE_NAMES[root]} major`,
          confidence: 0,
          correlation: rMajor,
        });

        const rotatedMinor = rotateArray(MINOR_PROFILE, root);
        const rMinor = correlate(normalized, rotatedMinor);
        candidates.push({
          root,
          mode: "minor",
          name: `${NOTE_NAMES[root]} minor`,
          confidence: 0,
          correlation: rMinor,
        });
      }

      // Convert correlations to confidence percentages using softmax-like normalization
      const maxR = Math.max(...candidates.map((c) => c.correlation));
      // Shift so all values are positive-ish
      const shifted = candidates.map((c) => c.correlation - (maxR - 1));
      const expSum = shifted.reduce((s, v) => s + Math.exp(v), 0);
      const withConf = candidates.map((c, i) => ({
        ...c,
        confidence: (Math.exp(shifted[i]) / expSum) * 100,
      }));

      withConf.sort((a, b) => b.correlation - a.correlation);
      setAllCandidates(withConf);
      setDetectedKey(withConf[0]);
    }

    if (runningRef.current) {
      rafRef.current = requestAnimationFrame(analyze);
    }
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setDetectedKey(null);
    setAllCandidates([]);
    setNoteHistogram(new Array(12).fill(0));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 16384;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      analyserRef.current = analyser;
      runningRef.current = true;
      setListening(true);

      rafRef.current = requestAnimationFrame(analyze);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Microphone access denied";
      setError(message);
    }
  }, [analyze]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // ── Styles ──────────────────────────────────────────────────────────────────

  const container: React.CSSProperties = {
    fontFamily: "'DM Mono', 'Fira Code', 'SF Mono', monospace",
    background: "#08080a" as const,
    color: "#f0f0f2" as const,
    minHeight: "100vh" as const,
    padding: "1.5rem" as const,
    borderRadius: "12px" as const,
  };

  const header: React.CSSProperties = {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: "1.5rem" as const,
    flexWrap: "wrap" as const,
    gap: "0.75rem" as const,
  };

  const title: React.CSSProperties = {
    color: "#D4A843" as const,
    fontSize: "1.75rem" as const,
    fontWeight: 700,
    margin: 0,
    letterSpacing: "0.02em" as const,
  };

  const btn: React.CSSProperties = {
    background: "#D4A843" as const,
    color: "#08080a" as const,
    border: "none" as const,
    borderRadius: "8px" as const,
    padding: "0.75rem 1.5rem" as const,
    fontSize: "1rem" as const,
    fontWeight: 700,
    fontFamily: "inherit" as const,
    cursor: "pointer" as const,
    transition: "background 0.2s, transform 0.1s" as const,
    letterSpacing: "0.03em" as const,
  };

  const btnStop: React.CSSProperties = {
    ...btn,
    background: "rgba(212, 168, 67, 0.15)" as const,
    color: "#D4A843" as const,
    border: "1px solid rgba(212, 168, 67, 0.3)" as const,
  };

  const card: React.CSSProperties = {
    background: "#121216" as const,
    border: "1px solid rgba(212, 168, 67, 0.12)" as const,
    borderRadius: "12px" as const,
    padding: "1.5rem" as const,
    marginBottom: "1.25rem" as const,
  };

  const sectionTitle: React.CSSProperties = {
    color: "#D4A843" as const,
    fontSize: "0.85rem" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em" as const,
    marginBottom: "1rem" as const,
    fontWeight: 600,
  };

  const bigKey: React.CSSProperties = {
    fontSize: "3rem" as const,
    fontWeight: 700,
    color: "#D4A843" as const,
    textAlign: "center" as const,
    margin: "1.5rem 0 0.5rem" as const,
    letterSpacing: "0.04em" as const,
  };

  const confidenceLabel: React.CSSProperties = {
    fontSize: "0.85rem" as const,
    color: "rgba(240, 240, 242, 0.6)" as const,
    textAlign: "center" as const,
    marginBottom: "1rem" as const,
  };

  const dotActive: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: "50%" as const,
    background: "#43d464" as const,
    animation: "pulse 1.5s infinite" as const,
    display: "inline-block" as const,
    marginRight: "0.5rem" as const,
  };

  const dotInactive: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: "50%" as const,
    background: "rgba(240, 240, 242, 0.2)" as const,
    display: "inline-block" as const,
    marginRight: "0.5rem" as const,
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const histogramMax = Math.max(...noteHistogram, 0.01);
  const compatibleChords = detectedKey
    ? getAllCompatibleChords(detectedKey.root, detectedKey.mode)
    : [];

  return (
    <div style={container}>
      {/* Inject keyframe animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      {/* Header */}
      <div style={header}>
        <h1 style={title}>Key Finder</h1>
        <div style={{ display: "flex" as const, alignItems: "center" as const, gap: "1rem" as const }}>
          <span style={{ display: "flex" as const, alignItems: "center" as const, fontSize: "0.8rem" as const, color: "rgba(240,240,242,0.5)" as const }}>
            <span style={listening ? dotActive : dotInactive} />
            {listening ? "Listening…" : "Idle"}
          </span>
          {listening ? (
            <button style={btnStop} onClick={stopListening}>
              Stop
            </button>
          ) : (
            <button style={btn} onClick={startListening}>
              Start Listening
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ ...card, borderColor: "rgba(255, 80, 80, 0.3)", background: "rgba(255,80,80,0.06)" as const }}>
          <p style={{ color: "#ff6060" as const, margin: 0, fontSize: "0.9rem" as const }}>⚠ {error}</p>
        </div>
      )}

      {/* Detected Key */}
      <div style={card}>
        <div style={sectionTitle}>Detected Key</div>
        {detectedKey ? (
          <>
            <div style={bigKey}>{detectedKey.name}</div>
            <div style={confidenceLabel}>
              Confidence: {detectedKey.confidence.toFixed(1)}% · Correlation: {detectedKey.correlation.toFixed(3)}
            </div>

            {/* Top candidates bar */}
            <div style={{ marginTop: "1rem" as const }}>
              {allCandidates.slice(0, 6).map((c, i) => (
                <div key={c.name} style={{ display: "flex" as const, alignItems: "center" as const, marginBottom: "0.4rem" as const, gap: "0.5rem" as const }}>
                  <span style={{ width: "90px" as const, fontSize: "0.78rem" as const, color: i === 0 ? "#D4A843" : "rgba(240,240,242,0.55)", fontWeight: i === 0 ? 600 : 400 }}>
                    {c.name}
                  </span>
                  <div style={{ flex: 1, height: "8px" as const, background: "rgba(240,240,242,0.06)" as const, borderRadius: "4px" as const, overflow: "hidden" as const }}>
                    <div
                      style={{
                        width: `${Math.max(2, c.confidence)}%`,
                        height: "100%" as const,
                        background: i === 0 ? "#D4A843" : "rgba(212,168,67,0.3)",
                        borderRadius: "4px" as const,
                        transition: "width 0.3s ease" as const,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.72rem" as const, color: "rgba(240,240,242,0.4)" as const, width: "40px" as const, textAlign: "right" as const }}>
                    {c.confidence.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ color: "rgba(240,240,242,0.35)" as const, textAlign: "center" as const, margin: "2rem 0" as const, fontSize: "0.95rem" as const }}>
            {listening ? "Analyzing audio… Play some music or hum a melody." : "Press Start Listening to begin key detection."}
          </p>
        )}
      </div>

      {/* Note Distribution */}
      <div style={card}>
        <div style={sectionTitle}>Note Distribution</div>
        <svg width="100%" height="160" viewBox="0 0 600 160" style={{ display: "block" as const }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((v) => (
            <line
              key={v}
              x1="30"
              y1={20 + (1 - v) * 120}
              x2="590"
              y2={20 + (1 - v) * 120}
              stroke="rgba(240,240,242,0.06)"
              strokeWidth="1"
            />
          ))}

          {/* Bars */}
          {noteHistogram.map((val, i) => {
            const barWidth = 38;
            const gap = 8;
            const x = 30 + i * (barWidth + gap);
            const barHeight = (val / histogramMax) * 120;
            const y = 20 + 120 - barHeight;
            const isKeyNote = detectedKey !== null && i === detectedKey.root;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 1)}
                  rx="3"
                  fill={isKeyNote ? "#D4A843" : "rgba(212,168,67,0.35)"}
                  opacity={isKeyNote ? 1 : 0.7}
                />
                <text
                  x={x + barWidth / 2}
                  y={152}
                  textAnchor="middle"
                  fill={isKeyNote ? "#D4A843" : "rgba(240,240,242,0.45)"}
                  fontSize="11"
                  fontFamily="inherit"
                  fontWeight={isKeyNote ? 700 : 400}
                >
                  {NOTE_NAMES[i]}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fill="rgba(240,240,242,0.35)"
                  fontSize="9"
                  fontFamily="inherit"
                >
                  {(val * 100).toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Y-axis label */}
          <text x="8" y="85" fill="rgba(240,240,242,0.25)" fontSize="9" fontFamily="inherit" transform="rotate(-90, 8, 85)" textAnchor="middle">
            Amplitude
          </text>
        </svg>
      </div>

      {/* Compatible Chords */}
      <div style={card}>
        <div style={sectionTitle}>Compatible Chords</div>
        {detectedKey ? (
          <div style={{ display: "flex" as const, flexWrap: "wrap" as const, gap: "0.5rem" as const }}>
            {compatibleChords.map((chord, i) => (
              <span
                key={i}
                style={{
                  background: i < 7 ? "rgba(212,168,67,0.12)" : "rgba(212,168,67,0.06)",
                  border: `1px solid ${i < 7 ? "rgba(212,168,67,0.25)" : "rgba(212,168,67,0.1)"}`,
                  borderRadius: "6px" as const,
                  padding: "0.4rem 0.75rem" as const,
                  fontSize: "0.85rem" as const,
                  color: i < 7 ? "#D4A843" : "rgba(212,168,67,0.6)",
                  fontWeight: i < 7 ? 600 : 400,
                }}
              >
                {chord}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: "rgba(240,240,242,0.3)" as const, fontSize: "0.9rem" as const, margin: 0 }}>
            Chords will appear once a key is detected.
          </p>
        )}
      </div>

      {/* Info footer */}
      <div style={{ textAlign: "center" as const, marginTop: "1rem" as const, fontSize: "0.72rem" as const, color: "rgba(240,240,242,0.2)" as const }}>
        Uses Krumhansl-Kessler key-finding algorithm · FFT size 16384 · 60 Hz – 4 kHz analysis range
      </div>
    </div>
  );
}
