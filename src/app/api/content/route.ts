import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');

function loadJSON(file: string): any[] {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function saveJSON(file: string, data: any[]) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ===== PRODUCTS =====

export async function GET(request: NextRequest) {
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
    const body = await request.json();
    const { type, data } = body;

    if (type === 'product') {
      const products = loadJSON(PRODUCTS_FILE);
      const newProduct = {
        id: Date.now(),
        name: data.short_name,
        short_name: data.short_name,
        slug: data.slug || generateSlug(data.short_name),
        price: parseFloat(data.price) || 0,
        image: data.image || '',
        categories: data.categories ? data.categories.split(',').map((c: string) => c.trim()) : [],
        short_description: data.short_description || '',
        description: data.description || '',
        external_url: data.external_url || '',
        in_stock: data.in_stock !== undefined ? data.in_stock : true,
        featured: data.featured || false,
        badge: data.badge || null,
      };
      products.push(newProduct);
      saveJSON(PRODUCTS_FILE, products);
      return NextResponse.json({ success: true, product: newProduct });
    }

    if (type === 'post') {
      const posts = loadJSON(POSTS_FILE);
      const newPost = {
        id: Date.now(),
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        content: data.content || '',
        excerpt: data.excerpt || '',
        categories: data.categories ? data.categories.split(',').map((c: string) => c.trim()) : [],
        date: new Date().toISOString().split('T')[0],
      };
      posts.push(newPost);
      saveJSON(POSTS_FILE, posts);
      return NextResponse.json({ success: true, post: newPost });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'product') {
      const products = loadJSON(PRODUCTS_FILE);
      const index = products.findIndex((p: any) => String(p.id) === String(id));
      if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

      products[index] = {
        ...products[index],
        name: data.short_name || products[index].name,
        short_name: data.short_name || products[index].short_name,
        slug: data.slug || products[index].slug,
        price: parseFloat(data.price) || products[index].price,
        image: data.image !== undefined ? data.image : products[index].image,
        categories: data.categories ? data.categories.split(',').map((c: string) => c.trim()) : products[index].categories,
        short_description: data.short_description !== undefined ? data.short_description : products[index].short_description,
        description: data.description !== undefined ? data.description : products[index].description,
        external_url: data.external_url !== undefined ? data.external_url : products[index].external_url,
        in_stock: data.in_stock !== undefined ? data.in_stock : products[index].in_stock,
        featured: data.featured !== undefined ? data.featured : products[index].featured,
        badge: data.badge !== undefined ? data.badge : products[index].badge,
      };
      saveJSON(PRODUCTS_FILE, products);
      return NextResponse.json({ success: true, product: products[index] });
    }

    if (type === 'post') {
      const posts = loadJSON(POSTS_FILE);
      const index = posts.findIndex((p: any) => String(p.id) === String(id));
      if (index === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

      posts[index] = {
        ...posts[index],
        title: data.title || posts[index].title,
        slug: data.slug || posts[index].slug,
        content: data.content !== undefined ? data.content : posts[index].content,
        excerpt: data.excerpt !== undefined ? data.excerpt : posts[index].excerpt,
        categories: data.categories ? data.categories.split(',').map((c: string) => c.trim()) : posts[index].categories,
      };
      saveJSON(POSTS_FILE, posts);
      return NextResponse.json({ success: true, post: posts[index] });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (type === 'product' && id) {
      const products = loadJSON(PRODUCTS_FILE);
      const filtered = products.filter((p: any) => String(p.id) !== String(id));
      saveJSON(PRODUCTS_FILE, filtered);
      return NextResponse.json({ success: true });
    }

    if (type === 'post' && id) {
      const posts = loadJSON(POSTS_FILE);
      const filtered = posts.filter((p: any) => String(p.id) !== String(id));
      saveJSON(POSTS_FILE, filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
