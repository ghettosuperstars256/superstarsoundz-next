import { NextRequest, NextResponse } from 'next/server';
import {
  scrapeAmazon,
  scrapeEbay,
  scrapeAliExpress,
  scrapeWithRSS,
  saveScrapedProducts,
  runCampaign,
  getScraperStats,
} from '@/lib/scraper';
import { mapProductCategory } from '@/lib/categoryMapper';
import { generateProductDescription, applySynonyms } from '@/lib/contentSpinner';
import { ScrapedProduct } from '@/lib/types';
import { log, generateId, writeItem, readItem } from '@/lib/db';

const AMAZON_AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'ghettosuper02-20';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      campaignId,
      source,
      keywords,
      maxResults = 20,
      category = '',
      spinContent = false,
      bulkItems = [],
    } = body;

    // ===== ACTION: run campaign =====
    if (action === 'run' && campaignId) {
      log(`API: Running campaign ${campaignId}`);
      const products = await runCampaign(campaignId);

      if (products.length === 0) {
        return NextResponse.json({
          success: true,
          products: [],
          stats: {
            totalFound: 0,
            newSaved: 0,
            duplicates: 0,
            avgPrice: 0,
          },
          message: 'Campaign ran but returned 0 results. Try different keywords or check API key configuration.',
        });
      }

      return NextResponse.json({
        success: true,
        products,
        stats: {
          totalFound: products.length,
          newSaved: products.length,
          duplicates: 0,
          avgPrice: products.length > 0 ? products.reduce((s, p) => s + p.price, 0) / products.length : 0,
        },
      });
    }

    // ===== ACTION: get stats =====
    if (action === 'stats') {
      const stats = getScraperStats();
      return NextResponse.json({ success: true, stats });
    }

    // ===== STANDARD SCRAPE MODE =====
    let products: ScrapedProduct[] = [];

    // ===== BULK IMPORT MODE =====
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
            if (mapping.confidence > 0) {
              product.category = mapping.categoryName;
            }

            if (spinContent) {
              product.description = generateProductDescription({
                title: product.title,
                category: product.category,
                price: product.price,
                rating: product.rating,
                reviewCount: product.reviewCount,
                keyFeatures: product.specs ? Object.values(product.specs) : [],
                brand: product.brand,
                specs: product.specs,
              });
              product.description = applySynonyms(product.description, 0.3);
            }

            products.push(product);
          }
        } catch (e) {
          log(`Bulk import error for ${item.value}: ${e}`, 'warn');
        }
      }
    } else {
      // ===== STANDARD SOURCE-BASED MODE =====
      if (!source || !keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields: source and keywords (array) are required' },
          { status: 400 }
        );
      }

      for (const keyword of keywords) {
        switch (source) {
          case 'amazon': {
            const amazonProducts = await scrapeAmazon(keyword, maxResults);
            products.push(...amazonProducts);
            break;
          }
          case 'ebay': {
            const ebayProducts = await scrapeEbay(keyword, maxResults);
            products.push(...ebayProducts);
            break;
          }
          case 'aliexpress': {
            const aeProducts = await scrapeAliExpress(keyword, maxResults);
            products.push(...aeProducts);
            break;
          }
          case 'rss': {
            const rssProducts = await scrapeWithRSS(keyword, keywords);
            products.push(...rssProducts);
            break;
          }
          default:
            log(`Unknown source: ${source}`, 'warn');
        }
      }
    }

    // Auto-apply category mapping to all products
    for (const product of products) {
      const mapping = mapProductCategory(product.title, product.description, product.category);
      if (mapping.confidence > 5) {
        product.category = mapping.categoryName;
      }
    }

    // Save to database
    const saved = saveScrapedProducts(products);

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
    log(`Scrape API error: ${error}`, 'error');
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// ===== AMAZON ASIN SCRAPER =====
async function scrapeAmazonByASIN(asin: string, affiliateTag: string): Promise<ScrapedProduct | null> {
  try {
    const url = `https://www.amazon.com/dp/${asin}?tag=${affiliateTag}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) return null;
    const html = await response.text();

    const titleMatch = html.match(/<span id="productTitle"[^>]*>([^<]+)</);
    const title = titleMatch?.[1]?.trim() || '';

    const priceMatch = html.match(/class="a-price-whole">([^<]+)</);
    const priceDecimal = html.match(/class="a-price-decimal">([^<]+)</);
    const price = priceMatch ? parseFloat(`${priceMatch[1]}${priceDecimal?.[1] || ''}`) : 0;

    const imgMatch = html.match(/<img[^>]*id="landingImage"[^>]*src="([^"]+)"/);
    const image = imgMatch?.[1] || '';

    const ratingMatch = html.match(/class="a-icon-alt">([0-9.]+) out of 5/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

    const brandMatch = html.match(/id="bylineInfo"[^>]*>([^<]+)</);
    const brand = brandMatch?.[1]?.replace(/Visit the | Store/gi, '').trim() || '';

    if (!title) return null;

    return {
      id: generateId(),
      title,
      description: `${title} — Amazon product. ${rating > 0 ? `Rated ${rating}/5 stars.` : ''}`,
      price,
      currency: 'USD',
      image,
      source: 'amazon',
      sourceUrl: url,
      affiliateUrl: url,
      category: '',
      brand,
      rating,
      reviewCount: 0,
      inStock: true,
      specs: {},
      scrapedAt: new Date().toISOString(),
      campaignId: '',
      status: 'pending',
    };
  } catch {
    return null;
  }
}

// ===== URL SCRAPER =====
async function scrapeProductFromUrl(url: string, affiliateTag: string): Promise<ScrapedProduct | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) return null;
    const html = await response.text();

    const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/)
                    || html.match(/<title>([^<]+)</);
    const title = titleMatch?.[1]?.trim() || '';

    const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/)
                   || html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/);
    const description = descMatch?.[1]?.trim() || '';

    const imgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
    const image = imgMatch?.[1] || '';

    if (!title) return null;

    let affiliateUrl = url;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('amazon')) {
        urlObj.searchParams.set('tag', affiliateTag);
        affiliateUrl = urlObj.toString();
      }
    } catch {}

    return {
      id: generateId(),
      title,
      description,
      price: 0,
      currency: 'USD',
      image,
      source: 'custom',
      sourceUrl: url,
      affiliateUrl,
      category: '',
      brand: '',
      rating: 0,
      reviewCount: 0,
      inStock: true,
      specs: {},
      scrapedAt: new Date().toISOString(),
      campaignId: '',
      status: 'pending',
    };
  } catch {
    return null;
  }
}
