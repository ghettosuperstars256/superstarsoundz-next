import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { apiRateLimiter } from '@/lib/rateLimit';
import { corsHeaders } from '@/lib/cors';
import postsData from '@/data/posts.json';
import productsData from '@/data/products.json';
import pagesData from '@/data/pages.json';

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

interface MetaEntry {
  url: string;
  type: string;
  title: string;
  metaDescription: string;
  status: 'OK' | 'Warning' | 'Missing';
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
    const posts = Array.isArray(postsData) ? postsData : [];
    const products = Array.isArray(productsData) ? productsData : [];
    const pages = pagesData;

    // Build meta entries from pages
    const pageEntries: MetaEntry[] = [];
    if (pages && typeof pages === 'object') {
      for (const page of Object.values(pages as unknown as Record<string, { title?: string; slug?: string; content?: string }>)) {
        const hasDescription = (page.content?.length || 0) > 200;
        const titleLen = page.title?.length || 0;
        const hasGoodTitle = titleLen >= 10 && titleLen <= 60;
        let status: 'OK' | 'Warning' | 'Missing' = 'OK';
        if (!hasDescription) status = 'Missing';
        else if (!hasGoodTitle) status = 'Warning';
        pageEntries.push({
          url: `/${page.slug || ''}`,
          type: 'page',
          title: page.title || '',
          metaDescription: hasDescription ? (page.content || '').replace(/<[^>]+>/g, '').slice(0, 160) : '',
          status,
        });
      }
    }

    // Build meta entries from posts
    const postEntries: MetaEntry[] = (posts as Array<{ title?: string; slug?: string; excerpt?: string; content?: string; date?: string; categories?: string[] }>).map(post => {
      const hasExcerpt = (post.excerpt?.length || 0) > 30;
      const titleLen = post.title?.length || 0;
      const hasGoodTitle = titleLen >= 20 && titleLen <= 65;
      let status: 'OK' | 'Warning' | 'Missing' = 'OK';
      if (!hasExcerpt) status = 'Missing';
      else if (!hasGoodTitle) status = 'Warning';
      return {
        url: `/blog/${post.slug || ''}`,
        type: 'post',
        title: post.title || '',
        metaDescription: hasExcerpt ? (post.excerpt || '').slice(0, 160) : '',
        status,
      };
    });

    // Build meta entries from products
    const productEntries: MetaEntry[] = (products as Array<{ short_name?: string; slug?: string; short_description?: string; description?: string; price?: number; image?: string; categories?: string[]; external_url?: string; in_stock?: boolean; featured?: boolean; badge?: string }>).map(product => {
      const hasDesc = (product.short_description?.length || 0) > 20;
      const titleLen = product.short_name?.length || 0;
      const hasGoodTitle = titleLen >= 10 && titleLen <= 60;
      let status: 'OK' | 'Warning' | 'Missing' = 'OK';
      if (!hasDesc) status = 'Missing';
      else if (!hasGoodTitle) status = 'Warning';
      return {
        url: `/product/${product.slug || ''}`,
        type: 'product',
        title: product.short_name || '',
        metaDescription: hasDesc ? (product.short_description || '').slice(0, 160) : '',
        status,
      };
    });

    const allMetaEntries = [...pageEntries, ...postEntries, ...productEntries];

    // Compute health breakdown
    const total = allMetaEntries.length;
    const withMeta = allMetaEntries.filter(e => e.metaDescription.length > 0).length;
    const withGoodTitle = allMetaEntries.filter(e => {
      const titleLen = e.title.length;
      return titleLen >= 10 && titleLen <= 65;
    }).length;

    const healthScore = total > 0
      ? Math.round(((withMeta / total) * 50) + ((withGoodTitle / total) * 50))
      : 100;

    return NextResponse.json({
      success: true,
      healthScore,
      total,
      withMeta,
      withGoodTitle,
      entries: allMetaEntries,
      breakdown: {
        pages: { total: pageEntries.length, ok: pageEntries.filter(e => e.status === 'OK').length, warning: pageEntries.filter(e => e.status === 'Warning').length, missing: pageEntries.filter(e => e.status === 'Missing').length },
        posts: { total: postEntries.length, ok: postEntries.filter(e => e.status === 'OK').length, warning: postEntries.filter(e => e.status === 'Warning').length, missing: postEntries.filter(e => e.status === 'Missing').length },
        products: { total: productEntries.length, ok: productEntries.filter(e => e.status === 'OK').length, warning: productEntries.filter(e => e.status === 'Warning').length, missing: productEntries.filter(e => e.status === 'Missing').length },
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
