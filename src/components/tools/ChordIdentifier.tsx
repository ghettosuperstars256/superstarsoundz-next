'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

// ─── Musical Constants ───────────────────────────────────────────────────────

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const A4 = 440;
const C0 = A4 * Math.pow(2, -4.75); // ~16.35 Hz

function freqToMidi(freq: number): number {
  return 12 * Math.log2(freq / C0);
}

function midiToNoteName(midi: number): string {
  const idx = Math.round(midi) % 12;
  return NOTE_NAMES[((idx % 12) + 12) % 12];
}

function midiToNoteIndex(midi: number): number {
  return ((Math.round(midi) % 12) + 12) % 12;
}

// ─── Chord Database ─────────────────────────────────────────────────────────

interface ChordDef {
  name: string;
  symbol: string;
  intervals: number[]; // semitone offsets from root
}

const CHORD_DB: ChordDef[] = [
  { name: 'Major', symbol: '', intervals: [0, 4, 7] },
  { name: 'Minor', symbol: 'm', intervals: [0, 3, 7] },
  { name: 'Diminished', symbol: 'dim', intervals: [0, 3, 6] },
  { name: 'Augmented', symbol: 'aug', intervals: [0, 4, 8] },
  { name: 'Suspended 2nd', symbol: 'sus2', intervals: [0, 2, 7] },
  { name: 'Suspended 4th', symbol: 'sus4', intervals: [0, 5, 7] },
  { name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10] },
  { name: 'Major 7th', symbol: 'maj7', intervals: [0, 4, 7, 11] },
  { name: 'Minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10] },
  { name: 'Minor Major 7th', symbol: 'mMaj7', intervals: [0, 3, 7, 11] },
  { name: 'Diminished 7th', symbol: 'dim7', intervals: [0, 3, 6, 9] },
  { name: 'Half-Diminished 7th', symbol: 'm7b5', intervals: [0, 3, 6, 10] },
  { name: 'Augmented 7th', symbol: 'aug7', intervals: [0, 4, 8, 10] },
  { name: 'Augmented Major 7th', symbol: 'augMaj7', intervals: [0, 4, 8, 11] },
  { name: 'Dominant 9th', symbol: '9', intervals: [0, 4, 7, 10, 14] },
  { name: 'Major 9th', symbol: 'maj9', intervals: [0, 4, 7, 11, 14] },
  { name: 'Minor 9th', symbol: 'm9', intervals: [0, 3, 7, 10, 14] },
  { name: 'Add 9', symbol: 'add9', intervals: [0, 4, 7, 14] },
  { name: '6th', symbol: '6', intervals: [0, 4, 7, 9] },
  { name: 'Minor 6th', symbol: 'm6', intervals: [0, 3, 7, 9] },
  { name: 'Dominant 11th', symbol: '11', intervals: [0, 4, 7, 10, 14, 17] },
  { name: 'Major 11th', symbol: 'maj11', intervals: [0, 4, 7, 11, 14, 17] },
  { name: 'Minor 11th', symbol: 'm11', intervals: [0, 3, 7, 10, 14, 17] },
  { name: 'Dominant 13th', symbol: '13', intervals: [0, 4, 7, 10, 14, 17, 21] },
  { name: 'Major 13th', symbol: 'maj13', intervals: [0, 4, 7, 11, 14, 17, 21] },
  { name: 'Minor 13th', symbol: 'm13', intervals: [0, 3, 7, 10, 14, 17, 21] },
  { name: '7th Suspended 4th', symbol: '7sus4', intervals: [0, 5, 7, 10] },
  { name: '7th Suspended 2nd', symbol: '7sus2', intervals: [0, 2, 7, 10] },
  { name: 'Power Chord', symbol: '5', intervals: [0, 7] },
  { name: 'Major 7th Sharp 11th', symbol: 'maj7#11', intervals: [0, 4, 7, 11, 18] },
  { name: 'Dominant 7th Sharp 11th', symbol: '7#11', intervals: [0, 4, 7, 10, 18] },
  { name: 'Dominant 7th Flat 9', symbol: '7b9', intervals: [0, 4, 7, 10, 13] },
  { name: 'Dominant 7th Sharp 9', symbol: '7#9', intervals: [0, 4, 7, 10, 15] },
];

// ─── Chord Detection Logic ──────────────────────────────────────────────────

function detectChord(noteIndices: number[]): { root: string; chord: ChordDef } | null {
  if (noteIndices.length < 2) return null;

  const unique = [...new Set(noteIndices)].sort((a, b) => a - b);
  if (unique.length < 2) return null;

  let bestMatch: { root: string; chord: ChordDef; score: number } | null = null;

  for (const rootIdx of unique) {
    for (const chordDef of CHORD_DB) {
      const chordNotes = chordDef.intervals.map((i) => (rootIdx + i) % 12);
      const matched = chordNotes.filter((n) => unique.includes(n)).length;
      const total = chordNotes.length;
      const extraNotes = unique.filter((n) => !chordNotes.includes(n)).length;
      const score = matched / total - extraNotes * 0.15;

      if (matched >= 2 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { root: NOTE_NAMES[rootIdx], chord: chordDef, score };
      }
    }
  }

  if (!bestMatch || bestMatch.score < 0.5) return null;
  return { root: bestMatch.root, chord: bestMatch.chord };
}

// ─── Frequency Detection ────────────────────────────────────────────────────

function detectFrequencies(
  analyser: AnalyserNode,
  sampleRate: number
): { freq: number; magnitude: number }[] {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);
  analyser.getFloatFrequencyData(dataArray);

  const freqs: { freq: number; magnitude: number }[] = [];
  const threshold = -60; // dB

  for (let i = 1; i < bufferLength - 1; i++) {
    const db = dataArray[i];
    if (db > threshold && db > dataArray[i - 1] && db > dataArray[i + 1]) {
      // Parabolic interpolation for better accuracy
      const alpha = dataArray[i - 1];
      const beta = db;
      const gamma = dataArray[i + 1];
      const p = 0.5 * (alpha - gamma) / (alpha - 2 * beta + gamma);
      const bin = i + p;
      const freq = (bin * sampleRate) / (bufferLength * 2);
      if (freq > 60 && freq < 4000) {
        freqs.push({ freq, magnitude: beta });
      }
    }
  }

  // Sort by magnitude descending, keep top peaks
  freqs.sort((a, b) => b.magnitude - a.magnitude);
  return freqs.slice(0, 12);
}

// ─── Chord Diagram (SVG) ────────────────────────────────────────────────────

const FRET_POSITIONS = [0, 1, 2, 3, 4];
const STRING_SPACING = 22;
const FRET_SPACING = 36;
const DIAGRAM_X = 30;
const DIAGRAM_Y = 50;
const NUM_STRINGS = 6;
const NUM_FRETS = 5;

function getChordFrets(root: string, chord: ChordDef): number[] {
  // Standard tuning: E A D G B E (low to high)
  const openStrings = [4, 11, 7, 2, 9, 4]; // E=4, A=11, D=7, G=2, B=9, E=4
  const rootIdx = NOTE_NAMES.indexOf(root);
  const chordNotes = chord.intervals.map((i) => (rootIdx + i) % 12);

  // For each string, find the lowest fret (0-4) that produces a chord tone
  const frets: number[] = [];
  for (let s = 0; s < NUM_STRINGS; s++) {
    let found = -1;
    for (let f = 0; f <= 4; f++) {
      const note = (openStrings[s] + f) % 12;
      if (chordNotes.includes(note)) {
        found = f;
        break;
      }
    }
    frets.push(found);
  }
  return frets;
}

function ChordDiagram({ root, chord }: { root: string; chord: ChordDef }) {
  const frets = getChordFrets(root, chord);
  const chordNotes = chord.intervals.map((i) => (NOTE_NAMES.indexOf(root) + i) % 12);

  return (
    <svg
      width={DIAGRAM_X + NUM_FRETS * FRET_SPACING + 20}
      height={DIAGRAM_Y + (NUM_STRINGS - 1) * STRING_SPACING + 30}
      style={{ display: 'block' as const, margin: '0 auto' as const }}
    >
      {/* Fret numbers */}
      {FRET_POSITIONS.map((f) => (
        <text
          key={`fn-${f}`}
          x={DIAGRAM_X + f * FRET_SPACING + FRET_SPACING / 2}
          y={DIAGRAM_Y - 10}
          textAnchor="middle"
          fill="#888"
          fontSize="11"
          fontFamily="monospace"
        >
          {f === 0 ? 'Open' : f}
        </text>
      ))}

      {/* Nut or fret line */}
      {FRET_POSITIONS.map((f) => (
        <line
          key={`fl-${f}`}
          x1={DIAGRAM_X + f * FRET_SPACING}
          y1={DIAGRAM_Y}
          x2={DIAGRAM_X + f * FRET_SPACING}
          y2={DIAGRAM_Y + (NUM_STRINGS - 1) * STRING_SPACING}
          stroke={f === 0 ? '#D4A843' : '#444'}
          strokeWidth={f === 0 ? 3 : 1.5}
        />
      ))}

      {/* Strings */}
      {Array.from({ length: NUM_STRINGS }).map((_, s) => (
        <line
          key={`s-${s}`}
          x1={DIAGRAM_X}
          y1={DIAGRAM_Y + s * STRING_SPACING}
          x2={DIAGRAM_X + NUM_FRETS * FRET_SPACING}
          y2={DIAGRAM_Y + s * STRING_SPACING}
          stroke="#666"
          strokeWidth={1 + (5 - s) * 0.3}
        />
      ))}

      {/* Finger dots / open / muted */}
      {frets.map((fret, s) => {
        if (fret === -1) {
          // Muted string
          return (
            <text
              key={`m-${s}`}
              x={DIAGRAM_X - 12}
              y={DIAGRAM_Y + s * STRING_SPACING + 4}
              fill="#f44"
              fontSize="12"
              fontWeight="bold"
            >
              ×
            </text>
          );
        }
        if (fret === 0) {
          // Open string
          return (
            <circle
              key={`o-${s}`}
              cx={DIAGRAM_X - 6}
              cy={DIAGRAM_Y + s * STRING_SPACING}
              r={5}
              fill="none"
              stroke="#D4A843"
              strokeWidth={1.5}
            />
          );
        }
        // Fretted note
        const noteIdx = ([4, 11, 7, 2, 9, 4][s] + fret) % 12;
        const isRoot = noteIdx === NOTE_NAMES.indexOf(root);
        return (
          <circle
            key={`d-${s}`}
            cx={DIAGRAM_X + (fret - 0.5) * FRET_SPACING}
            cy={DIAGRAM_Y + s * STRING_SPACING}
            r={7}
            fill={isRoot ? '#D4A843' : '#f0f0f2'}
            stroke={isRoot ? '#D4A843' : '#888'}
            strokeWidth={1}
          />
        );
      })}

      {/* Chord name on diagram */}
      <text
        x={DIAGRAM_X + (NUM_FRETS * FRET_SPACING) / 2}
        y={DIAGRAM_Y + (NUM_STRINGS - 1) * STRING_SPACING + 24}
        textAnchor="middle"
        fill="#D4A843"
        fontSize="14"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {root}{chord.symbol}
      </text>
    </svg>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ChordIdentifier() {
  const [isListening, setIsListening] = useState(false);
  const [detectedNotes, setDetectedNotes] = useState<string[]>([]);
  const [chordName, setChordName] = useState<string>('');
  const [chordDef, setChordDef] = useState<ChordDef | null>(null);
  const [chordRoot, setChordRoot] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [level, setLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const noteHistoryRef = useRef<number[][]>([]);

  const stopListening = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsListening(false);
    setLevel(0);
  }, []);

  const startListening = useCallback(async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 8192;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      noteHistoryRef.current = [];

      const sampleRate = ctx.sampleRate;

      const tick = () => {
        if (!analyserRef.current) return;

        const freqs = detectFrequencies(analyserRef.current, sampleRate);
        const noteIndices = freqs.map((f) => midiToNoteIndex(freqToMidi(f.freq)));
        const uniqueNotes = [...new Set(noteIndices)];

        // Rolling average for stability
        noteHistoryRef.current.push(uniqueNotes);
        if (noteHistoryRef.current.length > 6) {
          noteHistoryRef.current.shift();
        }

        // Vote across history
        const voteMap = new Map<number, number>();
        for (const frame of noteHistoryRef.current) {
          for (const n of frame) {
            voteMap.set(n, (voteMap.get(n) || 0) + 1);
          }
        }
        const stableNotes = [...voteMap.entries()]
          .filter(([, count]) => count >= 3)
          .sort((a, b) => b[1] - a[1])
          .map(([n]) => n);

        const noteNames = stableNotes.map((i) => NOTE_NAMES[i]);
        setDetectedNotes(noteNames);

        // Level meter
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setLevel(Math.min(100, (avg / 255) * 100));

        // Chord detection
        if (stableNotes.length >= 2) {
          const result = detectChord(stableNotes);
          if (result) {
            setChordName(`${result.root}${result.chord.symbol}`);
            setChordDef(result.chord);
            setChordRoot(result.root);
          } else {
            setChordName('');
            setChordDef(null);
            setChordRoot('');
          }
        } else {
          setChordName('');
          setChordDef(null);
          setChordRoot('');
        }

        animFrameRef.current = requestAnimationFrame(tick);
      };

      animFrameRef.current = requestAnimationFrame(tick);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message.includes('Permission') || message.includes('NotAllowed')) {
        setError('Microphone permission denied. Please allow microphone access and try again.');
      } else if (message.includes('NotFound') || message.includes('DevicesNotFound')) {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError(`Error: ${message}`);
      }
      setIsListening(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // ─── Styles ───────────────────────────────────────────────────────────────

  const styles = {
    container: {
      background: '#08080a' as const,
      borderRadius: 16,
      padding: '32px 24px' as const,
      maxWidth: 520,
      margin: '0 auto' as const,
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      color: '#f0f0f2' as const,
      border: '1px solid #1a1a20' as const,
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      textAlign: 'center' as const,
      marginBottom: 24,
      color: '#D4A843' as const,
      letterSpacing: 1,
    },
    button: {
      display: 'block' as const,
      width: '100%' as const,
      padding: '14px 0' as const,
      borderRadius: 10,
      border: 'none' as const,
      fontSize: 16,
      fontWeight: 600,
      cursor: 'pointer' as const,
      letterSpacing: 0.5,
      transition: 'all 0.2s' as const,
      marginBottom: 20,
    },
    startBtn: {
      background: '#D4A843' as const,
      color: '#08080a' as const,
    },
    stopBtn: {
      background: '#2a1a1a' as const,
      color: '#f44' as const,
      border: '1px solid #f44' as const,
    },
    levelBar: {
      width: '100%' as const,
      height: 6,
      background: '#121216' as const,
      borderRadius: 3,
      marginBottom: 20,
      overflow: 'hidden' as const,
    },
    levelFill: {
      height: '100%' as const,
      borderRadius: 3,
      transition: 'width 0.05s ease-out' as const,
      background: 'linear-gradient(90deg, #D4A843, #e8c44a)' as const,
    },
    notesSection: {
      textAlign: 'center' as const,
      marginBottom: 20,
    },
    notesLabel: {
      fontSize: 12,
      color: '#888' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 2,
      marginBottom: 8,
    },
    notesRow: {
      display: 'flex' as const,
      justifyContent: 'center' as const,
      gap: 8,
      flexWrap: 'wrap' as const,
      minHeight: 48,
    },
    noteBadge: {
      display: 'inline-flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      width: 44,
      height: 44,
      borderRadius: 10,
      background: '#121216' as const,
      border: '1px solid #D4A843' as const,
      color: '#D4A843' as const,
      fontSize: 18,
      fontWeight: 700,
      fontFamily: 'monospace' as const,
    },
    emptyNote: {
      display: 'inline-flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      width: 44,
      height: 44,
      borderRadius: 10,
      background: '#121216' as const,
      border: '1px solid #222' as const,
      color: '#444' as const,
      fontSize: 18,
      fontWeight: 700,
    },
    chordSection: {
      textAlign: 'center' as const,
      marginBottom: 20,
      minHeight: 60,
    },
    chordName: {
      fontSize: 42,
      fontWeight: 800,
      color: '#D4A843' as const,
      letterSpacing: 2,
      lineHeight: 1.1,
    },
    chordSubtext: {
      fontSize: 13,
      color: '#888' as const,
      marginTop: 4,
    },
    diagramSection: {
      background: '#0c0c10' as const,
      borderRadius: 12,
      padding: '16px 8px' as const,
      border: '1px solid #1a1a20' as const,
      marginBottom: 16,
    },
    errorBox: {
      background: '#1a0a0a' as const,
      border: '1px solid #f44' as const,
      borderRadius: 8,
      padding: '12px 16px' as const,
      color: '#f88' as const,
      fontSize: 13,
      marginBottom: 16,
      textAlign: 'center' as const,
    },
    statusRow: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 8,
      marginBottom: 16,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: '50%' as const,
      background: '#333' as const,
    },
    statusDotActive: {
      background: '#4f4' as const,
      boxShadow: '0 0 8px #4f4' as const,
    },
    statusText: {
      fontSize: 12,
      color: '#888' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>CHORD IDENTIFIER</div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.statusRow}>
        <div
          style={{
            ...styles.statusDot,
            ...(isListening ? styles.statusDotActive : {}),
          }}
        />
        <span style={styles.statusText}>
          {isListening ? 'Listening' : 'Idle'}
        </span>
      </div>

      <button
        onClick={toggleListening}
        style={{
          ...styles.button,
          ...(isListening ? styles.stopBtn : styles.startBtn),
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.85';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        {isListening ? '■ Stop Listening' : '● Start Listening'}
      </button>

      <div style={styles.levelBar}>
        <div style={{ ...styles.levelFill, width: `${level}%` }} />
      </div>

      <div style={styles.notesSection}>
        <div style={styles.notesLabel}>Detected Notes</div>
        <div style={styles.notesRow}>
          {detectedNotes.length > 0 ? (
            detectedNotes.map((note, i) => (
              <div key={`${note}-${i}`} style={styles.noteBadge}>
                {note}
              </div>
            ))
          ) : (
            <>
              <div style={styles.emptyNote}>—</div>
              <div style={styles.emptyNote}>—</div>
              <div style={styles.emptyNote}>—</div>
            </>
          )}
        </div>
      </div>

      <div style={styles.chordSection}>
        {chordName ? (
          <>
            <div style={styles.chordName}>{chordName}</div>
            {chordDef && (
              <div style={styles.chordSubtext}>
                {chordDef.name} • {chordDef.intervals.length} notes
              </div>
            )}
          </>
        ) : (
          <div style={{ ...styles.chordName, color: '#333' as const, fontSize: 28 }}>
            {isListening ? 'Play a chord...' : '—'}
          </div>
        )}
      </div>

      {chordDef && chordRoot && (
        <div style={styles.diagramSection}>
          <ChordDiagram root={chordRoot} chord={chordDef} />
        </div>
      )}
    </div>
  );
}
