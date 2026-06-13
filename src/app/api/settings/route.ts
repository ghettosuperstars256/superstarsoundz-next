import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/auth';
import { apiRateLimiter } from '@/lib/rateLimit';
import { auditLog } from '@/lib/audit';
import { corsHeaders } from '@/lib/cors';
import { sanitizeString, sanitizeNumber, sanitizeBoolean } from '@/lib/validate';

const CONFIG_FILE = path.join(process.cwd(), 'src', 'data', 'dashboard-settings.json');

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function loadSettings() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function saveSettings(data: any) {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

// CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

// Whitelist of allowed setting keys
const ALLOWED_KEYS = [
  'amazonAffiliateTag',
  'ebayCampaignId',
  'aliExpressAffTrace',
  'minPrice',
  'maxPrice',
  'minRating',
  'autoPublish',
  'autoAffiliate',
];

export async function GET() {
  // Public read — settings are needed by frontend
  return NextResponse.json(loadSettings());
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = apiRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded', retryAfter: rateCheck.retryAfter }, { status: 429 });
    }

    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    // Only allow whitelisted keys
    const sanitized: Record<string, any> = {};
    for (const key of ALLOWED_KEYS) {
      if (key in body) {
        if (key === 'minPrice' || key === 'maxPrice') {
          sanitized[key] = sanitizeNumber(body[key], 0, 0, 999999);
        } else if (key === 'minRating') {
          sanitized[key] = sanitizeNumber(body[key], 0, 0, 5);
        } else if (key === 'autoPublish' || key === 'autoAffiliate') {
          sanitized[key] = sanitizeBoolean(body[key], false);
        } else {
          sanitized[key] = sanitizeString(body[key], 200);
        }
      }
    }

    const existing = loadSettings();
    const merged = { ...existing, ...sanitized };
    saveSettings(merged);

    auditLog({
      action: 'settings_update',
      userId: admin.id,
      userEmail: admin.email,
      ip: getClientIp(request),
      details: `Updated settings: ${Object.keys(sanitized).join(', ')}`,
      severity: 'info',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
