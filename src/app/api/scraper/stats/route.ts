import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { apiRateLimiter } from '@/lib/rateLimit';
import { corsHeaders } from '@/lib/cors';
import { getScraperStats } from '@/lib/scraper';
import { log } from '@/lib/db';

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const rateCheck = apiRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const stats = getScraperStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    log(`Scraper stats API error: ${error}`, 'error');
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
