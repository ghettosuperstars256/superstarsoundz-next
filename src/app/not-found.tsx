import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <p style={{ fontSize: '6rem', fontWeight: 800, color: '#D4A843', lineHeight: 1, marginBottom: '1rem' }}>404</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h1>
        <p className="text-secondary" style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
          The page you are looking for does not exist or has been moved. Let us get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/services" className="btn-secondary">Our Services</Link>
        </div>
      </div>
    </div>
  );
}
