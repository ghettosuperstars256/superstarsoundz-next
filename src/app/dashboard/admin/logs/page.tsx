import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), '..', '..', 'data', 'dashboard');
const LOG_FILE = path.join(LOG_DIR, 'scraper.log');

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

function parseLogLine(line: string): LogEntry | null {
  const match = line.match(/^\[([^\]]+)\]\s*\[(\w+)\]\s*(.+)$/);
  if (!match) return null;
  const level = match[2].toLowerCase();
  if (level !== 'info' && level !== 'warn' && level !== 'error') return null;
  return { timestamp: match[1], level, message: match[3].trim() };
}

function readLogEntries(): LogEntry[] {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    return lines.map(parseLogLine).filter((e): e is LogEntry => e !== null).reverse().slice(0, 200);
  } catch {
    return [];
  }
}

// Generate sample log entries if none exist
function generateSampleLogs(): LogEntry[] {
  const now = Date.now();
  const entries: LogEntry[] = [
    { timestamp: new Date(now - 60000).toISOString(), level: 'info', message: 'Scraper initialized — ready to process campaigns' },
    { timestamp: new Date(now - 120000).toISOString(), level: 'info', message: 'Campaign "Studio Headphones" started — 3 keywords queued' },
    { timestamp: new Date(now - 180000).toISOString(), level: 'info', message: 'Amazon scrape: "studio headphones" — 8 products found' },
    { timestamp: new Date(now - 240000).toISOString(), level: 'info', message: 'Amazon scrape: "beyerdynamic dt 990" — 5 products found' },
    { timestamp: new Date(now - 300000).toISOString(), level: 'warn', message: 'Duplicate product skipped: "beyerdynamic DT 990 PRO 250 Ohm"' },
    { timestamp: new Date(now - 360000).toISOString(), level: 'info', message: 'Amazon scrape: "open back headphones" — 12 products found' },
    { timestamp: new Date(now - 420000).toISOString(), level: 'info', message: 'Campaign "Studio Headphones" complete — 18 new products saved, 2 duplicates skipped' },
    { timestamp: new Date(now - 480000).toISOString(), level: 'info', message: 'Affiliate links injected for 18 products (tag: ghettosuper02-20)' },
    { timestamp: new Date(now - 540000).toISOString(), level: 'info', message: 'Campaign "DJ Controllers" started — 2 keywords queued' },
    { timestamp: new Date(now - 600000).toISOString(), level: 'info', message: 'Amazon scrape: "dj controller" — 15 products found' },
    { timestamp: new Date(now - 660000).toISOString(), level: 'warn', message: 'Rate limit hit on Amazon — pausing 30 seconds' },
    { timestamp: new Date(now - 720000).toISOString(), level: 'info', message: 'Amazon scrape: "pioneer dj controller" — 7 products found' },
    { timestamp: new Date(now - 780000).toISOString(), level: 'info', message: 'Campaign "DJ Controllers" complete — 14 new products saved' },
    { timestamp: new Date(now - 840000).toISOString(), level: 'error', message: 'eBay scrape failed: "mixer console" — HTTP 429 (Too Many Requests)' },
    { timestamp: new Date(now - 900000).toISOString(), level: 'info', message: 'Retry scheduled for "mixer console" in 60 seconds' },
    { timestamp: new Date(now - 960000).toISOString(), level: 'info', message: 'Sitemap regenerated — 97 URLs written to /sitemap.xml' },
    { timestamp: new Date(now - 1020000).toISOString(), level: 'info', message: 'Cache purge completed — all pages refreshed' },
    { timestamp: new Date(now - 1080000).toISOString(), level: 'warn', message: 'Product image download failed for "Behringer X32" — using placeholder' },
    { timestamp: new Date(now - 1140000).toISOString(), level: 'info', message: 'Content spinner processed 4 product descriptions' },
    { timestamp: new Date(now - 1200000).toISOString(), level: 'info', message: 'Daily maintenance completed — 0 errors, 2 warnings' },
  ];
  return entries;
}

const levelColor: Record<string, string> = {
  info: '#3b82f6',
  warn: '#f59e0b',
  error: '#ef4444',
};

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const params = await searchParams;
  const levelFilter = params.level || '';

  let allEntries = readLogEntries();
  const hasRealLogs = allEntries.length > 0;

  // If no real logs exist, show sample logs so the page isn't empty
  if (!hasRealLogs) {
    allEntries = generateSampleLogs();
  }

  const filtered = levelFilter ? allEntries.filter(e => e.level === levelFilter) : allEntries;

  const infoCount = allEntries.filter(e => e.level === 'info').length;
  const warnCount = allEntries.filter(e => e.level === 'warn').length;
  const errorCount = allEntries.filter(e => e.level === 'error').length;

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
            Scraper Logs
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {hasRealLogs ? 'Real-time logging from the affiliate scraping engine' : 'Sample log output — run a campaign to generate real logs'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="/dashboard/logs" className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
            Refresh
          </a>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Info', count: infoCount, color: '#3b82f6', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Warnings', count: warnCount, color: '#f59e0b', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
          { label: 'Errors', count: errorCount, color: '#ef4444', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((s, i) => (
          <a key={i} href={`/dashboard/logs?level=${s.label.toLowerCase()}`} style={{
            padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)', cursor: 'pointer', textDecoration: 'none', display: 'block',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '0.75rem',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.5"><path d={s.icon} /></svg>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
          </a>
        ))}
      </div>

      {/* Level Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <a href="/dashboard/logs" className={!levelFilter ? 'btn-primary' : 'btn-ghost'} style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
          All ({allEntries.length})
        </a>
        {(['info', 'warn', 'error'] as const).map(level => (
          <a key={level} href={`/dashboard/logs?level=${level}`}
            className={levelFilter === level ? 'btn-primary' : 'btn-ghost'}
            style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', color: levelFilter === level ? undefined : levelColor[level] }}>
            {level.charAt(0).toUpperCase() + level.slice(1)} ({allEntries.filter(e => e.level === level).length})
          </a>
        ))}
      </div>

      {/* Logs Feed */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
            Log Entries
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              · {filtered.length} entries
            </span>
          </h2>
          {!hasRealLogs && (
            <span style={{ fontSize: '0.6875rem', color: '#f59e0b', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              Sample Data
            </span>
          )}
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>No log entries found. Run a campaign to generate logs.</p>
            </div>
          ) : (
            filtered.map((entry, i) => (
              <div key={i} style={{
                display: 'flex', gap: '0.75rem', padding: '0.75rem 1.5rem',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
                fontSize: '0.8125rem', lineHeight: 1.5,
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}>
                <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0, fontSize: '0.75rem' }}>
                  {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : '—'}
                </span>
                <span style={{
                  display: 'inline-block', minWidth: '56px', textAlign: 'center',
                  padding: '0.125rem 0.5rem', borderRadius: '4px',
                  fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.03em',
                  textTransform: 'uppercase', color: levelColor[entry.level],
                  background: `${levelColor[entry.level]}12`,
                  border: `1px solid ${levelColor[entry.level]}25`,
                  flexShrink: 0, alignSelf: 'flex-start',
                }}>
                  {entry.level}
                </span>
                <span style={{
                  color: entry.level === 'error' ? '#fca5a5' : entry.level === 'warn' ? '#fcd34d' : 'var(--text-secondary)',
                  wordBreak: 'break-word', flex: 1,
                }}>
                  {entry.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
