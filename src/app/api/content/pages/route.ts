import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PAGES_FILE = path.join(process.cwd(), 'src', 'data', 'pages.json');

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
  const pages = readFile(PAGES_FILE);
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pages = readFile(PAGES_FILE);
    const newPage = {
      id: generateId(),
      title: body.title || 'Untitled',
      slug: body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'untitled',
      content: body.content || '',
      status: body.status || 'draft',
      date: new Date().toISOString(),
      metaDescription: body.metaDescription || '',
    };
    pages.push(newPage);
    writeFile(PAGES_FILE, pages);
    return NextResponse.json(newPage, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const pages = readFile(PAGES_FILE);
    const index = pages.findIndex((p: Record<string, string>) => p.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    pages[index] = { ...pages[index], ...body };
    writeFile(PAGES_FILE, pages);
    return NextResponse.json(pages[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const pages = readFile(PAGES_FILE);
    const filtered = pages.filter((p: Record<string, string>) => p.id !== body.id);
    writeFile(PAGES_FILE, filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
