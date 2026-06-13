// Audit logging for sensitive actions
import fs from 'fs';
import path from 'path';

const AUDIT_LOG_FILE = path.join(process.cwd(), 'src', 'data', 'audit-log.json');

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  userId?: string;
  userEmail?: string;
  ip?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

function loadLog(): AuditEntry[] {
  try {
    if (!fs.existsSync(AUDIT_LOG_FILE)) return [];
    const data = JSON.parse(fs.readFileSync(AUDIT_LOG_FILE, 'utf-8'));
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

function saveLog(entries: AuditEntry[]) {
  try {
    const dir = path.dirname(AUDIT_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    // Keep only last 1000 entries to prevent unbounded growth
    const trimmed = entries.slice(-1000);
    fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(trimmed, null, 2));
  } catch { /* silent fail for audit */ }
}

export function auditLog(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
  const entries = loadLog();
  entries.push({
    ...entry,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
    timestamp: new Date().toISOString(),
  });
  saveLog(entries);
}

export function getAuditLog(limit: number = 100): AuditEntry[] {
  const entries = loadLog();
  return entries.slice(-limit);
}
