import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');

function getWordCount(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

export async function GET() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return NextResponse.json([]);
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
    return NextResponse.json(result);
  } catch {
    return NextResponse.json([]);
  }
}
