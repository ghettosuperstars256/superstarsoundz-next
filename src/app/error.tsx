'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <p style={{ fontSize: '4rem', fontWeight: 800, color: '#D4A843', lineHeight: 1, marginBottom: '1rem' }}>!</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Something Went Wrong</h1>
        <p className="text-secondary" style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
          An unexpected error occurred. We apologize for the inconvenience. Please try again or return to the homepage.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => reset()} className="btn-primary">Try Again</button>
          <Link href="/" className="btn-secondary">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
