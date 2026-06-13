import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { apiRateLimiter } from '@/lib/rateLimit';
import { corsHeaders } from '@/lib/cors';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');
const PAGES_FILE = path.join(process.cwd(), 'src', 'data', 'pages.json');

function loadJSON(file: string): any[] {
  try {
    if (!fs.existsSync(file)) return [];
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateCheck = apiRateLimiter(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const type = searchParams.get('type') || 'all';
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  // Sanitize query — limit length to prevent abuse
  const safeQuery = q.slice(0, 100);
  const results: Array<{ type: string; id: number | string; title: string; subtitle: string; url: string; dashboardUrl?: string; badge?: string; price?: number; date?: string }> = [];

  if (type === 'all' || type === 'products') {
    const products = loadJSON(PRODUCTS_FILE);
    for (const p of products) {
      const searchable = `${p.short_name || p.name} ${p.description} ${p.categories?.join(' ')} ${p.badge || ''}`.toLowerCase();
      if (searchable.includes(safeQuery)) {
        results.push({
          type: 'product',
          id: p.id,
          title: p.short_name || p.name,
          subtitle: p.categories?.[0] || '',
          url: `/gear/${p.slug}`,
          dashboardUrl: `/dashboard/admin/editor?type=product&id=${p.id}`,
          badge: p.badge,
          price: p.price,
        });
      }
    }
  }

  if (type === 'all' || type === 'posts') {
    const posts = loadJSON(POSTS_FILE);
    for (const p of posts) {
      const searchable = `${p.title} ${p.excerpt} ${p.content} ${p.categories?.join(' ')}`.toLowerCase();
      if (searchable.includes(safeQuery)) {
        results.push({
          type: 'post',
          id: p.id,
          title: p.title,
          subtitle: p.categories?.join(', ') || '',
          url: `/blog/${p.slug}`,
          dashboardUrl: `/dashboard/admin/editor?type=post&id=${p.id}`,
          date: p.date,
        });
      }
    }
  }

  if (type === 'all' || type === 'pages') {
    const pages = loadJSON(PAGES_FILE);
    const pageList = Array.isArray(pages) ? pages : Object.entries(pages).map(([slug, data]: [string, any]) => ({
      id: slug, title: data.title || slug, slug, content: data.content || '',
    }));
    for (const p of pageList) {
      const searchable = `${p.title} ${p.content} ${p.slug}`.toLowerCase();
      if (searchable.includes(safeQuery)) {
        results.push({
          type: 'page',
          id: p.id,
          title: p.title,
          subtitle: `/${p.slug}`,
          url: `/${p.slug}`,
          dashboardUrl: `/dashboard/admin/editor?type=page&id=${p.id}`,
        });
      }
    }
  }

  const total = results.length;
  return NextResponse.json({ results: results.slice(0, limit), total, query: safeQuery });
}
