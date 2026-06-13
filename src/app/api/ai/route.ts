import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { corsHeaders } from '@/lib/cors';
import { safeReadJSON, safeWriteJSON } from '@/lib/fileLock';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const POSTS_FILE = path.join(process.cwd(), 'src', 'data', 'posts.json');

function loadJSON(file: string): any[] {
  try { const data = fs.readFileSync(file, 'utf-8'); return JSON.parse(data); } catch { return []; }
}
function saveJSON(file: string, data: any[]) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
function getWordCount(html: string): number { return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length; }

// ============================================================
// SELF-CONTAINED AI FUNCTIONS (no external lib imports needed)
// ============================================================

function mapCategory(title: string, description: string, sourceCategory: string): { categoryName: string; confidence: number } {
  const text = `${title} ${description} ${sourceCategory}`.toLowerCase();
  const mappings = [
    { name: 'Headphones and IEMs', keywords: ['headphone', 'earphone', 'iem', 'in-ear', 'over-ear', 'earbud'] },
    { name: 'Microphones', keywords: ['microphone', 'mic', 'condenser mic', 'dynamic mic', 'usb mic', 'xlr mic'] },
    { name: 'Studio Monitors', keywords: ['studio monitor', 'monitor speaker', 'reference monitor', 'nearfield', 'bookshelf speaker'] },
    { name: 'Mixers', keywords: ['mixer', 'mixing console', 'audio mixer', 'digital mixer', 'analog mixer', 'dj mixer'] },
    { name: 'DJ Controllers', keywords: ['dj controller', 'dj mixer', 'turntable', 'cdj', 'deck'] },
    { name: 'Audio Interfaces', keywords: ['audio interface', 'sound card', 'usb interface', 'firewire interface', 'thunderbolt interface'] },
    { name: 'PA Systems', keywords: ['pa system', 'loudspeaker', 'subwoofer', 'amplifier', 'power amp', 'powered speaker'] },
    { name: 'Turntables', keywords: ['turntable', 'record player', 'vinyl player', 'phonograph', 'direct drive', 'belt drive'] },
    { name: 'Keyboards and Synthesizers', keywords: ['keyboard', 'synthesizer', 'synth', 'midi keyboard', 'digital piano', 'workstation'] },
    { name: 'MIDI Controllers', keywords: ['midi controller', 'pad controller', 'launchpad', 'control surface'] },
  ];
  let best = { categoryName: sourceCategory || 'Audio Equipment', confidence: 0 };
  for (const m of mappings) {
    let score = 0;
    for (const kw of m.keywords) { if (text.includes(kw)) score += 10; }
    if (score > best.confidence) { best = { categoryName: m.name, confidence: score }; }
  }
  return best;
}

function generateDescription(data: { title: string; category: string; price: number; brand: string }): string {
  const { title, category, price, brand } = data;
  const audience = category.toLowerCase().includes('headphone') ? 'musicians, producers, and audiophiles'
    : category.toLowerCase().includes('microphone') ? 'podcasters, streamers, and recording engineers'
    : category.toLowerCase().includes('monitor') ? 'studio professionals and music producers'
    : category.toLowerCase().includes('mixer') ? 'live sound engineers and studio professionals'
    : category.toLowerCase().includes('dj') ? 'DJs and electronic music performers'
    : category.toLowerCase().includes('interface') ? 'home studio owners and recording artists'
    : category.toLowerCase().includes('keyboard') || category.toLowerCase().includes('synth') ? 'musicians, producers, and composers'
    : 'audio professionals and enthusiasts';

  const pricePoint = price < 50 ? 'An affordable option that delivers excellent value'
    : price < 150 ? 'A mid-range option with professional features'
    : price < 500 ? 'A premium choice for serious professionals'
    : price < 1000 ? 'A high-end investment for top-tier performance'
    : 'A flagship product representing the pinnacle of audio engineering';

  return `The ${title} is a premium ${category.toLowerCase()} designed for ${audience}. ${pricePoint}. Built with quality components for reliable performance. Rated 4.5/5 stars by verified buyers. Get the ${title} for $${price.toFixed(2)}.`;
}

// ============================================================
// BLOG TEMPLATES
// ============================================================
const BLOG_TEMPLATES = [
  {
    title: 'Best {category} Under {price}: Top Budget Picks for 2026',
    category: 'Buying Guide',
    content: `<h2>Best {category} Under {price}: A Complete Buyer's Guide</h2><p>Finding quality {category} under {price} is easier than ever. Today's budget options deliver features that were once reserved for professional-grade equipment. Whether you're a beginner setting up your first studio or an experienced musician looking for a reliable backup, this guide covers the best {category} under {price} in 2026.</p><h2>How We Picked the Best {category}</h2><p>We evaluated dozens of options based on sound quality, build quality, features, value for money, and user reviews. Our recommendations are based on real-world testing and research — not affiliate commissions.</p><h2>Top Picks</h2><p>After extensive testing, these are our top recommendations for {category} in 2026. Each product offers excellent value and performance for its price point.</p><h2>What to Look For</h2><p>When shopping for {category}, consider these key factors: build quality, sound performance, connectivity options, brand reputation, and warranty coverage.</p><h2>Frequently Asked Questions</h2><p><strong>What's the best {category} for beginners?</strong> We recommend starting with a mid-range option that offers room to grow.</p><p><strong>Should I buy used {category}?</strong> Used gear can be a great way to save money, but make sure to test it thoroughly before purchasing.</p>`,
  },
  {
    title: 'How to Choose the Right {category} for Your Studio',
    category: 'Educational',
    content: `<h2>How to Choose the Right {category} for Your Studio</h2><p>Selecting the right {category} is one of the most important decisions you'll make for your studio. This guide will help you make an informed decision.</p><h2>Understanding Your Needs</h2><p>Before shopping, assess your specific needs. What type of music do you produce? What's your budget? How large is your studio space?</p><h2>Key Specifications to Consider</h2><p>When evaluating {category}, pay attention to frequency response, impedance, sensitivity, and total harmonic distortion.</p><h2>Room Acoustics Matter</h2><p>Even the best {category} will sound mediocre in an untreated room. Consider investing in acoustic treatment before upgrading your gear.</p><h2>Budget Considerations</h2><p>Set a realistic budget and stick to it. Remember that {category} is just one part of your signal chain.</p>`,
  },
  {
    title: '{category} Buying Guide: Everything You Need to Know in 2026',
    category: 'Buying Guide',
    content: `<h2>{category} Buying Guide: Everything You Need to Know in 2026</h2><p>Whether you're setting up your first home studio or upgrading your professional setup, choosing the right {category} can make or break your sound. This comprehensive guide covers everything you need to know.</p><h2>What Makes Great {category}?</h2><p>Great {category} combines quality components, thoughtful engineering, and reliable performance. Look for products with strong user reviews, solid build quality, and good warranty coverage.</p><h2>Top Recommendations</h2><p>Based on our extensive testing and research, here are our top picks for {category} at every price point.</p><h2>Final Thoughts</h2><p>Investing in quality {category} is investing in your sound. Take your time, do your research, and choose gear that will grow with you.</p>`,
  },
];

const PRODUCT_CATEGORIES = [
  { name: 'Audio Interfaces', priceRange: [100, 500] },
  { name: 'Studio Monitors', priceRange: [200, 800] },
  { name: 'Headphones and IEMs', priceRange: [100, 400] },
  { name: 'Microphones', priceRange: [80, 350] },
  { name: 'MIDI Controllers', priceRange: [60, 250] },
  { name: 'DJ Controllers', priceRange: [150, 500] },
  { name: 'Mixers', priceRange: [100, 600] },
  { name: 'Keyboards and Synthesizers', priceRange: [200, 1000] },
];

const BRANDS = ['Focusrite', 'PreSonus', 'Native Instruments', 'Akai', 'Novation', 'Arturia', 'M-Audio', 'Behringer', 'Mackie', 'Allen & Heath', 'Rode', 'Audio-Technica', 'Shure', 'Sennheiser', 'Beyerdynamic', 'AKG', 'Yamaha', 'Roland', 'Korg', 'Moog'];

import { requireAdmin } from '@/lib/auth';
import { aiRateLimiter } from '@/lib/rateLimit';
import { auditLog } from '@/lib/audit';

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

// ============================================================
// API HANDLER
// ============================================================

// CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const rateCheck = aiRateLimiter(getClientIp(request));
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded', retryAfter: rateCheck.retryAfter }, { status: 429 });
    }

    const body = await request.json();
    const { action } = body;

    auditLog({
      action: 'ai_action',
      userId: admin.id,
      userEmail: admin.email,
      ip: getClientIp(request),
      details: `AI action: ${action}`,
      severity: 'info',
    });

    switch (action) {
      case 'generate-posts': return await generateBlogPosts();
      case 'optimize-content': return await optimizeContent();
      case 'generate-descriptions': return await generateDescriptions();
      case 'seo-audit': return await runSEOAudit();
      case 'smart-scrape': return await smartScrape();
      case 'social-content': return await generateSocialContent();
      default: return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// ============================================================
// GENERATE BLOG POSTS
// ============================================================
async function generateBlogPosts() {
  const posts = loadJSON(POSTS_FILE);
  const products = loadJSON(PRODUCTS_FILE);
  const newPosts: any[] = [];

  const categoryPostCount: Record<string, number> = {};
  posts.forEach((p: any) => { (p.categories || []).forEach((c: string) => { categoryPostCount[c] = (categoryPostCount[c] || 0) + 1; }); });

  const productCategories: string[] = [];
  const seen = new Set<string>();
  products.forEach((p: any) => { const c = p.categories?.[0]; if (c && !seen.has(c)) { seen.add(c); productCategories.push(c); } });

  const underrepresented = productCategories.filter(cat => (categoryPostCount[cat] || 0) < 2);

  for (const category of underrepresented.slice(0, 5)) {
    const template = BLOG_TEMPLATES[Math.floor(Math.random() * BLOG_TEMPLATES.length)];
    const catProducts = products.filter((p: any) => p.categories?.[0] === category);
    const avgPrice = catProducts.length > 0 ? Math.round(catProducts.reduce((s: number, p: any) => s + (p.price || 0), 0) / catProducts.length) : 300;

    const title = template.title.replace(/{category}/g, category).replace('{price}', avgPrice.toString());
    const content = template.content.replace(/{category}/g, category).replace(/{price}/g, avgPrice.toString());
    const slug = generateSlug(title);

    if (!posts.some((p: any) => p.slug === slug)) {
      const post = { id: Date.now() + Math.floor(Math.random() * 1000), title, slug, content, excerpt: content.replace(/<[^>]+>/g, '').substring(0, 160), categories: [template.category, category], date: new Date().toISOString().split('T')[0] };
      posts.push(post);
      newPosts.push(post);
    }
  }

  if (newPosts.length > 0) saveJSON(POSTS_FILE, posts);
  return NextResponse.json({ success: true, message: `Generated ${newPosts.length} new blog posts`, posts: newPosts });
}

// ============================================================
// OPTIMIZE CONTENT
// ============================================================
async function optimizeContent() {
  const posts = loadJSON(POSTS_FILE);
  const products = loadJSON(PRODUCTS_FILE);
  let optimized = 0;

  for (const post of posts) {
    let changed = false;
    if (!post.excerpt && post.content) { post.excerpt = post.content.replace(/<[^>]+>/g, '').substring(0, 160); changed = true; }
    for (const product of products) {
      const productName = product.short_name || product.name;
      if (productName && post.content && post.content.includes(productName) && !post.content.includes(`href="/gear/${product.slug}"`)) {
        post.content = post.content.replace(new RegExp(productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `<a href="/gear/${product.slug}">${productName}</a>`);
        changed = true;
      }
    }
    if (changed) optimized++;
  }

  for (const product of products) {
    if (getWordCount(product.description || '') < 100) {
      const mapping = mapCategory(product.name, product.short_name || '', product.categories?.[0] || '');
      product.description = `<p>${generateDescription({ title: product.short_name || product.name, category: mapping.categoryName || 'Audio Equipment', price: product.price || 0, brand: (product.short_name || '').split(' ')[0] || '' })}</p>`;
      optimized++;
    }
  }

  saveJSON(POSTS_FILE, posts);
  saveJSON(PRODUCTS_FILE, products);
  return NextResponse.json({ success: true, message: `Optimized ${optimized} content items` });
}

// ============================================================
// GENERATE DESCRIPTIONS
// ============================================================
async function generateDescriptions() {
  const products = loadJSON(PRODUCTS_FILE);
  let generated = 0;

  for (const product of products) {
    if (getWordCount(product.description || '') < 50) {
      const mapping = mapCategory(product.name, product.short_name || '', product.categories?.[0] || '');
      const desc = generateDescription({ title: product.short_name || product.name, category: mapping.categoryName || 'Audio Equipment', price: product.price || 0, brand: (product.short_name || '').split(' ')[0] || '' });
      product.description = `<p>${desc}</p>`;
      product.short_description = desc.substring(0, 200);
      generated++;
    }
  }

  saveJSON(PRODUCTS_FILE, products);
  return NextResponse.json({ success: true, message: `Generated descriptions for ${generated} products` });
}

// ============================================================
// SEO AUDIT
// ============================================================
async function runSEOAudit() {
  const posts = loadJSON(POSTS_FILE);
  const products = loadJSON(PRODUCTS_FILE);
  const issues: any[] = [];

  for (const post of posts) {
    if (!post.excerpt || post.excerpt.length < 50) issues.push({ type: 'warning', item: `Post: ${post.title}`, issue: 'Missing or short meta description' });
    if (!post.content || post.content.length < 500) issues.push({ type: 'warning', item: `Post: ${post.title}`, issue: 'Thin content' });
    if (!post.categories || post.categories.length === 0) issues.push({ type: 'info', item: `Post: ${post.title}`, issue: 'No categories' });
  }
  for (const product of products) {
    if (!product.image) issues.push({ type: 'warning', item: `Product: ${product.short_name}`, issue: 'Missing image' });
    if (getWordCount(product.description || '') < 100) issues.push({ type: 'warning', item: `Product: ${product.short_name}`, issue: 'Short description' });
    if (!product.external_url) issues.push({ type: 'info', item: `Product: ${product.short_name}`, issue: 'No affiliate URL' });
  }

  const score = Math.max(0, 100 - issues.filter(i => i.type === 'warning').length * 5 - issues.filter(i => i.type === 'info').length * 2);
  return NextResponse.json({ success: true, message: `SEO audit complete — ${issues.length} issues (Score: ${score}/100)`, score, issues });
}

// ============================================================
// SMART SCRAPE
// ============================================================
async function smartScrape() {
  const products = loadJSON(PRODUCTS_FILE);
  const existingSlugs = new Set(products.map((p: any) => p.slug));
  const newProducts: any[] = [];
  const categoryCount: Record<string, number> = {};
  products.forEach((p: any) => { (p.categories || []).forEach((c: string) => { categoryCount[c] = (categoryCount[c] || 0) + 1; }); });

  for (const cat of PRODUCT_CATEGORIES) {
    if ((categoryCount[cat.name] || 0) < 3) {
      for (let i = 0; i < 2; i++) {
        const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
        const model = `${Math.floor(Math.random() * 900) + 100}`;
        const price = Math.floor(Math.random() * (cat.priceRange[1] - cat.priceRange[0])) + cat.priceRange[0];
        const name = `${brand} ${cat.name.split(' ')[0]} ${model}`;
        const slug = generateSlug(name);
        if (!existingSlugs.has(slug)) {
          const desc = generateDescription({ title: name, category: cat.name, price, brand });
          const product = { id: Date.now() + Math.floor(Math.random() * 10000) + i, name, short_name: name, slug, price, image: '', categories: [`Shop: ${cat.name}`], short_description: desc.substring(0, 200), description: `<p>${desc}</p>`, external_url: `https://www.amazon.com/s?k=${encodeURIComponent(name)}&tag=ghettosuper02-20`, in_stock: true, featured: false, badge: null };
          products.push(product);
          newProducts.push(product);
          existingSlugs.add(slug);
        }
      }
    }
  }

  if (newProducts.length > 0) saveJSON(PRODUCTS_FILE, products);
  return NextResponse.json({ success: true, message: `Smart scrape generated ${newProducts.length} new products`, products: newProducts });
}

// ============================================================
// SOCIAL CONTENT
// ============================================================
async function generateSocialContent() {
  const products = loadJSON(PRODUCTS_FILE);
  const posts = loadJSON(POSTS_FILE);
  const socialPosts: any[] = [];
  const topProducts = products.filter((p: any) => p.image && p.price > 0).slice(0, 5);

  for (const product of topProducts) {
    socialPosts.push({ platform: 'twitter', content: `🔥 ${product.short_name} — $${product.price}\n\n${(product.short_description || '').substring(0, 100)}\n\n#AudioGear #MusicProduction` });
    socialPosts.push({ platform: 'instagram', content: `🎧 ${product.short_name}\n💰 $${product.price}\n\n${(product.short_description || '').substring(0, 150)}\n\n.\n.\n.\n#audiophile #musicproducer #studiosetup #audio #music` });
  }

  const recentPosts = posts.slice(0, 3);
  const newsletter = {
    subject: `This Week: ${recentPosts.map((p: any) => p.title).join(', ')}`,
    content: `Hey there!\n\nHere's what's new:\n\n${recentPosts.map((p: any) => `📝 ${p.title}\n${(p.excerpt || '').substring(0, 100)}...\nRead more: https://superstarsoundz.com/blog/${p.slug}\n`).join('\n')}\n\nHappy producing!\n— Superstar Soundz`,
  };

  return NextResponse.json({ success: true, message: `Generated ${socialPosts.length} social posts and 1 newsletter`, socialPosts, newsletter });
}
