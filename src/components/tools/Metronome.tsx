'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const TIME_SIGNATURES = [
  { label: '4/4', beats: 4 },
  { label: '3/4', beats: 3 },
  { label: '6/8', beats: 6 },
  { label: '2/4', beats: 2 },
] as const;

export default function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [timeSigIndex, setTimeSigIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [beatCount, setBeatCount] = useState(0);
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [pendulumAngle, setPendulumAngle] = useState(0);
  const [flash, setFlash] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);
  const nextNoteTimeRef = useRef(0);
  const beatIndexRef = useRef(-1);
  const volumeRef = useRef(0.7);
  const bpmRef = useRef(120);
  const beatsPerMeasureRef = useRef(4);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs in sync
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { beatsPerMeasureRef.current = TIME_SIGNATURES[timeSigIndex].beats; }, [timeSigIndex]);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const scheduleClick = useCallback((time: number, isAccent: boolean) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.frequency.value = isAccent ? 1000 : 700;
    osc.type = 'sine';

    const vol = volumeRef.current * (isAccent ? 1.0 : 0.6);
    gainNode.gain.setValueAtTime(vol, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.start(time);
    osc.stop(time + 0.08);
  }, []);

  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isPlayingRef.current) return;

    const secondsPerBeat = 60.0 / bpmRef.current;
    const scheduleAhead = 0.1;
    const lookahead = 25; // ms

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAhead) {
      beatIndexRef.current = (beatIndexRef.current + 1) % beatsPerMeasureRef.current;
      const isAccent = beatIndexRef.current === 0;

      scheduleClick(nextNoteTimeRef.current, isAccent);

      // Schedule visual updates via setTimeout synced to audio time
      const delayMs = (nextNoteTimeRef.current - ctx.currentTime) * 1000;
      const beatNum = beatIndexRef.current;

      const t = setTimeout(() => {
        if (!isPlayingRef.current) return;
        setCurrentBeat(beatNum);
        setBeatCount(prev => prev + 1);
        // Pendulum swing: alternate left/right
        setPendulumAngle(beatNum % 2 === 0 ? -30 : 30);
        // Flash on beat 1
        if (beatNum === 0) {
          setFlash(true);
          if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
          flashTimeoutRef.current = setTimeout(() => setFlash(false), 120);
        }
      }, Math.max(0, delayMs));
      // Store timeout so we can clean up
      timerRef.current = t;

      nextNoteTimeRef.current += secondsPerBeat;
    }

    if (isPlayingRef.current) {
      timerRef.current = setTimeout(scheduler, lookahead);
    }
  }, [scheduleClick]);

  const startMetronome = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    isPlayingRef.current = true;
    beatIndexRef.current = -1;
    nextNoteTimeRef.current = ctx.currentTime + 0.05;
    scheduler();
  }, [getAudioContext, scheduler]);

  const stopMetronome = useCallback(() => {
    isPlayingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = null;
    }
    setCurrentBeat(-1);
    setPendulumAngle(0);
    setFlash(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      stopMetronome();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startMetronome();
    }
  }, [startMetronome, stopMetronome]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Keyboard shortcut: Space to toggle play
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  // Tap tempo
  const handleTap = useCallback(() => {
    const now = Date.now();
    setTapTimestamps(prev => {
      const filtered = prev.filter(t => now - t < 2000);
      const updated = [...filtered, now];

      if (updated.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < updated.length; i++) {
          intervals.push(updated[i] - updated[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const tapBpm = Math.round(60000 / avgInterval);
        const clamped = Math.max(40, Math.min(200, tapBpm));
        setBpm(clamped);
      }

      return updated;
    });
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    stopMetronome();
    setIsPlaying(false);
    setBeatCount(0);
    setTapTimestamps([]);
  }, [stopMetronome]);

  const beatsPerMeasure = TIME_SIGNATURES[timeSigIndex].beats;

  return (
    <div style={{
      background: '#08080a' as const,
      minHeight: '100vh' as const,
      color: '#f0f0f2' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, " as constSegoe UI", Roboto, sans-serif',
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' as const, padding: '2rem 1.5rem' as const }}>
        {/* Header */}
        <div style={{ textAlign: 'center' as const, marginBottom: '2.5rem' as const }}>
          <h1 style={{
            fontSize: '1.8rem' as const,
            fontWeight: 700,
            color: '#D4A843' as const,
            marginBottom: '0.25rem' as const,
            letterSpacing: '-0.02em' as const,
          }}>
            Metronome
          </h1>
          <p style={{ fontSize: '0.85rem' as const, color: '#666' as const, margin: 0 }}>
            {TIME_SIGNATURES[timeSigIndex].beats}/{TIME_SIGNATURES[timeSigIndex].label.split('/')[1]} · {bpm} BPM
          </p>
        </div>

        {/* Beat Indicator - Circular */}
        <div style={{
          display: 'flex' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          flexWrap: 'wrap' as const,
          gap: '0.75rem' as const,
          marginBottom: '2rem' as const,
          minHeight: 60,
        }}>
          {Array.from({ length: beatsPerMeasure }, (_, i) => {
            const isActive = currentBeat === i && isPlaying;
            const isDownbeat = i === 0;
            return (
              <div
                key={i}
                style={{
                  width: isDownbeat ? 48 : 40,
                  height: isDownbeat ? 48 : 40,
                  borderRadius: '50%' as const,
                  background: isActive
                    ? (isDownbeat ? '#D4A843' : '#6B8F5E')
                    : (isDownbeat ? '#1a1a20' : '#121216'),
                  border: isActive
                    ? 'none'
                    : `2px solid ${isDownbeat ? '#D4A843' : '#333'}`,
                  transition: 'all 0.08s ease-out' as const,
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: isActive
                    ? `0 0 20px ${isDownbeat ? 'rgba(212,168,67,0.5)' : 'rgba(107,143,94,0.3)'}`
                    : 'none',
                  display: 'flex' as const,
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  fontSize: '0.7rem' as const,
                  fontWeight: 600,
                  color: isActive ? '#08080a' : '#555',
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* Pendulum */}
        <div style={{
          display: 'flex' as const,
          justifyContent: 'center' as const,
          marginBottom: '1.5rem' as const,
          height: 120,
          alignItems: 'flex-start' as const,
        }}>
          <div style={{
            width: 4,
            height: 100,
            background: '#D4A843' as const,
            borderRadius: 2,
            transformOrigin: 'top center',
            transform: `rotate(${pendulumAngle}deg)`,
            transition: `transform ${60 / bpm / 4}s ease-in-out`,
            position: 'relative' as const,
          }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%' as const,
              background: '#D4A843' as const,
              position: 'absolute' as const,
              bottom: -10,
              left: -8,
              boxShadow: '0 0 12px rgba(212,168,67,0.4)' as const,
            }} />
          </div>
        </div>

        {/* Flash overlay effect on beat 1 */}
        {flash && (
          <div style={{
            position: 'fixed' as const,
            inset: 0,
            background: 'radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)' as const,
            pointerEvents: 'none' as const,
            zIndex: 10,
          }} />
        )}

        {/* BPM Display */}
        <div style={{
          textAlign: 'center' as const,
          marginBottom: '1.5rem' as const,
        }}>
          <div style={{
            fontSize: '4rem' as const,
            fontWeight: 800,
            color: '#f0f0f2' as const,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.03em' as const,
          }}>
            {bpm}
          </div>
          <div style={{ fontSize: '0.8rem' as const, color: '#666' as const, marginTop: '0.25rem' as const }}>BPM</div>
        </div>

        {/* Beat Counter */}
        <div style={{ textAlign: 'center' as const, marginBottom: '2rem' as const }}>
          <span style={{
            fontSize: '0.85rem' as const,
            color: '#666' as const,
          }}>
            Beat #{beatCount}
          </span>
        </div>

        {/* Controls Container */}
        <div style={{
          background: '#121216' as const,
          borderRadius: 16,
          padding: '1.5rem' as const,
          marginBottom: '1rem' as const,
          border: '1px solid #1a1a20' as const,
        }}>
          {/* BPM Slider */}
          <div style={{ marginBottom: '1.75rem' as const }}>
            <label style={{
              display: 'flex' as const,
              justifyContent: 'space-between' as const,
              marginBottom: '0.5rem' as const,
              fontSize: '0.8rem' as const,
              color: '#999' as const,
              fontWeight: 500,
            }}>
              <span>Tempo</span>
              <span style={{ color: '#D4A843' as const, fontWeight: 600 }}>40 – 200</span>
            </label>
            <input
              type="range"
              min={40}
              max={200}
              value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              style={{
                width: '100%' as const,
                height: 6,
                WebkitAppearance: 'none',
                appearance: 'none' as const,
                background: `linear-gradient(to right, #D4A843 ${((bpm - 40) / 160) * 100}%, #2a2a30 ${((bpm - 40) / 160) * 100}%)`,
                borderRadius: 3,
                outline: 'none' as const,
                cursor: 'pointer' as const,
              }}
              className="bpm-slider"
            />
          </div>

          {/* Time Signature */}
          <div style={{ marginBottom: '1.75rem' as const }}>
            <label style={{
              display: 'block' as const,
              marginBottom: '0.6rem' as const,
              fontSize: '0.8rem' as const,
              color: '#999' as const,
              fontWeight: 500,
            }}>
              Time Signature
            </label>
            <div style={{ display: 'flex' as const, gap: '0.5rem' as const }}>
              {TIME_SIGNATURES.map((ts, i) => (
                <button
                  key={ts.label}
                  onClick={() => setTimeSigIndex(i)}
                  style={{
                    flex: 1,
                    padding: '0.6rem' as const,
                    borderRadius: 10,
                    border: `2px solid ${i === timeSigIndex ? '#D4A843' : '#2a2a30'}`,
                    background: i === timeSigIndex ? 'rgba(212,168,67,0.1)' : 'transparent',
                    color: i === timeSigIndex ? '#D4A843' : '#888',
                    fontSize: '0.9rem' as const,
                    fontWeight: 600,
                    cursor: 'pointer' as const,
                    transition: 'all 0.15s' as const,
                  }}
                >
                  {ts.label}
                </button>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div style={{ marginBottom: '1.75rem' as const }}>
            <label style={{
              display: 'flex' as const,
              justifyContent: 'space-between' as const,
              marginBottom: '0.5rem' as const,
              fontSize: '0.8rem' as const,
              color: '#999' as const,
              fontWeight: 500,
            }}>
              <span>Volume</span>
              <span style={{ color: '#D4A843' as const, fontWeight: 600 }}>{Math.round(volume * 100)}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={e => setVolume(Number(e.target.value) / 100)}
              style={{
                width: '100%' as const,
                height: 6,
                WebkitAppearance: 'none',
                appearance: 'none' as const,
                background: `linear-gradient(to right, #D4A843 ${volume * 100}%, #2a2a30 ${volume * 100}%)`,
                borderRadius: 3,
                outline: 'none' as const,
                cursor: 'pointer' as const,
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex' as const, gap: '0.75rem' as const }}>
            <button
              onClick={togglePlay}
              style={{
                flex: 2,
                padding: '0.85rem' as const,
                borderRadius: 12,
                border: 'none' as const,
                background: isPlaying ? '#D4A843' : '#D4A843',
                color: '#08080a' as const,
                fontSize: '1rem' as const,
                fontWeight: 700,
                cursor: 'pointer' as const,
                transition: 'all 0.15s' as const,
                letterSpacing: '0.02em' as const,
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              {isPlaying ? '■ STOP' : '▶ START'}
            </button>
            <button
              onClick={handleTap}
              style={{
                flex: 1,
                padding: '0.85rem' as const,
                borderRadius: 12,
                border: '2px solid #D4A843' as const,
                background: 'transparent' as const,
                color: '#D4A843' as const,
                fontSize: '0.85rem' as const,
                fontWeight: 700,
                cursor: 'pointer' as const,
                transition: 'all 0.15s' as const,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(212,168,67,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              TAP
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '0.85rem 1.2rem' as const,
                borderRadius: 12,
                border: '2px solid #333' as const,
                background: 'transparent' as const,
                color: '#888' as const,
                fontSize: '0.85rem' as const,
                fontWeight: 600,
                cursor: 'pointer' as const,
                transition: 'all 0.15s' as const,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#555';
                e.currentTarget.style.color = '#f0f0f2';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.color = '#888';
              }}
            >
              ↺
            </button>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <p style={{
          textAlign: 'center' as const,
          fontSize: '0.75rem' as const,
          color: '#444' as const,
          marginTop: '1.5rem' as const,
        }}>
          Press Space to start/stop
        </p>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #D4A843;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(212,168,67,0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #D4A843;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(212,168,67,0.3);
        }
      `}</style>
    </div>
  );
}
