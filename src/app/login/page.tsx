'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        const target = data.user?.role === 'admin' ? '/dashboard/admin' : '/dashboard';
        router.push(redirect !== '/dashboard' ? redirect : target);
        router.refresh();
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#08080a', padding: '1rem',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        background: '#121216', borderRadius: '16px',
        border: '1px solid #1e1e26',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 50%, #C49A38 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', fontWeight: 800, color: '#000',
            margin: '0 auto 1rem',
          }}>SS</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f0f0f2' }}>Sign In</h1>
          <p style={{ color: '#9090a0', fontSize: '0.875rem', marginTop: '0.5rem' }}>Superstar Soundz Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                border: '1px solid #1e1e26', background: '#141418',
                color: '#f0f0f2', fontSize: '0.875rem', outline: 'none',
              }}
            />
          </div>
          <div>
            <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '0.75rem 2.75rem 0.75rem 1rem', borderRadius: '10px',
                  border: '1px solid #1e1e26', background: '#141418',
                  color: '#f0f0f2', fontSize: '0.875rem', outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#5a5a6a', cursor: 'pointer',
                  padding: '0.25rem', fontSize: '1rem', lineHeight: 1,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" aria-live="assertive" style={{
              padding: '0.625rem 0.875rem', borderRadius: '8px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#ef4444', fontSize: '0.8125rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '10px',
              background: loading ? '#5a5a6a' : 'linear-gradient(135deg, #D4A843 0%, #C49A38 100%)',
              color: '#000', fontWeight: 700, fontSize: '0.875rem',
              border: 'none', cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
