'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_TAPS = 8;
const MIN_BPM = 40;
const MAX_BPM = 200;
const AUTOCORR_BUFFER_SIZE = 1024;
const SMOOTHING = 0.8;

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: 480,
    margin: '0 auto' as const,
    padding: '32px 24px' as const,
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
    color: '#f0f0f2' as const,
    background: '#08080a' as const,
    borderRadius: 16,
    minHeight: 420,
    userSelect: 'none' as const,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: 'center' as const,
    marginBottom: 24,
    color: '#D4A843' as const,
    letterSpacing: 1,
  },
  modeSwitch: {
    display: 'flex' as const,
    gap: 0,
    marginBottom: 28,
    borderRadius: 10,
    overflow: 'hidden' as const,
    border: '1px solid #2a2a32' as const,
  },
  modeBtn: (active: boolean) => ({
    flex: 1,
    padding: '10px 0' as const,
    fontSize: 14,
    fontWeight: 600,
    border: 'none' as const,
    cursor: 'pointer' as const,
    transition: 'all 0.2s' as const,
    background: active ? '#D4A843' : '#121216',
    color: active ? '#08080a' : '#8888a0',
    letterSpacing: 0.5,
  }),
  bpmDisplay: {
    textAlign: 'center' as const,
    marginBottom: 28,
    position: 'relative' as const,
  },
  bpmNumber: (pulse: boolean) => ({
    fontSize: 96,
    fontWeight: 800,
    lineHeight: 1,
    color: '#D4A843' as const,
    transition: 'transform 0.08s, text-shadow 0.08s' as const,
    transform: pulse ? 'scale(1.08)' : 'scale(1)',
    textShadow: pulse
      ? '0 0 32px rgba(212,168,67,0.6), 0 0 64px rgba(212,168,67,0.3)'
      : '0 0 0px rgba(212,168,67,0)',
  }),
  bpmLabel: {
    fontSize: 14,
    color: '#666680' as const,
    letterSpacing: 4,
    marginTop: 4,
    textTransform: 'uppercase' as const,
  },
  tapButton: (pulse: boolean) => ({
    display: 'block' as const,
    width: 180,
    height: 180,
    borderRadius: '50%' as const,
    border: '3px solid #D4A843' as const,
    background: pulse
      ? 'radial-gradient(circle, rgba(212,168,67,0.25) 0%, #121216 70%)'
      : 'radial-gradient(circle, #1a1a22 0%, #121216 70%)',
    margin: '0 auto 20px' as const,
    cursor: 'pointer' as const,
    transition: 'all 0.08s' as const,
    transform: pulse ? 'scale(1.04)' : 'scale(1)',
    boxShadow: pulse
      ? '0 0 40px rgba(212,168,67,0.35), inset 0 0 30px rgba(212,168,67,0.1)'
      : '0 0 0px rgba(212,168,67,0)',
    outline: 'none' as const,
  }),
  tapBtnText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#D4A843' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  tapBtnSub: {
    fontSize: 11,
    color: '#666680' as const,
    marginTop: 4,
  },
  resetBtn: {
    display: 'block' as const,
    margin: '0 auto' as const,
    padding: '8px 24px' as const,
    borderRadius: 8,
    border: '1px solid #2a2a32' as const,
    background: '#121216' as const,
    color: '#8888a0' as const,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer' as const,
    letterSpacing: 0.5,
    transition: 'all 0.2s' as const,
  },
  statusBar: {
    textAlign: 'center' as const,
    marginTop: 20,
    fontSize: 12,
    color: '#55556a' as const,
    minHeight: 20,
  },
  meterBar: {
    width: '100%' as const,
    height: 4,
    background: '#1a1a22' as const,
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden' as const,
  },
  meterFill: (pct: number) => ({
    height: '100%' as const,
    width: `${pct}%`,
    background: 'linear-gradient(90deg, #D4A843, #e8c44a)' as const,
    borderRadius: 2,
    transition: 'width 0.15s ease-out' as const,
  }),
  tapDots: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginTop: 16,
  },
  tapDot: (active: boolean) => ({
    width: 10,
    height: 10,
    borderRadius: '50%' as const,
    background: active ? '#D4A843' : '#2a2a32',
    transition: 'all 0.15s' as const,
    boxShadow: active ? '0 0 8px rgba(212,168,67,0.5)' : 'none',
  }),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function clampBpm(bpm: number): number {
  if (!isFinite(bpm) || bpm < MIN_BPM) return 0;
  if (bpm > MAX_BPM) return MAX_BPM;
  return Math.round(bpm);
}

function autocorrelate(buf: Float32Array, sampleRate: number): number {
  const n = buf.length;
  let sumSq = 0;
  for (let i = 0; i < n; i++) sumSq += buf[i] * buf[i];
  if (sumSq < 1e-10) return 0;

  // Downsample 4x for speed
  const step = 4;
  const downsampled = new Float32Array(Math.floor(n / step));
  for (let i = 0; i < downsampled.length; i++) {
    downsampled[i] = buf[i * step];
  }
  const dsLen = downsampled.length;

  // Autocorrelation — search lag range for 40-200 BPM
  const minLag = Math.floor((60 / MAX_BPM) * sampleRate / step);
  const maxLag = Math.ceil((60 / MIN_BPM) * sampleRate / step);
  const clampedMaxLag = Math.min(maxLag, dsLen - 1);

  let bestCorr = -1;
  let bestLag = 0;

  for (let lag = minLag; lag <= clampedMaxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < dsLen - lag; i++) {
      corr += downsampled[i] * downsampled[i + lag];
    }
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  if (bestLag === 0) return 0;
  const bpm = (60 * sampleRate) / (bestLag * step);
  return bpm >= MIN_BPM && bpm <= MAX_BPM ? bpm : 0;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function BpmDetector() {
  const [mode, setMode] = useState<'tap' | 'audio'>('tap');
  const [bpm, setBpm] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [status, setStatus] = useState('Tap the button or press Space');
  const [audioActive, setAudioActive] = useState(false);
  const [meterPct, setMeterPct] = useState(0);

  // Refs
  const tapTimesRef = useRef<number[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const smoothBpmRef = useRef(0);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ─── Pulse animation ──────────────────────────────────────────────────────
  const triggerPulse = useCallback(() => {
    setPulse(true);
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = setTimeout(() => setPulse(false), 100);
  }, []);

  // ─── Tap mode ─────────────────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    const now = performance.now();
    const times = tapTimesRef.current;

    times.push(now);

    // Keep only last MAX_TAPS
    if (times.length > MAX_TAPS) {
      times.shift();
    }

    setTapCount(times.length);

    if (times.length < 2) {
      setStatus('Keep tapping…');
      setBpm(0);
      return;
    }

    // Calculate average interval
    let totalInterval = 0;
    for (let i = 1; i < times.length; i++) {
      totalInterval += times[i] - times[i - 1];
    }
    const avgInterval = totalInterval / (times.length - 1);
    const calculatedBpm = clampBpm(60000 / avgInterval);

    if (calculatedBpm > 0) {
      setBpm(calculatedBpm);
      setStatus(`${times.length} taps recorded`);
      triggerPulse();
    } else {
      setStatus('Tap more steadily…');
    }
  }, [triggerPulse]);

  const handleReset = useCallback(() => {
    tapTimesRef.current = [];
    setTapCount(0);
    setBpm(0);
    setStatus('Tap the button or press Space');
    setMeterPct(0);
  }, []);

  // ─── Audio mode ───────────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setAudioActive(false);
    smoothBpmRef.current = 0;
  }, []);

  const startAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0;
      source.connect(analyser);
      analyserRef.current = analyser;

      setAudioActive(true);
      setStatus('Listening… play or tap a rhythm');

      const buf = new Float32Array(analyser.fftSize);

      const detect = () => {
        analyser.getFloatTimeDomainData(buf);
        const raw = autocorrelate(buf, ctx.sampleRate);

        if (raw > 0) {
          if (smoothBpmRef.current === 0) {
            smoothBpmRef.current = raw;
          } else {
            smoothBpmRef.current = SMOOTHING * smoothBpmRef.current + (1 - SMOOTHING) * raw;
          }
          const display = clampBpm(smoothBpmRef.current);
          setBpm(display);
          setMeterPct(Math.min(100, ((display - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 100));

          // Pulse on significant BPM change
          if (Math.abs(raw - smoothBpmRef.current) < 2) {
            triggerPulse();
          }
        }

        animFrameRef.current = requestAnimationFrame(detect);
      };

      animFrameRef.current = requestAnimationFrame(detect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied';
      setStatus(`⚠ ${msg}`);
      setAudioActive(false);
    }
  }, [triggerPulse]);

  // ─── Mode switching ───────────────────────────────────────────────────────
  useEffect(() => {
    if (mode === 'audio') {
      startAudio();
    } else {
      stopAudio();
      handleReset();
    }
    return () => stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // ─── Keyboard: Space = tap ────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && mode === 'tap') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, handleTap]);

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopAudio();
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, [stopAudio]);

  // ─── Render ───────────────────────────────────────────────────────────────
  const bpmPct = bpm > 0 ? ((bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 100 : 0;

  return (
    <div style={styles.container}>
      <div style={styles.title}>BPM Detector</div>

      {/* Mode switch */}
      <div style={styles.modeSwitch}>
        <button style={styles.modeBtn(mode === 'tap')} onClick={() => setMode('tap')}>
          Tap
        </button>
        <button style={styles.modeBtn(mode === 'audio')} onClick={() => setMode('audio')}>
          AUDIO
        </button>
      </div>

      {/* BPM display */}
      <div style={styles.bpmDisplay}>
        <div style={styles.bpmNumber(pulse)}>
          {bpm > 0 ? bpm : '—'}
        </div>
        <div style={styles.bpmLabel}>BPM</div>

        {/* Meter bar */}
        <div style={styles.meterBar}>
          <div style={styles.meterFill(mode === 'audio' ? meterPct : bpmPct)} />
        </div>
      </div>

      {/* Tap button (both modes) */}
      {mode === 'tap' && (
        <>
          <button
            style={styles.tapButton(pulse)}
            onClick={handleTap}
            onTouchStart={(e) => {
              e.preventDefault();
              handleTap();
            }}
          >
            <div style={styles.tapBtnText}>TAP</div>
            <div style={styles.tapBtnSub}>or press Space</div>
          </button>

          {/* Tap dots */}
          <div style={styles.tapDots}>
            {Array.from({ length: MAX_TAPS }).map((_, i) => (
              <div key={i} style={styles.tapDot(i < tapCount)} />
            ))}
          </div>

          <button style={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>
        </>
      )}

      {mode === 'audio' && (
        <div style={{ textAlign: 'center' as const, marginBottom: 16 }}>
          <button
            style={{
              ...styles.tapButton(pulse),
              width: 120,
              height: 120,
              border: '3px solid #D4A843' as const,
              background: audioActive
                ? 'radial-gradient(circle, rgba(212,168,67,0.15) 0%, #121216 70%)'
                : '#121216',
            }}
            onClick={triggerPulse}
          >
            <div style={{ fontSize: 28 }}>🎤</div>
            <div style={{ ...styles.tapBtnSub, marginTop: 6 }}>
              {audioActive ? 'Listening' : 'Starting…'}
            </div>
          </button>
          <button style={{ ...styles.resetBtn, marginTop: 16 }} onClick={handleReset}>
            Reset
          </button>
        </div>
      )}

      {/* Status */}
      <div style={styles.statusBar}>{status}</div>
    </div>
  );
}
