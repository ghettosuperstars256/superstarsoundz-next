import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { apiRateLimiter } from '@/lib/rateLimit';
import { corsHeaders } from '@/lib/cors';

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
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const fs = await import('fs');
    const path = await import('path');
    const { paginate, parsePaginationParams } = await import('@/lib/paginate');

    const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');

    function getWordCount(html: string): number {
      return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    }

    if (!fs.existsSync(PRODUCTS_FILE)) return NextResponse.json({ data: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    const result = products.map((p: Record<string, unknown>) => ({
      id: String(p.id),
      title: String(p.short_name || p.name || ''),
      slug: String(p.slug || ''),
      description: String(p.description || ''),
      image: String(p.image || ''),
      hasMeta: !!(p.metaDescription || p.meta_description),
      wordCount: getWordCount(String(p.description || '')),
    }));

    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePaginationParams(searchParams);
    const paginated = paginate(result, page, limit);

    return NextResponse.json({ success: true, ...paginated });
  } catch {
    return NextResponse.json({ success: false, data: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
  }
}
