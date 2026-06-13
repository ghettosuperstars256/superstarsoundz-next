import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/auth';
import { contentRateLimiter } from '@/lib/rateLimit';
import { auditLog } from '@/lib/audit';
import { corsHeaders } from '@/lib/cors';
import {
  sanitizeString, sanitizeSlug, requireFields
} from '@/lib/validate';

const PAGES_FILE = path.join(process.cwd(), 'src', 'data', 'pages.json');

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

// CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

function readFile(file: string) {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function writeFile(file: string, data: unknown) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export async function GET() {
  // Public — pages are readable by anyone
  const pages = readFile(PAGES_FILE);
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = contentRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded', retryAfter: rateCheck.retryAfter }, { status: 429 });
    }

    const body = await request.json();
    const error = requireFields(body, ['title']);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const pages = readFile(PAGES_FILE);
    const newPage = {
      id: generateId(),
      title: sanitizeString(body.title, 200),
      slug: sanitizeSlug(body.slug || body.title),
      content: sanitizeString(body.content, 100000),
      status: body.status === 'published' ? 'published' : 'draft',
      date: new Date().toISOString(),
      metaDescription: sanitizeString(body.metaDescription, 300),
    };
    pages.push(newPage);
    writeFile(PAGES_FILE, pages);

    auditLog({
      action: 'page_create',
      userId: admin.id,
      userEmail: admin.email,
      ip: getClientIp(request),
      details: `Created page: ${newPage.title}`,
      severity: 'info',
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = contentRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded', retryAfter: rateCheck.retryAfter }, { status: 429 });
    }

    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const pages = readFile(PAGES_FILE);
    const index = pages.findIndex((p: Record<string, string>) => p.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    pages[index] = {
      ...pages[index],
      title: body.title ? sanitizeString(body.title, 200) : pages[index].title,
      slug: body.slug ? sanitizeSlug(body.slug) : pages[index].slug,
      content: body.content !== undefined ? sanitizeString(body.content, 100000) : pages[index].content,
      status: body.status === 'published' ? 'published' : (body.status || pages[index].status),
      metaDescription: body.metaDescription !== undefined ? sanitizeString(body.metaDescription, 300) : pages[index].metaDescription,
    };
    writeFile(PAGES_FILE, pages);

    auditLog({
      action: 'page_update',
      userId: admin.id,
      userEmail: admin.email,
      ip: getClientIp(request),
      details: `Updated page: ${pages[index].title} (id: ${body.id})`,
      severity: 'info',
    });

    return NextResponse.json(pages[index]);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = contentRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded', retryAfter: rateCheck.retryAfter }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const id = body.id || request.nextUrl.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const pages = readFile(PAGES_FILE);
    const index = pages.findIndex((p: Record<string, string>) => p.id === id);
    if (index === -1) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const deleted = pages.splice(index, 1)[0];
    writeFile(PAGES_FILE, pages);

    auditLog({
      action: 'page_delete',
      userId: admin.id,
      userEmail: admin.email,
      ip: getClientIp(request),
      details: `Deleted page: ${deleted.title} (id: ${id})`,
      severity: 'warning',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
