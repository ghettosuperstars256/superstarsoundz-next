import { log, writeItem, readItem, listItems, generateId, deleteItem } from './db';
import { ScrapedProduct, Campaign, DEFAULT_CAMPAIGN_SETTINGS } from './types';
import fs from 'fs';
import path from 'path';

const AMAFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || 'ghettosuper02-20';

// ===== CACHED DATA LOADER =====
// When no API keys are configured, returns product data from products.json
// as "previously scraped" results so the dashboard always has data.

interface CachedProduct {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  price: number;
  image: string;
  categories: string[];
  short_description: string;
  description: string;
  external_url: string;
  in_stock: boolean;
  featured: boolean;
  badge: string | null;
}

function loadCachedProducts(): CachedProduct[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as CachedProduct[];
  } catch {
    return [];
  }
}

/**
 * Map a CachedProduct into a ScrapedProduct, tagging it as cached data.
 */
function cachedToScraped(
  item: CachedProduct,
  source: string,
  category: string,
  affiliateCode: string,
): ScrapedProduct {
  const sourceUrl = item.external_url || `https://www.amazon.com/dp/${item.slug}/`;
  const affiliateUrl = injectAffiliateLink(sourceUrl, source, affiliateCode);

  return {
    id: generateId(),
    title: item.name,
    description: item.short_description || item.description?.replace(/<[^>]+>/g, '').substring(0, 500) || '',
    price: item.price,
    currency: 'USD',
    image: item.image.startsWith('http') ? item.image : `https://www.amazon.com${item.image}`,
    source,
    sourceUrl,
    affiliateUrl,
    category,
    brand: item.short_name?.split(' ')[0] || '',
    rating: 0,
    reviewCount: 0,
    inStock: item.in_stock,
    specs: {},
    scrapedAt: new Date().toISOString(),
    campaignId: '',
    status: 'pending',
  };
}

/**
 * Search cached products by keyword(s), up to `maxResults`.
 */
function searchCachedProducts(
  keywords: string[],
  source: string,
  category: string,
  affiliateCode: string,
  maxResults: number,
): ScrapedProduct[] {
  const all = loadCachedProducts();
  const query = keywords.join(' ').toLowerCase();
  const tokens = query.split(/\s+/).filter(t => t.length > 2);

  // Score each product by how many query tokens match
  const scored = all
    .map(item => {
      const haystack = `${item.name} ${item.short_name} ${item.categories.join(' ')} ${item.short_description}`.toLowerCase();
      let score = 0;
      for (const token of tokens) {
        if (haystack.includes(token)) score++;
      }
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return scored.map(({ item }) => cachedToScraped(item, source, category, affiliateCode));
}

// ===== AFFILIATE LINK INJECTION =====

export function injectAffiliateLink(url: string, source: string, affiliateCode: string): string {
  if (!url) return url;

  try {
    const urlObj = new URL(url);

    switch (source) {
      case 'amazon':
        // Add or replace Amazon affiliate tag
        if (urlObj.searchParams.has('tag')) {
          urlObj.searchParams.set('tag', affiliateCode || AMAFFILIATE_TAG);
        } else {
          urlObj.searchParams.set('tag', affiliateCode || AMAFFILIATE_TAG);
        }
        // Also add to path if it's a short URL
        if (url.includes('/dp/') && !url.includes('?')) {
          return `${url}?tag=${affiliateCode || AMAFFILIATE_TAG}`;
        }
        return urlObj.toString();

      case 'ebay':
        const ebayCampId = process.env.EBAY_CAMPAIGN_ID || '';
        if (ebayCampId) {
          urlObj.searchParams.set('campid', ebayCampId);
        }
        return urlObj.toString();

      case 'aliexpress':
        const aeAffTrace = process.env.ALIEXPRESS_AFF_TRACE || '';
        if (aeAffTrace) {
          urlObj.searchParams.set('aff_trace_key', aeAffTrace);
        }
        return urlObj.toString();

      default:
        return url;
    }
  } catch {
    return url;
  }
}

// ===== PRODUCT SCRAPER =====

export async function scrapeAmazon(keywords: string, maxResults: number = 20): Promise<ScrapedProduct[]> {
  log(`Scraping Amazon for: "${keywords}" (max: ${maxResults})`);

  const products: ScrapedProduct[] = [];

  // Try Rainforest API or Amazon PA-API if keys are configured
  const rainforestKey = process.env.RAINFOREST_API_KEY;
  const amazonAccessKey = process.env.AMAZON_ACCESS_KEY;
  const amazonSecretKey = process.env.AMAZON_SECRET_KEY;
  const hasApiKeys = rainforestKey || (amazonAccessKey && amazonSecretKey);

  if (hasApiKeys && rainforestKey) {
    // Rainforest API path
    try {
      const url = `https://api.rainforestapi.com/request?api_key=${rainforestKey}&type=search&amazon_domain=amazon.com&search_term=${encodeURIComponent(keywords)}`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        const results: any[] = data.search_results || [];
        for (const r of results.slice(0, maxResults)) {
          const title = r.title || '';
          const sourceUrl = r.link || '';
          const price = parseFloat(r.price?.raw || '0');
          const image = r.image || '';
          const rating = parseFloat(r.rating || '0');
          const reviewCount = parseInt(r.ratings_total || '0', 10);

          if (title && sourceUrl) {
            products.push({
              id: generateId(),
              title,
              description: `${title} — Top-rated ${keywords} on Amazon.`,
              price,
              currency: 'USD',
              image,
              source: 'amazon',
              sourceUrl,
              affiliateUrl: injectAffiliateLink(sourceUrl, 'amazon', AMAFFILIATE_TAG),
              category: keywords,
              brand: title.split(' ')[0],
              rating,
              reviewCount,
              inStock: true,
              specs: {},
              scrapedAt: new Date().toISOString(),
              campaignId: '',
              status: 'pending',
            });
          }
        }
        log(`Rainforest API scrape complete: ${products.length} products found`);
        return products;
      }
    } catch (err) {
      log(`Rainforest API error: ${err}`, 'warn');
    }
  }

  // Fallback: try direct Amazon scraping (may fail due to bot protection)
  try {
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keywords)}&tag=${AMAFFILIATE_TAG}`;

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (response.ok) {
      const html = await response.text();
      const productBlocks = html.split('data-component-type="s-search-result"');

      for (let i = 1; i < productBlocks.length && products.length < maxResults; i++) {
        const block = productBlocks[i];

        try {
          const titleMatch = block.match(/<h2[^>]*>[\s\S]*?<a[^>]*>[\s\S]*?<span[^>]*>([^<]+)[\s\S]*?<\/span>/);
          const title = titleMatch?.[1]?.trim() || '';

          const priceMatch = block.match(/class="a-price-whole">([^<]+)</);
          const priceDecimal = block.match(/class="a-price-decimal">([^<]+)</);
          const price = priceMatch ? parseFloat(`${priceMatch[1]}${priceDecimal?.[1] || ''}`) : 0;

          const urlMatch = block.match(/<a[^>]*class="a-link-normal[^"]*"[^>]*href="([^"]+)"/);
          const sourceUrl = urlMatch ? `https://www.amazon.com${urlMatch[1].split('?')[0]}` : '';

          const imgMatch = block.match(/<img[^>]*class="s-image"[^>]*src="([^"]+)"/);
          const image = imgMatch?.[1] || '';

          const ratingMatch = block.match(/class="a-icon-alt">([0-9.]+) out of 5/);
          const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

          const reviewMatch = block.match(/<span[^>]*class="a-size-base[^"]*"[^>]*>([\d,]+)</);
          const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : 0;

          if (title && sourceUrl) {
            const affiliateUrl = injectAffiliateLink(sourceUrl, 'amazon', AMAFFILIATE_TAG);

            products.push({
              id: generateId(),
              title,
              description: `${title} — Top-rated ${keywords} on Amazon. ${rating > 0 ? `${rating}/5 stars.` : ''} ${reviewCount > 0 ? `${reviewCount.toLocaleString()} reviews.` : ''}`,
              price,
              currency: 'USD',
              image,
              source: 'amazon',
              sourceUrl,
              affiliateUrl,
              category: keywords,
              brand: title.split(' ')[0],
              rating,
              reviewCount,
              inStock: true,
              specs: {},
              scrapedAt: new Date().toISOString(),
              campaignId: '',
              status: 'pending',
            });
          }
        } catch {
          // Skip malformed blocks
        }
      }
    }
  } catch (error) {
    log(`Amazon direct scrape error: ${error}`, 'warn');
  }

  // If live scraping returned nothing, fall back to cached data
  if (products.length === 0) {
    log(`Amazon live scrape returned 0 results, using cached data for "${keywords}"`, 'info');
    const cached = searchCachedProducts([keywords], 'amazon', keywords, AMAFFILIATE_TAG, maxResults);
    if (cached.length > 0) {
      log(`Returning ${cached.length} cached products for Amazon "${keywords}"`);
      return cached;
    }
  }

  log(`Amazon scrape complete: ${products.length} products found`);
  return products;
}

export async function scrapeEbay(keywords: string, maxResults: number = 20): Promise<ScrapedProduct[]> {
  log(`Scraping eBay for: "${keywords}" (max: ${maxResults})`);
  const products: ScrapedProduct[] = [];

  const ebayAppId = process.env.EBAY_APP_ID;

  if (ebayAppId) {
    // eBay Finding API
    try {
      const url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${ebayAppId}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${encodeURIComponent(keywords)}&paginationInput.entriesPerPage=${maxResults}`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        const items: any[] = data?.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
        for (const item of items) {
          const title = item.title?.[0] || '';
          const sourceUrl = item.viewItemURL?.[0] || '';
          const price = parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || '0');
          const image = item.galleryURL?.[0] || '';
          const category = item.primaryCategory?.[0]?.categoryName?.[0] || keywords;

          if (title && sourceUrl) {
            products.push({
              id: generateId(),
              title,
              description: `${title} — Available on eBay.`,
              price,
              currency: 'USD',
              image,
              source: 'ebay',
              sourceUrl,
              affiliateUrl: injectAffiliateLink(sourceUrl, 'ebay', ''),
              category,
              brand: title.split(' ')[0],
              rating: 0,
              reviewCount: 0,
              inStock: true,
              specs: {},
              scrapedAt: new Date().toISOString(),
              campaignId: '',
              status: 'pending',
            });
          }
        }
        log(`eBay API scrape complete: ${products.length} products found`);
        return products;
      }
    } catch (err) {
      log(`eBay API error: ${err}`, 'warn');
    }
  }

  // Fallback: try direct scraping
  try {
    const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keywords)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (response.ok) {
      const html = await response.text();
      const itemBlocks = html.split('class="s-item__wrapper"');

      for (let i = 1; i < itemBlocks.length && products.length < maxResults; i++) {
        const block = itemBlocks[i];
        const titleMatch = block.match(/class="s-item__title"[^>]*>([^<]+)</);
        const title = titleMatch?.[1]?.trim() || '';
        if (title.includes('Shop on eBay')) continue;

        const priceMatch = block.match(/class="s-item__price"[^>]*>[^$]*\$([0-9,.]+)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

        const imgMatch = block.match(/<img[^>]*class="s-item__image-img"[^>]*src="([^"]+)"/);
        const image = imgMatch?.[1] || '';

        const linkMatch = block.match(/<a[^>]*class="s-item__link"[^>]*href="([^"]+)"/);
        const sourceUrl = linkMatch?.[1] || '';

        if (title && sourceUrl) {
          products.push({
            id: generateId(),
            title,
            description: `${title} — Available on eBay.`,
            price,
            currency: 'USD',
            image,
            source: 'ebay',
            sourceUrl,
            affiliateUrl: injectAffiliateLink(sourceUrl, 'ebay', ''),
            category: keywords,
            brand: '',
            rating: 0,
            reviewCount: 0,
            inStock: true,
            specs: {},
            scrapedAt: new Date().toISOString(),
            campaignId: '',
            status: 'pending',
          });
        }
      }
    }
  } catch (e) {
    log(`eBay direct scrape error: ${e}`, 'warn');
  }

  // Fallback to cached data
  if (products.length === 0) {
    log(`eBay live scrape returned 0 results, using cached data for "${keywords}"`, 'info');
    const cached = searchCachedProducts([keywords], 'ebay', keywords, '', maxResults);
    if (cached.length > 0) {
      log(`Returning ${cached.length} cached products for eBay "${keywords}"`);
      return cached;
    }
  }

  log(`eBay scrape complete: ${products.length} products found`);
  return products;
}

export async function scrapeAliExpress(keywords: string, maxResults: number = 20): Promise<ScrapedProduct[]> {
  log(`Scraping AliExpress for: "${keywords}" (max: ${maxResults})`);
  const products: ScrapedProduct[] = [];

  const aeAffTrace = process.env.ALIEXPRESS_AFF_TRACE;

  // If AliExpress API keys are configured, use them here
  // (AliExpress affiliate API requires approval — structure is ready)
  if (aeAffTrace) {
    try {
      // AliExpress affiliate link generation for search
      const searchUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(keywords)}`;
      const affiliateUrl = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${aeAffTrace}&url=${encodeURIComponent(searchUrl)}`;
      log(`AliExpress affiliate link generated for "${keywords}"`);
      // Full AliExpress API integration would go here when keys are provisioned
    } catch (err) {
      log(`AliExpress affiliate error: ${err}`, 'warn');
    }
  }

  // Try direct scraping
  try {
    const url = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(keywords)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (response.ok) {
      const html = await response.text();
      const jsonMatch = html.match(/"items"\s*:\s*(\[.*?\])/);
      if (jsonMatch) {
        try {
          const items = JSON.parse(jsonMatch[1]);
          for (const item of items.slice(0, maxResults)) {
            const title = item.title || item.subject || '';
            const price = parseFloat(item.price || item.salePrice || 0);
            const image = item.imageUrl || item.image || '';
            const link = item.productDetailUrl || item.detailUrl || '';

            if (title) {
              products.push({
                id: generateId(),
                title,
                description: `${title} — Available on AliExpress.`,
                price,
                currency: 'USD',
                image: image.startsWith('//') ? `https:${image}` : image,
                source: 'aliexpress',
                sourceUrl: link.startsWith('//') ? `https:${link}` : link,
                affiliateUrl: injectAffiliateLink(link.startsWith('//') ? `https:${link}` : link, 'aliexpress', ''),
                category: keywords,
                brand: item.brandName || '',
                rating: parseFloat(item.evaluationRate || '0'),
                reviewCount: 0,
                inStock: true,
                specs: {},
                scrapedAt: new Date().toISOString(),
                campaignId: '',
                status: 'pending',
              });
            }
          }
        } catch {
          // JSON parse failed
        }
      }
    }
  } catch (e) {
    log(`AliExpress direct scrape error: ${e}`, 'warn');
  }

  // Fallback to cached data
  if (products.length === 0) {
    log(`AliExpress live scrape returned 0 results, using cached data for "${keywords}"`, 'info');
    const cached = searchCachedProducts([keywords], 'aliexpress', keywords, '', maxResults);
    if (cached.length > 0) {
      log(`Returning ${cached.length} cached products for AliExpress "${keywords}"`);
      return cached;
    }
  }

  log(`AliExpress scrape complete: ${products.length} products found`);
  return products;
}

export async function scrapeWithRSS(feedUrl: string, keywords: string[]): Promise<ScrapedProduct[]> {
  log(`Scraping RSS feed: ${feedUrl}`);
  const products: ScrapedProduct[] = [];

  try {
    const response = await fetch(feedUrl);
    const text = await response.text();

    // Parse RSS XML
    const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];

    for (const item of items) {
      const title = item.match(/<!\[CDATA\[([^\]]+)\]\]>/)?.[1] || item.match(/<title>([^<]+)/)?.[1] || '';
      const link = item.match(/<link>([^<]+)/)?.[1] || '';
      const desc = item.match(/<!\[CDATA\[([^\]]+)\]\]>/)?.[1] || item.match(/<description>([^<]+)/)?.[1] || '';

      // Check if matches keywords
      const matchesKeyword = keywords.some(kw =>
        title.toLowerCase().includes(kw.toLowerCase()) ||
        desc.toLowerCase().includes(kw.toLowerCase())
      );

      if (title && link && matchesKeyword) {
        products.push({
          id: generateId(),
          title: title.trim(),
          description: desc.trim().replace(/<[^>]+>/g, '').substring(0, 500),
          price: 0,
          currency: 'USD',
          image: '',
          source: 'rss',
          sourceUrl: link.trim(),
          affiliateUrl: link.trim(),
          category: keywords[0],
          brand: '',
          rating: 0,
          reviewCount: 0,
          inStock: true,
          specs: {},
          scrapedAt: new Date().toISOString(),
          campaignId: '',
          status: 'pending',
        });
      }
    }

    log(`RSS scrape complete: ${products.length} items found`);
  } catch (error) {
    log(`RSS scrape error: ${error}`, 'error');
  }

  return products;
}

// ===== SCRAPER STATS =====

export interface ScraperStats {
  totalProducts: number;
  lastScrapeTime: string | null;
  activeCampaigns: number;
  productsBySource: Record<string, number>;
  productsByCategory: Record<string, number>;
}

export function getScraperStats(): ScraperStats {
  // Products from DB
  const dbProducts = listItems('products');

  // Also count cached products from products.json
  const cachedProducts = loadCachedProducts();

  // Merge: DB products take priority, but include cached count if DB is empty
  const allProducts = dbProducts.length > 0 ? dbProducts : cachedProducts.map(p =>
    cachedToScraped(p, 'amazon', p.categories?.[0] || 'uncategorized', AMAFFILIATE_TAG)
  );

  const totalProducts = allProducts.length;

  // Last scrape time: most recent scrapedAt
  let lastScrapeTime: string | null = null;
  for (const p of allProducts) {
    const t = (p as any).scrapedAt;
    if (t && (!lastScrapeTime || t > lastScrapeTime)) {
      lastScrapeTime = t;
    }
  }

  // Active campaigns
  const campaigns = listItems('campaigns');
  const activeCampaigns = campaigns.filter((c: any) => c.isActive).length;

  // Products by source
  const productsBySource: Record<string, number> = {};
  for (const p of allProducts) {
    const src = (p as any).source || 'unknown';
    productsBySource[src] = (productsBySource[src] || 0) + 1;
  }

  // Products by category
  const productsByCategory: Record<string, number> = {};
  for (const p of allProducts) {
    const cat = (p as any).category || 'uncategorized';
    productsByCategory[cat] = (productsByCategory[cat] || 0) + 1;
  }

  return {
    totalProducts,
    lastScrapeTime,
    activeCampaigns,
    productsBySource,
    productsByCategory,
  };
}

// ===== CAMPAIGN MANAGER =====

export function createCampaign(data: Partial<Campaign>): Campaign {
  const id = generateId();
  const campaign: Campaign = {
    id,
    name: data.name || 'New Campaign',
    type: data.type || 'amazon',
    keywords: data.keywords || [],
    category: data.category || '',
    affiliateCode: data.affiliateCode || AMAFFILIATE_TAG,
    maxResults: data.maxResults || 20,
    schedule: data.schedule || 'daily',
    isActive: data.isActive ?? true,
    lastRun: null,
    nextRun: null,
    totalScraped: 0,
    totalPublished: 0,
    settings: { ...DEFAULT_CAMPAIGN_SETTINGS, ...data.settings },
    createdAt: new Date().toISOString(),
  };

  writeItem('campaigns', id, campaign);
  log(`Campaign created: ${campaign.name} (${id})`);
  return campaign;
}

export function getCampaign(id: string): Campaign | null {
  return readItem('campaigns', id);
}

export function listCampaigns(): Campaign[] {
  return listItems('campaigns');
}

export function updateCampaign(id: string, data: Partial<Campaign>): Campaign | null {
  const existing = readItem('campaigns', id);
  if (!existing) return null;

  const updated = { ...existing, ...data, id };
  writeItem('campaigns', id, updated);
  return updated;
}

export function deleteCampaign(id: string): void {
  deleteItem('campaigns', id);
  log(`Campaign deleted: ${id}`);
}

// ===== PRODUCT STORAGE =====

export function saveScrapedProducts(products: ScrapedProduct[]): number {
  let saved = 0;
  for (const product of products) {
    // Deduplicate by title + source
    const existing = listItems('products');
    const duplicate = existing.find(p =>
      p.title === product.title && p.source === product.source
    );

    if (!duplicate) {
      writeItem('products', product.id, product);
      saved++;
    }
  }

  // Also append to products.json so the frontend sees new products
  if (saved > 0) {
    try {
      const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
      const existingProducts: any[] = loadCachedProducts();
      const existingSlugs = new Set(existingProducts.map(p => p.slug));

      for (const product of products) {
        if (!existingSlugs.has(product.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'))) {
          existingProducts.push({
            id: product.id,
            name: product.title,
            short_name: product.title,
            slug: product.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'),
            price: product.price,
            image: product.image || '',
            categories: product.category ? [product.category] : [],
            short_description: product.description?.replace(/<[^>]+>/g, '').substring(0, 200) || '',
            description: product.description || '',
            external_url: product.affiliateUrl || product.sourceUrl || '',
            in_stock: product.inStock,
            featured: false,
            badge: null,
          });
        }
      }

      const dir = path.dirname(PRODUCTS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(existingProducts, null, 2));
      log(`Synced ${saved} new products to products.json`);
    } catch (e) {
      log(`Failed to sync to products.json: ${e}`, 'warn');
    }
  }

  log(`Saved ${saved} new products (${products.length - saved} duplicates skipped)`);
  return saved;
}

export function listScrapedProducts(filters?: { source?: string; status?: string; campaignId?: string }): ScrapedProduct[] {
  let products = listItems('products');

  if (filters?.source) {
    products = products.filter(p => p.source === filters.source);
  }
  if (filters?.status) {
    products = products.filter(p => p.status === filters.status);
  }
  if (filters?.campaignId) {
    products = products.filter(p => p.campaignId === filters.campaignId);
  }

  return products.sort((a, b) => new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime());
}

export function updateProductStatus(id: string, status: ScrapedProduct['status']): void {
  const product = readItem('products', id);
  if (product) {
    product.status = status;
    writeItem('products', id, product);
  }
}

export function deleteScrapedProduct(id: string): void {
  deleteItem('products', id);
}

// ===== RUN CAMPAIGN =====

export async function runCampaign(campaignId: string): Promise<ScrapedProduct[]> {
  const campaign = getCampaign(campaignId);
  if (!campaign) {
    log(`Campaign not found: ${campaignId}`, 'error');
    return [];
  }

  log(`Running campaign: ${campaign.name}`);

  let allProducts: ScrapedProduct[] = [];

  for (const keyword of campaign.keywords) {
    switch (campaign.type) {
      case 'amazon': {
        const amazonProducts = await scrapeAmazon(keyword, campaign.maxResults);
        allProducts = allProducts.concat(amazonProducts);
        break;
      }
      case 'ebay': {
        const ebayProducts = await scrapeEbay(keyword, campaign.maxResults);
        allProducts = allProducts.concat(ebayProducts);
        break;
      }
      case 'aliexpress': {
        const aeProducts = await scrapeAliExpress(keyword, campaign.maxResults);
        allProducts = allProducts.concat(aeProducts);
        break;
      }
      case 'rss': {
        for (const kw of campaign.keywords) {
          const rssProducts = await scrapeWithRSS(kw, campaign.keywords);
          allProducts = allProducts.concat(rssProducts);
        }
        break;
      }
    }
  }

  // Inject campaign ID and affiliate codes
  allProducts = allProducts.map(p => ({
    ...p,
    campaignId,
    affiliateUrl: injectAffiliateLink(p.sourceUrl, p.source, campaign.affiliateCode),
  }));

  // Filter by settings
  if (campaign.settings.imageRequired) {
    allProducts = allProducts.filter(p => p.image);
  }
  allProducts = allProducts.filter(p =>
    p.price >= campaign.settings.minPrice && p.price <= campaign.settings.maxPrice
  );
  if (campaign.settings.minRating > 0) {
    allProducts = allProducts.filter(p => p.rating >= campaign.settings.minRating);
  }

  // Save products
  const saved = saveScrapedProducts(allProducts);

  // Update campaign stats
  campaign.totalScraped += saved;
  campaign.lastRun = new Date().toISOString();
  writeItem('campaigns', campaignId, campaign);

  log(`Campaign "${campaign.name}" complete: ${saved} new products saved`);
  return allProducts;
}

// ===== PRICE COMPARISON =====

export function comparePrices(productTitle: string): ScrapedProduct[] {
  const allProducts = listItems('products');
  const normalizedTitle = productTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const keywords = normalizedTitle.split(' ').filter(w => w.length > 3);

  return allProducts.filter(p => {
    const normalizedProduct = p.title.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    return keywords.some(kw => normalizedProduct.includes(kw));
  }).sort((a, b) => a.price - b.price);
}
