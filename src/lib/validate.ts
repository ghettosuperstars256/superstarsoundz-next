// Input validation and sanitization utilities

// Strip HTML tags (for plain-text fields)
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

// Sanitize slug — only allow lowercase, numbers, hyphens
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// Sanitize string field — trim, limit length
export function sanitizeString(input: unknown, maxLen: number = 5000): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLen);
}

// Sanitize number field
export function sanitizeNumber(input: unknown, fallback: number = 0, min: number = 0, max: number = 999999): number {
  const n = typeof input === 'number' ? input : parseFloat(String(input));
  if (isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

// Sanitize boolean
export function sanitizeBoolean(input: unknown, fallback: boolean = false): boolean {
  if (typeof input === 'boolean') return input;
  if (typeof input === 'string') return input === 'true' || input === '1';
  return fallback;
}

// Validate required fields
export function requireFields(body: Record<string, unknown>, fields: string[]): string | null {
  for (const field of fields) {
    const val = body[field];
    if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

// Sanitize categories string → array
export function sanitizeCategories(input: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(sanitizeString).filter(Boolean).slice(0, 10);
  if (typeof input === 'string') {
    return input.split(',').map(s => sanitizeString(s)).filter(Boolean).slice(0, 10);
  }
  return [];
}
