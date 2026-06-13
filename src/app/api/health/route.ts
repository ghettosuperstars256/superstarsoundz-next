import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: { dataDir: false, products: false, posts: false, pages: false },
  };

  try {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    health.checks.dataDir = fs.existsSync(dataDir);
    health.checks.products = fs.existsSync(path.join(dataDir, 'products.json'));
    health.checks.posts = fs.existsSync(path.join(dataDir, 'posts.json'));
    health.checks.pages = fs.existsSync(path.join(dataDir, 'pages.json'));
  } catch { /* ignore */ }

  const allOk = Object.values(health.checks).every(Boolean);

  return NextResponse.json(health, {
    status: allOk ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
