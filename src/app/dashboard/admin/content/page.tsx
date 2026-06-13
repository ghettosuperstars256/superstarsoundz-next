import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Suspense } from 'react';
import { ContentManagerClient } from './ContentManagerClient';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');
const PAGES_FILE = path.join(process.cwd(), 'src', 'data', 'pages.json');

interface Product {
  id: number; name: string; short_name: string; slug: string; price: number;
  image: string; categories: string[]; short_description: string; description: string;
  external_url: string; in_stock: boolean; featured: boolean; badge: string;
}

interface Post {
  id: number; title: string; slug: string; content: string; excerpt: string;
  categories: string[]; date: string; image?: string; author?: string;
  status?: string; meta_description?: string; tags?: string[];
}

function loadJSON(file: string): any[] {
  try {
    if (!fs.existsSync(file)) return [];
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; search?: string }>;
}) {
  const params = await searchParams;
  const activeTab = params.tab || 'posts';
  const search = params.search || '';

  const allProducts: Product[] = loadJSON(PRODUCTS_FILE);
  const allPosts: Post[] = loadJSON(POSTS_FILE);
  const pagesData = loadJSON(PAGES_FILE);
  const allPages = Array.isArray(pagesData) ? pagesData : Object.entries(pagesData).map(([slug, data]: [string, any]) => ({
    id: slug, title: data.title || slug, slug, content: data.content || '',
    status: 'published', date: '', metaDescription: '',
  }));

  // Server-side filtering
  const filteredPosts = search
    ? allPosts.filter(p => {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) ||
          (p.categories || []).some((c: string) => c.toLowerCase().includes(q)) ||
          (p.excerpt || '').toLowerCase().includes(q);
      })
    : allPosts;

  const filteredPages = search
    ? allPages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()))
    : allPages;

  const productIssues = allProducts.filter(p => {
    const wc = p.description.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return wc < 100 || !p.image;
  });

  return (
    <Suspense fallback={<div style={{ padding: '2rem', color: '#5a5a6a' }}>Loading...</div>}>
      <ContentManagerClient
        activeTab={activeTab}
        search={search}
        allProducts={allProducts}
        allPosts={filteredPosts}
        allPages={filteredPages}
        productIssues={productIssues}
      />
    </Suspense>
  );
}
