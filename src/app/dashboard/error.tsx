'use client';

import Link from 'next/link';

export default function UserDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginBottom: '1rem' }}>Error</p>
      <p style={{ color: '#9090a0', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        Something went wrong loading your dashboard. Please try again.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => reset()} className="btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
          Try Again
        </button>
        <Link href="/dashboard" className="btn-secondary" style={{ padding: '0.625rem 1.25rem' }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
