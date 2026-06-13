'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: '#1a1020',
        border: '1px solid #3a1a2a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        color: '#ef4444',
      }}>
        ⚠
      </div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0f0f2', marginBottom: '0.5rem' }}>
        Something went wrong
      </h2>
      <p style={{ color: '#9090a0', fontSize: '0.875rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
        An error occurred while loading this page. Please try again or contact support if the problem persists.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid #1e1e26',
            background: '#D4A843',
            color: '#000',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
        <a
          href="/dashboard/admin"
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid #1e1e26',
            background: 'transparent',
            color: '#9090a0',
            fontWeight: 600,
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          Back to Command Center
        </a>
      </div>
    </div>
  );
}
