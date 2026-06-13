import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin, authError } from '@/lib/auth';
import { contentRateLimiter } from '@/lib/rateLimit';
import { auditLog } from '@/lib/audit';
import { corsHeaders } from '@/lib/cors';
import {
  sanitizeString, sanitizeSlug, sanitizeNumber, sanitizeBoolean,
  sanitizeCategories, requireFields
} from '@/lib/validate';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function loadJSON(file: string): any[] {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch { return []; }
}

function saveJSON(file: string, data: any[]) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateSlug(text: string): string {
  return sanitizeSlug(text);
}

// CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

// ===== PRODUCTS =====

export async function GET(request: NextRequest) {
  try { await requireAdmin(); } catch (error) { return authError(error); }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (type === 'product' && id) {
    const products = loadJSON(PRODUCTS_FILE);
    const product = products.find((p: any) => String(p.id) === id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  }

  if (type === 'post' && id) {
    const posts = loadJSON(POSTS_FILE);
    const post = posts.find((p: any) => String(p.id) === id);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = contentRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } });
    }

    const body = await request.json();
    const { type, data } = body;
    if (!data || typeof data !== 'object') return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    if (type === 'product') {
      const error = requireFields(data, ['short_name']);
      if (error) return NextResponse.json({ error }, { status: 400 });

      const products = loadJSON(PRODUCTS_FILE);
      const newProduct = {
        id: Date.now(),
        name: sanitizeString(data.short_name, 200),
        short_name: sanitizeString(data.short_name, 200),
        slug: sanitizeSlug(data.slug || data.short_name),
        price: sanitizeNumber(data.price, 0, 0, 999999),
        image: sanitizeString(data.image, 500),
        categories: sanitizeCategories(data.categories),
        short_description: sanitizeString(data.short_description, 500),
        description: sanitizeString(data.description, 50000),
        external_url: sanitizeString(data.external_url, 500),
        in_stock: sanitizeBoolean(data.in_stock, true),
        featured: sanitizeBoolean(data.featured, false),
        badge: sanitizeString(data.badge, 50) || null,
      };
      products.push(newProduct);
      saveJSON(PRODUCTS_FILE, products);
      auditLog({ action: 'product_create', userId: admin.id, userEmail: admin.email, ip: getClientIp(request), details: `Created product: ${newProduct.short_name}`, severity: 'info' });
      return NextResponse.json({ success: true, product: newProduct });
    }

    if (type === 'post') {
      const error = requireFields(data, ['title']);
      if (error) return NextResponse.json({ error }, { status: 400 });

      const posts = loadJSON(POSTS_FILE);
      const newPost = {
        id: Date.now(),
        title: sanitizeString(data.title, 300),
        slug: sanitizeSlug(data.slug || data.title),
        content: sanitizeString(data.content, 100000),
        excerpt: sanitizeString(data.excerpt, 500),
        categories: sanitizeCategories(data.categories),
        date: new Date().toISOString().split('T')[0],
      };
      posts.push(newPost);
      saveJSON(POSTS_FILE, posts);
      auditLog({ action: 'post_create', userId: admin.id, userEmail: admin.email, ip: getClientIp(request), details: `Created post: ${newPost.title}`, severity: 'info' });
      return NextResponse.json({ success: true, post: newPost });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) { return authError(error); }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = contentRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } });
    }

    const body = await request.json();
    const { type, id, data } = body;
    if (!id || !data || typeof data !== 'object') return NextResponse.json({ error: 'Missing id or data' }, { status: 400 });

    if (type === 'product') {
      const products = loadJSON(PRODUCTS_FILE);
      const index = products.findIndex((p: any) => String(p.id) === String(id));
      if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      products[index] = {
        ...products[index],
        name: data.short_name ? sanitizeString(data.short_name, 200) : products[index].name,
        short_name: data.short_name ? sanitizeString(data.short_name, 200) : products[index].short_name,
        slug: data.slug ? sanitizeSlug(data.slug) : products[index].slug,
        price: data.price !== undefined ? sanitizeNumber(data.price, products[index].price, 0, 999999) : products[index].price,
        image: data.image !== undefined ? sanitizeString(data.image, 500) : products[index].image,
        categories: data.categories ? sanitizeCategories(data.categories) : products[index].categories,
        short_description: data.short_description !== undefined ? sanitizeString(data.short_description, 500) : products[index].short_description,
        description: data.description !== undefined ? sanitizeString(data.description, 50000) : products[index].description,
        external_url: data.external_url !== undefined ? sanitizeString(data.external_url, 500) : products[index].external_url,
        in_stock: data.in_stock !== undefined ? sanitizeBoolean(data.in_stock) : products[index].in_stock,
        featured: data.featured !== undefined ? sanitizeBoolean(data.featured) : products[index].featured,
        badge: data.badge !== undefined ? (sanitizeString(data.badge, 50) || null) : products[index].badge,
      };
      saveJSON(PRODUCTS_FILE, products);
      auditLog({ action: 'product_update', userId: admin.id, userEmail: admin.email, ip: getClientIp(request), details: `Updated product: ${products[index].short_name} (id: ${id})`, severity: 'info' });
      return NextResponse.json({ success: true, product: products[index] });
    }

    if (type === 'post') {
      const posts = loadJSON(POSTS_FILE);
      const index = posts.findIndex((p: any) => String(p.id) === String(id));
      if (index === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      posts[index] = {
        ...posts[index],
        title: data.title ? sanitizeString(data.title, 300) : posts[index].title,
        slug: data.slug ? sanitizeSlug(data.slug) : posts[index].slug,
        content: data.content !== undefined ? sanitizeString(data.content, 100000) : posts[index].content,
        excerpt: data.excerpt !== undefined ? sanitizeString(data.excerpt, 500) : posts[index].excerpt,
        categories: data.categories ? sanitizeCategories(data.categories) : posts[index].categories,
      };
      saveJSON(POSTS_FILE, posts);
      auditLog({ action: 'post_update', userId: admin.id, userEmail: admin.email, ip: getClientIp(request), details: `Updated post: ${posts[index].title} (id: ${id})`, severity: 'info' });
      return NextResponse.json({ success: true, post: posts[index] });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) { return authError(error); }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = contentRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } });
    }

    const body = await request.json().catch(() => ({}));
    const type = body.type || request.nextUrl.searchParams.get('type');
    const id = body.id || request.nextUrl.searchParams.get('id');
    if (!type || !id) return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });

    if (type === 'product') {
      const products = loadJSON(PRODUCTS_FILE);
      const index = products.findIndex((p: any) => String(p.id) === String(id));
      if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      const deleted = products.splice(index, 1)[0];
      saveJSON(PRODUCTS_FILE, products);
      auditLog({ action: 'product_delete', userId: admin.id, userEmail: admin.email, ip: getClientIp(request), details: `Deleted product: ${deleted.short_name || deleted.name} (id: ${id})`, severity: 'warning' });
      return NextResponse.json({ success: true });
    }

    if (type === 'post') {
      const posts = loadJSON(POSTS_FILE);
      const index = posts.findIndex((p: any) => String(p.id) === String(id));
      if (index === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      const deleted = posts.splice(index, 1)[0];
      saveJSON(POSTS_FILE, posts);
      auditLog({ action: 'post_delete', userId: admin.id, userEmail: admin.email, ip: getClientIp(request), details: `Deleted post: ${deleted.title} (id: ${id})`, severity: 'warning' });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) { return authError(error); }
}
