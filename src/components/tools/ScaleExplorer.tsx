'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

const SCALE_INTERVALS: Record<string, number[]> = {
  Major:            [0, 2, 4, 5, 7, 9, 11],
  Minor:            [0, 2, 3, 5, 7, 8, 10],
  'Pentatonic Major': [0, 2, 4, 7, 9],
  'Pentatonic Minor': [0, 3, 5, 7, 10],
  Blues:            [0, 3, 5, 6, 7, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor':  [0, 2, 3, 5, 7, 9, 11],
  Dorian:           [0, 2, 3, 5, 7, 9, 10],
  Phrygian:         [0, 1, 3, 5, 7, 8, 10],
  Lydian:           [0, 2, 4, 6, 7, 9, 11],
  Mixolydian:       [0, 2, 4, 5, 7, 9, 10],
  Locrian:          [0, 1, 3, 5, 6, 8, 10],
};

const INTERVAL_NAMES: Record<number, string> = {
  0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3',
  5: '4', 6: '#4/b5', 7: '5', 8: 'b6', 9: '6',
  10: 'b7', 11: '7',
};

// Interval categories for color coding
const ROOT_INTERVALS = new Set([0]);
const THIRD_INTERVALS = new Set([3, 4]);  // minor 3rd, major 3rd
const FIFTH_INTERVALS = new Set([6, 7, 8]); // dim 5, perf 5, aug 5

const SCALE_ORDER: string[] = [
  'Major', 'Minor', 'Pentatonic Major', 'Pentatonic Minor', 'Blues',
  'Harmonic Minor', 'Melodic Minor', 'Dorian', 'Phrygian', 'Lydian',
  'Mixolydian', 'Locrian',
];

// Guitar tuning in semitones from C (E2=4, A2=3, D3=7, G3=11, B3=14, E4=19)
// Standard tuning: E A D G B E
const GUITAR_STRINGS = [4, 3, 7, 11, 14, 19]; // open string semitones relative to C
const GUITAR_STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e'];
const FRET_COUNT = 13; // 0 (open) through 12

// Colors
const BG = '#08080a';
const PANEL = '#121216';
const ACCENT = '#D4A843';
const TEXT = '#f0f0f2';
const TEXT_DIM = '#8a8a9a';
const PANEL_BORDER = '#1e1e24';
const PANEL_HOVER = '#1a1a20';

// Interval colors
const COLORS = {
  root: '#D4A843',     // gold
  third: '#43a8d4',    // blue
  fifth: '#d443a8',    // magenta/pink
  other: '#5a5a6e',    // muted gray
  pianoWhite: '#e8e8ef',
  pianoBlack: '#1a1a22',
  pianoKeyBorder: '#333340',
  stringLine: '#3a3a4a',
  fretLine: '#2a2a36',
  fretMarker: '#4a4a5e',
  nutColor: '#ccccdd',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function noteFromSemitone(semitone: number): string {
  return NOTES[((semitone % 12) + 12) % 12];
}

function getScaleNotes(root: string, scaleType: string): { note: string; interval: number }[] {
  const rootIndex = NOTES.indexOf(root as typeof NOTES[number]);
  const intervals = SCALE_INTERVALS[scaleType] || [];
  return intervals.map(iv => ({
    note: noteFromSemitone(rootIndex + iv),
    interval: iv,
  }));
}

function getIntervalColor(interval: number): string {
  if (ROOT_INTERVALS.has(interval)) return COLORS.root;
  if (THIRD_INTERVALS.has(interval)) return COLORS.third;
  if (FIFTH_INTERVALS.has(interval)) return COLORS.fifth;
  return COLORS.other;
}

function getIntervalLabel(interval: number): string {
  return INTERVAL_NAMES[interval] || `${interval}`;
}

// Web Audio frequency: A4 = 440Hz, semitone ratio = 2^(1/12)
function noteToFrequency(noteName: string, octave: number): number {
  const idx = NOTES.indexOf(noteName as typeof NOTES[number]);
  // A4 is index 9 at octave 4 → MIDI 69
  const midi = (octave + 1) * 12 + idx;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ─── Piano Keyboard (SVG) ────────────────────────────────────────────────────

const OCTAVES = 2;
const WHITE_KEY_W = 36;
const BLACK_KEY_W = 22;
const WHITE_KEY_H = 130;
const BLACK_KEY_H = 82;

// Layout: which octave each white key belongs to
const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_NOTES: Record<string, string> = {
  'C': 'C#', 'D': 'D#', 'F': 'F#', 'G': 'G#', 'A': 'A#',
};

function getWhiteKeyX(octave: number, whiteNoteIndex: number, startOctave: number): number {
  const octaveStart = (octave - startOctave) * 7 * WHITE_KEY_W;
  return octaveStart + whiteNoteIndex * WHITE_KEY_W;
}

interface PianoProps {
  scaleNotes: Set<string>;
  highlightedDetails: Map<string, { interval: number; color: string }>;
  labelMode: 'note' | 'interval';
}

function Piano({ scaleNotes, highlightedDetails, labelMode }: PianoProps) {
  const startOctave = 3;
  const totalWhite = OCTAVES * 7;
  const svgW = totalWhite * WHITE_KEY_W + 1;
  const svgH = WHITE_KEY_H + 36;

  // Build white keys
  const whiteKeys: React.ReactNode[] = [];
  const blackKeys: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];

  for (let oct = 0; oct < OCTAVES; oct++) {
    const octave = startOctave + oct;
    for (let w = 0; w < 7; w++) {
      const note = WHITE_NOTES[w];
      const x = getWhiteKeyX(octave, w, startOctave);
      const fullName = `${note}${octave}`;
      const inScale = scaleNotes.has(note);
      const detail = highlightedDetails.get(note);
      const color = detail?.color;

      whiteKeys.push(
        <rect
          key={`w-${oct}-${note}`}
          x={x}
          y={0}
          width={WHITE_KEY_W}
          height={WHITE_KEY_H}
          rx={3}
          fill={color ? color : COLORS.pianoWhite}
          stroke={COLORS.pianoKeyBorder}
          strokeWidth={0.5}
          opacity={inScale && !detail ? 0.5 : 1}
        />,
      );

      const lx = x + WHITE_KEY_W / 2;
      const ly = WHITE_KEY_H - 8;
      labels.push(
        <text
          key={`lw-${oct}-${note}`}
          x={lx}
          y={ly}
          textAnchor="middle"
          fontSize={10}
          fill={color ? '#fff' : '#444'}
          fontWeight="bold"
          fontFamily="monospace"
        >
          {labelMode === 'interval' && detail
            ? getIntervalLabel(detail.interval)
            : fullName}
        </text>,
      );

      // Black key after this white key?
      const blackNote = BLACK_NOTES[note];
      if (blackNote) {
        const bx = x + WHITE_KEY_W - BLACK_KEY_W / 2;
        const bFullName = `${blackNote}${octave}`;
        const bInScale = scaleNotes.has(blackNote);
        const bDetail = highlightedDetails.get(blackNote);
        const bColor = bDetail?.color;

        blackKeys.push(
          <rect
            key={`b-${oct}-${blackNote}`}
            x={bx}
            y={0}
            width={BLACK_KEY_W}
            height={BLACK_KEY_H}
            rx={2}
            fill={bColor ? bColor : COLORS.pianoBlack}
            stroke={color ? color : '#555'}
            strokeWidth={0.5}
            opacity={bInScale && !bDetail ? 0.5 : 1}
          />,
        );

        const blx = bx + BLACK_KEY_W / 2;
        const bly = BLACK_KEY_H - 8;
        labels.push(
          <text
            key={`lb-${oct}-${blackNote}`}
            x={blx}
            y={bly}
            textAnchor="middle"
            fontSize={9}
            fill={bColor ? '#fff' : '#999'}
            fontWeight="bold"
            fontFamily="monospace"
          >
            {labelMode === 'interval' && bDetail
              ? getIntervalLabel(bDetail.interval)
              : bFullName}
          </text>,
        );
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ width: '100%' as const, maxWidth: svgW, display: 'block' as const, margin: '0 auto' as const }}
    >
      {/* White keys first, then black keys on top */}
      {whiteKeys}
      {blackKeys}
      {labels}
      {/* Bottom label area */}
    </svg>
  );
}

// ─── Guitar Fretboard (SVG) ──────────────────────────────────────────────────

const FRET_W = 50;
const STRING_SPACING = 30;
const FRET_H = STRING_SPACING * 5; // 6 strings, 5 gaps
const NUT_W = 6;
const DOT_FRETS = [3, 5, 7, 9, 12];

interface GuitarProps {
  highlightedDetails: Map<string, { interval: number; color: string }>;
  labelMode: 'note' | 'interval';
}

function Guitar({ highlightedDetails, labelMode }: GuitarProps) {
  const svgW = NUT_W + FRET_COUNT * FRET_W + 14;
  const svgH = FRET_H + 40; // extra for top/bottom labels

  const elements: React.ReactNode[] = [];

  // String labels on the left
  for (let s = 0; s < 6; s++) {
    const sy = 22 + s * STRING_SPACING;
    elements.push(
      <text
        key={`sl-${s}`}
        x={NUT_W - 6}
        y={sy + 4}
        textAnchor="end"
        fontSize={10}
        fill={TEXT_DIM}
        fontWeight="bold"
        fontFamily="monospace"
      >
        {GUITAR_STRING_LABELS[s]}
      </text>,
    );
  }

  // Nut
  elements.push(
    <rect key="nut" x={NUT_W - 4} y={20} width={NUT_W} height={FRET_H} rx={1} fill={COLORS.nutColor} />,
  );

  // String lines
  for (let s = 0; s < 6; s++) {
    const sy = 22 + s * STRING_SPACING;
    elements.push(
      <line
        key={`str-${s}`}
        x1={NUT_W + 2}
        y1={sy}
        x2={NUT_W + FRET_COUNT * FRET_W}
        y2={sy}
        stroke={COLORS.stringLine}
        strokeWidth={s < 2 ? 1 : s < 4 ? 1.5 : 2}
      />,
    );
  }

  // Fret lines
  for (let f = 1; f <= FRET_COUNT; f++) {
    const fx = NUT_W + f * FRET_W;
    elements.push(
      <line
        key={`fr-${f}`}
        x1={fx}
        y1={20}
        x2={fx}
        y2={20 + FRET_H}
        stroke={COLORS.fretLine}
        strokeWidth={1.5}
      />,
    );
    // Fret number label
    elements.push(
      <text
        key={`fn-${f}`}
        x={fx - FRET_W / 2}
        y={14}
        textAnchor="middle"
        fontSize={8}
        fill={TEXT_DIM}
        fontFamily="monospace"
      >
        {f}
      </text>,
    );
  }

  // Fret markers (dots) on the fretboard
  for (const f of DOT_FRETS) {
    if (f <= FRET_COUNT) {
      const mx = NUT_W + f * FRET_W - FRET_W / 2;
      const my = 20 + FRET_H / 2;
      elements.push(
        <circle key={`dot-${f}`} cx={mx} cy={my} r={3.5} fill={COLORS.fretMarker} opacity={0.6} />,
      );
      // Double dot at 12th fret
      if (f === 12) {
        const my1 = my - STRING_SPACING * 0.8;
        const my2 = my + STRING_SPACING * 0.8;
        elements.push(
          <circle key="dot-12a" cx={mx} cy={my1} r={3.5} fill={COLORS.fretMarker} opacity={0.6} />,
        );
        elements.push(
          <circle key="dot-12b" cx={mx} cy={my2} r={3.5} fill={COLORS.fretMarker} opacity={0.6} />,
        );
      }
    }
  }

  // Scale note dots
  for (let s = 0; s < 6; s++) {
    const openSemitone = GUITAR_STRINGS[s];
    const sy = 22 + s * STRING_SPACING;

    for (let f = 0; f <= FRET_COUNT; f++) {
      const semitone = openSemitone + f;
      const note = noteFromSemitone(semitone);
      const detail = highlightedDetails.get(note);

      if (detail) {
        const fx = f === 0
          ? NUT_W - FRET_W / 2
          : NUT_W + f * FRET_W - FRET_W / 2;

        elements.push(
          <circle
            key={`sn-${s}-${f}`}
            cx={fx}
            cy={sy}
            r={11}
            fill={detail.color}
            opacity={0.85}
            stroke={detail.color}
            strokeWidth={2}
          />,
        );

        elements.push(
          <text
            key={`sn-t-${s}-${f}`}
            x={fx}
            y={sy + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fill="#000"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {labelMode === 'interval'
              ? getIntervalLabel(detail.interval)
              : note}
          </text>,
        );
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ width: '100%' as const, maxWidth: svgW, display: 'block' as const, margin: '0 auto' as const }}
    >
      {elements}
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ScaleExplorer() {
  const [root, setRoot] = useState<string>('C');
  const [scaleType, setScaleType] = useState<string>('Major');
  const [labelMode, setLabelMode] = useState<'note' | 'interval'>('note');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const scaleNotes = useMemo(() => getScaleNotes(root, scaleType), [root, scaleType]);

  const scaleNoteSet = useMemo(() => new Set(scaleNotes.map(s => s.note)), [scaleNotes]);

  const highlightedDetails = useMemo(() => {
    const map = new Map<string, { interval: number; color: string }>();
    for (const { note, interval } of scaleNotes) {
      map.set(note, { interval, color: getIntervalColor(interval) });
    }
    return map;
  }, [scaleNotes]);

  const playScale = useCallback(async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const intervals = SCALE_INTERVALS[scaleType] || [];
    const rootIndex = NOTES.indexOf(root as typeof NOTES[number]);
    const octave = 4;
    const noteDuration = 0.35;
    const gap = 0.05;
    let startTime = ctx.currentTime + 0.05;

    // Play ascending
    for (let i = 0; i < intervals.length; i++) {
      const freq = noteToFrequency(
        noteFromSemitone(rootIndex + intervals[i]),
        octave + Math.floor((rootIndex + intervals[i]) / 12),
      );
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.01);
      startTime += noteDuration + gap;
    }
    // Play root octave
    {
      const freq = noteToFrequency(root, octave + 1);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration * 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration * 1.5 + 0.01);
    }

    const totalDuration = (intervals.length + 1) * (noteDuration + gap) * 1000 + 300;
    setTimeout(() => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
      audioCtxRef.current = null;
      setIsPlaying(false);
    }, totalDuration);
  }, [root, scaleType, isPlaying]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const selectStyle: React.CSSProperties = {
    background: PANEL,
    color: TEXT,
    border: `1px solid ${PANEL_BORDER}`,
    borderRadius: 8,
    padding: '8px 12px' as const,
    fontSize: 14,
    fontFamily: 'monospace' as const,
    outline: 'none' as const,
    cursor: 'pointer' as const,
    appearance: 'none' as const,
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    paddingRight: 32,
    width: '100%' as const,
  };

  return (
    <div style={{
      background: BG,
      color: TEXT,
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      minHeight: '100vh' as const,
      padding: '20px 16px 60px' as const,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' as const }}>
        {/* Title */}
        <h1 style={{
          fontFamily: 'monospace' as const,
          color: ACCENT,
          fontSize: 28,
          marginBottom: 4,
          letterSpacing: 2,
        }}>
          SCALE EXPLORER
        </h1>
        <p style={{ color: TEXT_DIM, fontSize: 13, marginBottom: 24, fontFamily: 'monospace' as const }}>
          Interactive scale reference · Piano & Guitar fretboard
        </p>

        {/* Controls */}
        <div style={{
          display: 'grid' as const,
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' as const,
          gap: 16,
          marginBottom: 24,
        }}>
          {/* Root note */}
          <div>
            <label style={{ display: 'block' as const, fontSize: 11, color: TEXT_DIM, marginBottom: 6, fontFamily: 'monospace' as const, letterSpacing: 1 }}>
              ROOT NOTE
            </label>
            <div style={{ position: 'relative' as const }}>
              <select
                value={root}
                onChange={e => setRoot(e.target.value)}
                style={selectStyle}
              >
                {NOTES.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span style={{
                position: 'absolute' as const,
                right: 10,
                top: '50%' as const,
                transform: 'translateY(-50%)' as const,
                color: ACCENT,
                fontSize: 12,
                pointerEvents: 'none' as const,
              }}>▾</span>
            </div>
          </div>

          {/* Scale type */}
          <div style={{ gridColumn: 'span 2' as const }}>
            <label style={{ display: 'block' as const, fontSize: 11, color: TEXT_DIM, marginBottom: 6, fontFamily: 'monospace' as const, letterSpacing: 1 }}>
              SCALE TYPE
            </label>
            <div style={{ position: 'relative' as const }}>
              <select
                value={scaleType}
                onChange={e => setScaleType(e.target.value)}
                style={selectStyle}
              >
                {SCALE_ORDER.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span style={{
                position: 'absolute' as const,
                right: 10,
                top: '50%' as const,
                transform: 'translateY(-50%)' as const,
                color: ACCENT,
                fontSize: 12,
                pointerEvents: 'none' as const,
              }}>▾</span>
            </div>
          </div>

          {/* Label mode */}
          <div>
            <label style={{ display: 'block' as const, fontSize: 11, color: TEXT_DIM, marginBottom: 6, fontFamily: 'monospace' as const, letterSpacing: 1 }}>
              LABELS
            </label>
            <div style={{ display: 'flex' as const, gap: 4 }}>
              <button
                onClick={() => setLabelMode('note')}
                style={{
                  flex: 1,
                  padding: '8px 12px' as const,
                  borderRadius: 8,
                  border: `1px solid ${labelMode === 'note' ? ACCENT : PANEL_BORDER}`,
                  background: labelMode === 'note' ? ACCENT + '22' : PANEL,
                  color: labelMode === 'note' ? ACCENT : TEXT_DIM,
                  fontSize: 12,
                  fontFamily: 'monospace' as const,
                  cursor: 'pointer' as const,
                  fontWeight: 600,
                }}
              >
                NOTE
              </button>
              <button
                onClick={() => setLabelMode('interval')}
                style={{
                  flex: 1,
                  padding: '8px 12px' as const,
                  borderRadius: 8,
                  border: `1px solid ${labelMode === 'interval' ? ACCENT : PANEL_BORDER}`,
                  background: labelMode === 'interval' ? ACCENT + '22' : PANEL,
                  color: labelMode === 'interval' ? ACCENT : TEXT_DIM,
                  fontSize: 12,
                  fontFamily: 'monospace' as const,
                  cursor: 'pointer' as const,
                  fontWeight: 600,
                }}
              >
                INTERVAL
              </button>
            </div>
          </div>

          {/* Play button */}
          <div>
            <label style={{ display: 'block' as const, fontSize: 11, color: TEXT_DIM, marginBottom: 6, fontFamily: 'monospace' as const, letterSpacing: 1 }}>
              PLAY
            </label>
            <button
              onClick={playScale}
              disabled={isPlaying}
              style={{
                width: '100%' as const,
                padding: '8px 16px' as const,
                borderRadius: 8,
                border: `1px solid ${ACCENT}`,
                background: isPlaying ? ACCENT + '33' : ACCENT,
                color: isPlaying ? ACCENT : '#000',
                fontSize: 14,
                fontFamily: 'monospace' as const,
                fontWeight: 700,
                cursor: isPlaying ? 'wait' : 'pointer',
                letterSpacing: 1,
                transition: 'all 0.15s' as const,
              }}
            >
              {isPlaying ? '▶ PLAYING...' : '▶ PLAY SCALE'}
            </button>
          </div>
        </div>

        {/* Scale info cards */}
        <div style={{
          display: 'flex' as const,
          flexWrap: 'wrap' as const,
          gap: 8,
          marginBottom: 24,
          alignItems: 'center' as const,
        }}>
          {scaleNotes.map(({ note, interval }) => {
            const color = getIntervalColor(interval);
            return (
              <div
                key={note}
                style={{
                  display: 'inline-flex' as const,
                  alignItems: 'center' as const,
                  gap: 6,
                  padding: '6px 14px' as const,
                  borderRadius: 20,
                  border: `1.5px solid ${color}`,
                  background: color + '16',
                  fontFamily: 'monospace' as const,
                  fontSize: 13,
                  fontWeight: 600,
                  color: color,
                }}
              >
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%' as const,
                  background: color,
                  display: 'inline-block' as const,
                }} />
                {note}
                <span style={{ fontSize: 10, opacity: 0.7 }}>
                  {getIntervalLabel(interval)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex' as const,
          flexWrap: 'wrap' as const,
          gap: 16,
          marginBottom: 20,
          fontSize: 11,
          fontFamily: 'monospace' as const,
          color: TEXT_DIM,
        }}>
          {[
            { label: 'Root', color: COLORS.root },
            { label: '3rd', color: COLORS.third },
            { label: '5th', color: COLORS.fifth },
            { label: 'Other', color: COLORS.other },
          ].map(({ label, color }) => (
            <span key={label} style={{ display: 'inline-flex' as const, alignItems: 'center' as const, gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' as const }} />
              {label}
            </span>
          ))}
        </div>

        {/* Visualizations */}
        <div style={{
          display: 'grid' as const,
          gridTemplateColumns: '1fr' as const,
          gap: 20,
        }}>
          {/* Piano */}
          <div style={{
            background: PANEL,
            border: `1px solid ${PANEL_BORDER}`,
            borderRadius: 12,
            padding: '16px 12px 8px' as const,
          }}>
            <h3 style={{
              fontFamily: 'monospace' as const,
              fontSize: 11,
              color: ACCENT,
              letterSpacing: 2,
              marginBottom: 12,
              textTransform: 'uppercase' as const,
            }}>
              Piano · {root} {scaleType}
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <Piano
                scaleNotes={scaleNoteSet}
                highlightedDetails={highlightedDetails}
                labelMode={labelMode}
              />
            </div>
          </div>

          {/* Guitar */}
          <div style={{
            background: PANEL,
            border: `1px solid ${PANEL_BORDER}`,
            borderRadius: 12,
            padding: '16px 12px 8px' as const,
          }}>
            <h3 style={{
              fontFamily: 'monospace' as const,
              fontSize: 11,
              color: ACCENT,
              letterSpacing: 2,
              marginBottom: 12,
              textTransform: 'uppercase' as const,
            }}>
              Guitar · {root} {scaleType} · Standard Tuning
            </h3>
            <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
              <Guitar
                highlightedDetails={highlightedDetails}
                labelMode={labelMode}
              />
            </div>
          </div>
        </div>

        {/* Notes interval table */}
        <div style={{
          marginTop: 20,
          background: PANEL,
          border: `1px solid ${PANEL_BORDER}`,
          borderRadius: 12,
          padding: 16,
          overflowX: 'auto',
        }}>
          <h3 style={{
            fontFamily: 'monospace' as const,
            fontSize: 11,
            color: ACCENT,
            letterSpacing: 2,
            marginBottom: 12,
            textTransform: 'uppercase' as const,
          }}>
            Interval Table
          </h3>
          <table style={{
            width: '100%' as const,
            borderCollapse: 'collapse' as const,
            fontFamily: 'monospace' as const,
            fontSize: 13,
          }}>
            <thead>
              <tr>
                {['Degree', 'Interval', 'Semitones', 'Note'].map(h => (
                  <th key={h} style={{
                    padding: '6px 12px' as const,
                    textAlign: 'left' as const,
                    color: TEXT_DIM,
                    borderBottom: `1px solid ${PANEL_BORDER}`,
                    fontSize: 11,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scaleNotes.map(({ note, interval }, idx) => {
                const color = getIntervalColor(interval);
                return (
                  <tr key={note} style={{ borderBottom: `1px solid ${PANEL_BORDER}` }}>
                    <td style={{ padding: '6px 12px' as const, color: TEXT_DIM }}>{idx + 1}</td>
                    <td style={{ padding: '6px 12px' as const, color, fontWeight: 600 }}>
                      {getIntervalLabel(interval)}
                    </td>
                    <td style={{ padding: '6px 12px' as const, color: TEXT_DIM }}>{interval}</td>
                    <td style={{ padding: '6px 12px' as const, color, fontWeight: 700, fontSize: 15 }}>{note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
