export default function LoadingSkeleton() {
  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <div className="skeleton" style={{ height: '28px', width: '120px', marginBottom: '0.75rem' }} />
          <div className="skeleton" style={{ height: '40px', width: '60%', maxWidth: '400px', marginBottom: '1rem' }} />
          <div className="skeleton" style={{ height: '16px', width: '80%', maxWidth: '500px' }} />
        </div>
        <div className="grid-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton" style={{ aspectRatio: '1' }} />
              <div style={{ padding: '1rem' }}>
                <div className="skeleton" style={{ height: '12px', width: '60px', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '16px', width: '40px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
