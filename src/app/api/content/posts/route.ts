import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');
const PAGES_FILE = path.join(process.cwd(), 'src', 'data', 'pages.json');
const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');

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
  const posts = readFile(POSTS_FILE);
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const posts = readFile(POSTS_FILE);
    const newPost = {
      id: generateId(),
      title: body.title || 'Untitled',
      slug: body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'untitled',
      content: body.content || '',
      excerpt: body.excerpt || '',
      categories: body.categories || (body.category ? [body.category] : []),
      status: body.status || 'draft',
      date: new Date().toISOString(),
      featuredImage: body.featuredImage || '',
      metaDescription: body.metaDescription || '',
    };
    posts.push(newPost);
    writeFile(POSTS_FILE, posts);
    return NextResponse.json(newPost, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const posts = readFile(POSTS_FILE);
    const index = posts.findIndex((p: Record<string, string>) => p.id === body.id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    posts[index] = { ...posts[index], ...body };
    writeFile(POSTS_FILE, posts);
    return NextResponse.json(posts[index]);
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const posts = readFile(POSTS_FILE);
    const filtered = posts.filter((p: Record<string, string>) => p.id !== body.id);
    writeFile(POSTS_FILE, filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
