'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        // Redirect admins to admin dashboard, users to user dashboard
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
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #1e1e26', background: '#141418', color: '#f0f0f2', fontSize: '0.9375rem', outline: 'none' }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#9090a0' }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #1e1e26', background: '#141418', color: '#f0f0f2', fontSize: '0.9375rem', outline: 'none' }}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {error && <p style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
}
