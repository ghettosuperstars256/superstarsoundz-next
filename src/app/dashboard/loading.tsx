export default function DashboardLoading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid #1e1e26',
          borderTopColor: '#D4A843', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
        }} />
        <div style={{ color: '#5a5a6a', fontSize: '0.875rem' }}>Loading dashboard...</div>
      </div>
    </div>
  );
}
