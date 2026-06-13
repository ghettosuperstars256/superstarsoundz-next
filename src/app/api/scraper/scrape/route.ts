import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authError } from '@/lib/auth';
import { apiRateLimiter } from '@/lib/rateLimit';
import { corsHeaders } from '@/lib/cors';
import { auditLog } from '@/lib/audit';
import {
  scrapeAmazon, scrapeEbay, scrapeAliExpress, scrapeWithRSS,
  saveScrapedProducts, runCampaign, getScraperStats,
} from '@/lib/scraper';
import { mapProductCategory } from '@/lib/categoryMapper';
import { generateProductDescription, applySynonyms } from '@/lib/contentSpinner';
import { ScrapedProduct } from '@/lib/types';
import { log, generateId, writeItem, readItem } from '@/lib/db';

const AMAZON_AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'ghettosuper02-20';

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = apiRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const {
      action, campaignId, source, keywords, maxResults = 20,
      category = '', spinContent = false, bulkItems = [],
    } = body;

    // Input validation
    if (maxResults < 1 || maxResults > 100) {
      return NextResponse.json({ error: 'maxResults must be between 1 and 100' }, { status: 400 });
    }

    // ACTION: run campaign
    if (action === 'run' && campaignId) {
      log(`API: Running campaign ${campaignId}`);
      const products = await runCampaign(campaignId);
      return NextResponse.json({
        success: true,
        products,
        stats: {
          totalFound: products.length,
          newSaved: products.length,
          duplicates: 0,
          avgPrice: products.length > 0 ? products.reduce((s, p) => s + p.price, 0) / products.length : 0,
        },
        message: products.length === 0 ? 'Campaign ran but returned 0 results.' : undefined,
      });
    }

    // ACTION: get stats
    if (action === 'stats') {
      const stats = getScraperStats();
      return NextResponse.json({ success: true, stats });
    }

    // STANDARD SCRAPE MODE
    let products: ScrapedProduct[] = [];

    // BULK IMPORT MODE
    if (bulkItems && bulkItems.length > 0) {
      log(`Bulk import: ${bulkItems.length} items`);

      for (const item of bulkItems) {
        try {
          let product: ScrapedProduct | null = null;

          if (item.type === 'asin') {
            product = await scrapeAmazonByASIN(item.value, AMAZON_AFFILIATE_TAG);
          } else if (item.type === 'url') {
            product = await scrapeProductFromUrl(item.value, AMAZON_AFFILIATE_TAG);
          } else if (item.type === 'keyword') {
            const results = await scrapeAmazon(item.value, 5);
            products.push(...results);
            continue;
          }

          if (product) {
            const mapping = mapProductCategory(product.title, product.description, category);
            if (mapping.confidence > 0) product.category = mapping.categoryName;
            if (spinContent) {
              product.description = generateProductDescription({
                title: product.title, category: product.category, price: product.price,
                rating: product.rating || 0, reviewCount: product.reviewCount || 0,
                keyFeatures: [], brand: product.brand,
              });
            }
            products.push(product);
          }
        } catch { /* skip individual failures */ }
      }
    } else if (source && keywords) {
      // Standard keyword scrape
      const keywordList = Array.isArray(keywords) ? keywords : [keywords];

      for (const keyword of keywordList) {
        try {
          switch (source) {
            case 'amazon': products.push(...await scrapeAmazon(keyword, maxResults)); break;
            case 'ebay': products.push(...await scrapeEbay(keyword, maxResults)); break;
            case 'aliexpress': products.push(...await scrapeAliExpress(keyword, maxResults)); break;
          }
        } catch { /* skip individual source failure */ }
      }
    }

    // Apply category mapping and content spinning to all products
    for (const product of products) {
      if (!product.category && product.title) {
        const mapping = mapProductCategory(product.title, product.description, category);
        if (mapping.confidence > 0) product.category = mapping.categoryName;
      }
      if (spinContent && product.description) {
        product.description = applySynonyms(product.description);
      }
    }

    // Save to DB and products.json
    const saved = saveScrapedProducts(products);

    auditLog({
      action: 'scrape',
      userId: admin.id,
      userEmail: admin.email,
      ip: getClientIp(request),
      details: `Scraped ${products.length} products, saved ${saved} new`,
      severity: 'info',
    });

    return NextResponse.json({
      success: true,
      products,
      stats: {
        totalFound: products.length,
        newSaved: saved,
        duplicates: products.length - saved,
        avgPrice: products.length > 0 ? products.reduce((s, p) => s + p.price, 0) / products.length : 0,
      },
    });
  } catch (error) {
    return authError(error);
  }
}

// Helper: scrape Amazon by ASIN
async function scrapeAmazonByASIN(asin: string, affiliateTag: string): Promise<ScrapedProduct | null> {
  if (!asin || asin.length < 10) return null;
  // Validate ASIN format (alphanumeric, 10 chars)
  if (!/^[A-Z0-9]{10}$/i.test(asin)) return null;

  try {
    const results = await scrapeAmazon(asin, 1);
    return results[0] || null;
  } catch { return null; }
}

// Helper: scrape product from URL
async function scrapeProductFromUrl(url: string, affiliateTag: string): Promise<ScrapedProduct | null> {
  if (!url || !url.startsWith('http')) return null;

  try {
    const urlObj = new URL(url);
    const allowedHosts = ['www.amazon.com', 'amazon.com', 'www.ebay.com', 'ebay.com', 'www.aliexpress.com', 'aliexpress.com'];
    if (!allowedHosts.includes(urlObj.hostname)) return null;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const titleMatch = html.match(/<title>([^<]+)</i);
    const title = titleMatch ? titleMatch[1].trim() : urlObj.hostname;

    return {
      id: generateId(),
      title,
      description: `Product from ${urlObj.hostname}`,
      price: 0,
      currency: 'USD',
      image: '',
      source: urlObj.hostname.includes('amazon') ? 'amazon' : urlObj.hostname.includes('ebay') ? 'ebay' : 'other',
      sourceUrl: url,
      affiliateUrl: url,
      category: '',
      brand: title.split(' ')[0] || '',
      rating: 0,
      reviewCount: 0,
      inStock: true,
      specs: {},
      scrapedAt: new Date().toISOString(),
      campaignId: '',
      status: 'pending',
    };
  } catch { return null; }
}
