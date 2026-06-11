'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

// ── Note / tuning data ──────────────────────────────────────────────────────

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface TuningPreset {
  name: string;
  strings: string[]; // note+octave per string, low→high
}

const PRESETS: TuningPreset[] = [
  { name: 'Standard (EADGBE)', strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
  { name: 'Drop D (DADGBE)', strings: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
  { name: 'Open G (DGDGBD)', strings: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'] },
  { name: 'DADGAD', strings: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'] },
  { name: 'Ukulele (GCEA)', strings: ['G4', 'C4', 'E4', 'A4'] },
];

/** Convert a frequency in Hz to { note, octave, cents } relative to A4=440 Hz. */
function freqToNote(freq: number): { note: string; octave: number; cents: number } {
  if (freq <= 0) return { note: '—', octave: 0, cents: 0 };
  // MIDI note number: 69 = A4 = 440 Hz
  const midi = 69 + 12 * Math.log2(freq / 440);
  const midiRounded = Math.round(midi);
  const cents = Math.round((midi - midiRounded) * 100);
  const noteIndex = ((midiRounded % 12) + 12) % 12;
  const octave = Math.floor(midiRounded / 12) - 1;
  return { note: NOTE_NAMES[noteIndex], octave, cents };
}

/** Parse a string label like "E2" → frequency in Hz. */
function noteToFreq(label: string): number {
  const match = label.match(/^([A-G]#?)(\d)$/);
  if (!match) return 0;
  const note = match[1];
  const octave = parseInt(match[2], 10);
  const semitone = NOTE_NAMES.indexOf(note);
  if (semitone < 0) return 0;
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ── Autocorrelation pitch detection ─────────────────────────────────────────

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  const n = buf.length;
  let rms = 0;
  for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / n);
  if (rms < 0.01) return -1; // too quiet

  // Trim edges to reduce noise
  let r1 = 0;
  let r2 = n - 1;
  const thresh = 0.2;
  for (let i = 0; i < n / 2; i++) {
    if (Math.abs(buf[i]) < thresh) { r1 = i; break; }
  }
  for (let i = 1; i < n / 2; i++) {
    if (Math.abs(buf[n - i]) < thresh) { r2 = n - i; break; }
  }
  buf = buf.slice(r1, r2);
  const newLen = buf.length;

  const corr = new Float32Array(newLen);
  for (let lag = 0; lag < newLen; lag++) {
    let sum = 0;
    for (let i = 0; i < newLen - lag; i++) {
      sum += buf[i] * buf[i + lag];
    }
    corr[lag] = sum;
  }

  // Find first peak after initial decay
  let d = 0;
  while (corr[d] > corr[d + 1]) d++;
  let maxVal = -1;
  let maxPos = -1;
  for (let i = d; i < newLen; i++) {
    if (corr[i] > maxVal) {
      maxVal = corr[i];
      maxPos = i;
    }
  }
  if (maxPos === -1) return -1;

  // Parabolic interpolation for sub-sample accuracy
  const T0 = maxPos;
  const x1 = corr[T0 - 1] ?? 0;
  const x2 = corr[T0];
  const x3 = corr[T0 + 1] ?? 0;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  const shift = a !== 0 ? -b / (2 * a) : 0;

  return sampleRate / (T0 + shift);
}

// ── Component ───────────────────────────────────────────────────────────────

export default function Tuner() {
  const [listening, setListening] = useState(false);
  const [detectedFreq, setDetectedFreq] = useState(0);
  const [detectedNote, setDetectedNote] = useState('—');
  const [detectedOctave, setDetectedOctave] = useState(0);
  const [cents, setCents] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [activeString, setActiveString] = useState<number | null>(null);
  const [error, setError] = useState('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const bufRef = useRef<Float32Array>(new Float32Array(0));

  const stopListening = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setListening(false);
    setDetectedFreq(0);
    setDetectedNote('—');
    setDetectedOctave(0);
    setCents(0);
    setActiveString(null);
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      bufRef.current = new Float32Array(analyser.fftSize);
      setListening(true);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(bufRef.current as any);
        const freq = autoCorrelate(bufRef.current, ctx.sampleRate);
        if (freq > 0) {
          const { note, octave, cents: c } = freqToNote(freq);
          setDetectedFreq(Math.round(freq * 10) / 10);
          setDetectedNote(note);
          setDetectedOctave(octave);
          setCents(c);

          // Find closest string in current preset
          const preset = PRESETS[selectedPreset];
          let bestIdx = -1;
          let bestDiff = Infinity;
          preset.strings.forEach((s, i) => {
            const sf = noteToFreq(s);
            const diff = Math.abs(freq - sf);
            if (diff < bestDiff) {
              bestDiff = diff;
              bestIdx = i;
            }
          });
          if (bestDiff < 30) {
            setActiveString(bestIdx);
          } else {
            setActiveString(null);
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Microphone access denied';
      setError(message);
    }
  }, [selectedPreset]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const inTune = Math.abs(cents) <= 5;
  const sharp = cents > 0;

  // Needle angle: -45° (flat) to +45° (sharp)
  const needleAngle = Math.max(-45, Math.min(45, cents * 0.9));

  const preset = PRESETS[selectedPreset];

  // ── Styles ───────────────────────────────────────────────────────────────

  const s = {
    container: {
      background: '#08080a' as const,
      color: '#f0f0f2' as const,
      fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
      padding: '24px' as const,
      borderRadius: '16px' as const,
      maxWidth: '480px' as const,
      margin: '0 auto' as const,
      border: '1px solid #1a1a22' as const,
    },
    title: {
      fontSize: '20px' as const,
      fontWeight: 700,
      textAlign: 'center' as const,
      marginBottom: '20px' as const,
      color: '#D4A843' as const,
      letterSpacing: '0.5px' as const,
    },
    presetRow: {
      display: 'flex' as const,
      flexWrap: 'wrap' as const,
      gap: '6px' as const,
      justifyContent: 'center' as const,
      marginBottom: '20px' as const,
    },
    presetBtn: (active: boolean) => ({
      padding: '6px 12px' as const,
      borderRadius: '8px' as const,
      border: active ? '1px solid #D4A843' : '1px solid #2a2a35',
      background: active ? '#D4A84322' : '#121216',
      color: active ? '#D4A843' : '#8888a0',
      fontSize: '12px' as const,
      fontWeight: 600,
      cursor: 'pointer' as const,
      transition: 'all 0.2s' as const,
    }),
    gaugeWrap: {
      position: 'relative' as const,
      width: '100%' as const,
      maxWidth: '320px' as const,
      height: '160px' as const,
      margin: '0 auto 16px' as const,
    },
    gaugeBg: {
      position: 'absolute' as const,
      bottom: 0,
      left: '50%' as const,
      transform: 'translateX(-50%)' as const,
      width: '320px' as const,
      height: '160px' as const,
      borderRadius: '160px 160px 0 0' as const,
      background: 'conic-gradient(from 270deg at 50% 100%, #c0392b 0deg, #e67e22 18deg, #D4A843 36deg, #27ae60 45deg, #27ae60 45deg, #D4A843 54deg, #e67e22 72deg, #c0392b 90deg)' as const,
      maskImage: 'radial-gradient(circle at 50% 100%, transparent 55%, black 56%)',
      WebkitMaskImage: 'radial-gradient(circle at 50% 100%, transparent 55%, black 56%)',
    },
    gaugeCenter: {
      position: 'absolute' as const,
      bottom: '-6px' as const,
      left: '50%' as const,
      transform: 'translateX(-50%)' as const,
      width: '12px' as const,
      height: '12px' as const,
      borderRadius: '50%' as const,
      background: '#D4A843' as const,
      zIndex: 3,
      boxShadow: '0 0 8px #D4A84388' as const,
    },
    needle: {
      position: 'absolute' as const,
      bottom: 0,
      left: '50%' as const,
      width: '3px' as const,
      height: '140px' as const,
      background: inTune ? '#27ae60' : '#f0f0f2',
      transformOrigin: 'bottom center',
      transform: `translateX(-50%) rotate(${needleAngle}deg)`,
      borderRadius: '2px' as const,
      transition: 'transform 0.1s ease-out, background 0.3s' as const,
      zIndex: 2,
      boxShadow: inTune ? '0 0 12px #27ae6088' : 'none',
    },
    gaugeLabels: {
      position: 'absolute' as const,
      bottom: '-22px' as const,
      left: 0,
      right: 0,
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      padding: '0 10px' as const,
      fontSize: '11px' as const,
      color: '#666680' as const,
    },
    noteDisplay: {
      textAlign: 'center' as const,
      marginBottom: '12px' as const,
    },
    noteName: {
      fontSize: '72px' as const,
      fontWeight: 800,
      lineHeight: 1,
      color: inTune ? '#27ae60' : '#f0f0f2',
      transition: 'color 0.3s' as const,
      textShadow: inTune ? '0 0 30px #27ae6066' : 'none',
    },
    noteOctave: {
      fontSize: '24px' as const,
      fontWeight: 600,
      color: '#8888a0' as const,
      marginLeft: '4px' as const,
    },
    freqLine: {
      fontSize: '14px' as const,
      color: '#666680' as const,
      textAlign: 'center' as const,
      marginBottom: '4px' as const,
    },
    centsLine: {
      fontSize: '16px' as const,
      fontWeight: 600,
      textAlign: 'center' as const,
      marginBottom: '16px' as const,
      color: inTune ? '#27ae60' : sharp ? '#e67e22' : '#c0392b',
    },
    stringsRow: {
      display: 'flex' as const,
      justifyContent: 'center' as const,
      gap: '8px' as const,
      marginBottom: '20px' as const,
      flexWrap: 'wrap' as const,
    },
    stringBtn: (idx: number) => {
      const isActive = activeString === idx;
      const isClose = listening && isActive;
      return {
        width: '48px' as const,
        height: '48px' as const,
        borderRadius: '50%' as const,
        border: isClose ? '2px solid #27ae60' : isActive ? '2px solid #D4A843' : '2px solid #2a2a35',
        background: isClose ? '#27ae6022' : isActive ? '#D4A84322' : '#121216',
        color: isClose ? '#27ae60' : isActive ? '#D4A843' : '#8888a0',
        fontSize: '13px' as const,
        fontWeight: 700,
        cursor: 'pointer' as const,
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        transition: 'all 0.2s' as const,
        boxShadow: isClose ? '0 0 12px #27ae6044' : 'none',
      };
    },
    toggleBtn: {
      display: 'block' as const,
      width: '100%' as const,
      padding: '14px' as const,
      borderRadius: '12px' as const,
      border: 'none' as const,
      background: listening ? '#c0392b' : '#D4A843',
      color: listening ? '#fff' : '#08080a',
      fontSize: '16px' as const,
      fontWeight: 700,
      cursor: 'pointer' as const,
      transition: 'all 0.2s' as const,
      letterSpacing: '0.5px' as const,
    },
    error: {
      color: '#c0392b' as const,
      fontSize: '13px' as const,
      textAlign: 'center' as const,
      marginBottom: '12px' as const,
    },
    inTuneBadge: {
      textAlign: 'center' as const,
      fontSize: '13px' as const,
      fontWeight: 600,
      color: '#27ae60' as const,
      marginBottom: '8px' as const,
      height: '20px' as const,
    },
  };

  return (
    <div style={s.container}>
      <div style={s.title}>🎸 Instrument Tuner</div>

      {/* Preset selector */}
      <div style={s.presetRow}>
        {PRESETS.map((p, i) => (
          <button
            key={p.name}
            style={s.presetBtn(i === selectedPreset)}
            onClick={() => { setSelectedPreset(i); setActiveString(null); }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Gauge */}
      <div style={s.gaugeWrap}>
        <div style={s.gaugeBg} />
        <div style={s.needle} />
        <div style={s.gaugeCenter} />
        <div style={s.gaugeLabels}>
          <span>-50</span>
          <span>♭ Flat</span>
          <span>0</span>
          <span>Sharp ♯</span>
          <span>+50</span>
        </div>
      </div>

      {/* Note display */}
      <div style={s.noteDisplay}>
        <span style={s.noteName}>{detectedNote}</span>
        <span style={s.noteOctave}>{detectedOctave > 0 ? detectedOctave : ''}</span>
      </div>

      <div style={s.freqLine}>
        {detectedFreq > 0 ? `${detectedFreq} Hz` : '— Hz'}
      </div>

      <div style={s.centsLine}>
        {detectedFreq > 0
          ? `${cents > 0 ? '+' : ''}${cents} cents ${sharp ? '♯' : '♭'}`
          : 'Play a note'}
      </div>

      <div style={s.inTuneBadge}>
        {inTune && detectedFreq > 0 ? '✓ In Tune' : ''}
      </div>

      {/* String buttons */}
      <div style={s.stringsRow}>
        {preset.strings.map((noteLabel, i) => {
          const { note, octave } = (() => {
            const m = noteLabel.match(/^([A-G]#?)(\d)$/);
            return m ? { note: m[1], octave: m[2] } : { note: '?', octave: '?' };
          })();
          return (
            <button key={i} style={s.stringBtn(i)} title={`String ${i + 1}: ${noteLabel}`}>
              <div>
                <div style={{ fontSize: '14px' as const, lineHeight: 1 }}>{note}</div>
                <div style={{ fontSize: '10px' as const, opacity: 0.6 }}>{octave}</div>
              </div>
            </button>
          );
        })}
      </div>

      {error && <div style={s.error}>{error}</div>}

      {/* Toggle */}
      <button
        style={s.toggleBtn}
        onClick={listening ? stopListening : startListening}
      >
        {listening ? '⏹ Stop Tuner' : '🎤 Start Tuner'}
      </button>
    </div>
  );
}
