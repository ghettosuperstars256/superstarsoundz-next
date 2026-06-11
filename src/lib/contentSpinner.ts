// Content spinner — generates unique product descriptions from templates and data

export interface SpinTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
}

export const DEFAULT_SPIN_TEMPLATES: SpinTemplate[] = [
  {
    id: 'spin_standard',
    name: 'Standard Product',
    template: `The {title} is a top-rated {category} designed for {audience}. {key_feature}. With a rating of {rating}/5 stars from {reviews} reviews, it's trusted by professionals worldwide. {price_point}. Available now at {price}.`,
    variables: ['title', 'category', 'audience', 'key_feature', 'rating', 'reviews', 'price_point', 'price'],
  },
  {
    id: 'spin_premium',
    name: 'Premium Highlight',
    template: `Experience excellence with the {title} — a professional-grade {category} built for {audience}. {key_feature}. Rated {rating}/5 stars with {reviews}+ reviews. {price_point}. Get yours for {price}.`,
    variables: ['title', 'category', 'audience', 'key_feature', 'rating', 'reviews', 'price_point', 'price'],
  },
  {
    id: 'spin_comparison',
    name: 'Comparison Style',
    template: `Looking for the best {category}? The {title} delivers {key_feature}, making it ideal for {audience}. With {rating}/5 stars and {reviews} reviews, it stands out from the competition. {price_point}. Price: {price}.`,
    variables: ['title', 'category', 'audience', 'key_feature', 'rating', 'reviews', 'price_point', 'price'],
  },
  {
    id: 'spin_compact',
    name: 'Compact Listing',
    template: `{title} — {category} for {audience}. {key_feature}. {rating}/5 stars ({reviews} reviews). {price}.`,
    variables: ['title', 'category', 'audience', 'key_feature', 'rating', 'reviews', 'price'],
  },
];

// Synonym replacements for content variation
const SYNONYMS: Record<string, string[]> = {
  'excellent': ['outstanding', 'exceptional', 'superior', 'top-tier', 'premium'],
  'great': ['fantastic', 'remarkable', 'impressive', 'superb', 'excellent'],
  'good': ['solid', 'reliable', 'quality', 'dependable', 'well-built'],
  'best': ['top', 'leading', 'premier', 'finest', 'number one'],
  'popular': ['widely used', 'highly regarded', 'well-loved', 'favorite', 'sought-after'],
  'professional': ['pro-grade', 'studio-quality', 'industry-standard', 'commercial-grade', 'expert-level'],
  'affordable': ['budget-friendly', 'cost-effective', 'value-packed', 'economical', 'reasonably priced'],
  'durable': ['long-lasting', 'built to last', 'rugged', 'sturdy', 'heavy-duty'],
  'versatile': ['multi-purpose', 'flexible', 'adaptable', 'all-around', 'multi-functional'],
  'powerful': ['high-performance', 'robust', 'potent', 'strong', 'capable'],
  'compact': ['space-saving', 'portable', 'lightweight', 'sleek', 'streamlined'],
  'easy': ['simple', 'straightforward', 'user-friendly', 'intuitive', 'effortless'],
  'fast': ['quick', 'rapid', 'swift', 'speedy', 'responsive'],
  'clear': ['crisp', 'clean', 'transparent', 'pure', 'distortion-free'],
};

// Generate spun content from a template
export function spinContent(
  template: SpinTemplate,
  data: Record<string, string>
): string {
  let result = template.template;
  
  // Replace variables
  for (const variable of template.variables) {
    const value = data[variable] || `{${variable}}`;
    result = result.replace(new RegExp(`\\{${variable}\\}`, 'g'), value);
  }
  
  return result;
}

// Generate multiple variations of a description
export function generateVariations(
  title: string,
  category: string,
  price: number,
  rating: number,
  reviewCount: number,
  keyFeatures: string[],
  count: number = 3
): string[] {
  const variations: string[] = [];
  const templates = DEFAULT_SPIN_TEMPLATES;
  
  const audience = getAudience(category);
  const pricePoint = getPricePoint(price);
  const keyFeature = keyFeatures[0] || `Quality ${category.toLowerCase()}`;
  
  for (let i = 0; i < count; i++) {
    const tmpl = templates[i % templates.length];
    const spun = spinContent(tmpl, {
      title,
      category: category.toLowerCase(),
      audience,
      key_feature: keyFeature,
      rating: rating > 0 ? rating.toString() : '4.5',
      reviews: reviewCount > 0 ? reviewCount.toLocaleString() : '1,000',
      price_point: pricePoint,
      price: price.toFixed(2),
    });
    variations.push(spun);
  }
  
  return variations;
}

// Apply synonym replacement for additional uniqueness
export function applySynonyms(text: string, intensity: number = 0.3): string {
  let result = text;
  
  for (const [word, synonyms] of Object.entries(SYNONYMS)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(result) && Math.random() < intensity) {
      const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
      result = result.replace(regex, synonym);
    }
  }
  
  return result;
}

// Generate a complete product description
export function generateProductDescription(data: {
  title: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  keyFeatures: string[];
  brand: string;
  specs?: Record<string, string>;
}): string {
  const { title, category, price, rating, reviewCount, keyFeatures, brand, specs } = data;
  
  const audience = getAudience(category);
  const pricePoint = getPricePoint(price);
  
  // Build description sections
  const intro = `The ${title} is a premium ${category.toLowerCase()} designed for ${audience}.`;
  
  const features = keyFeatures.length > 0
    ? `Key features include ${keyFeatures.slice(0, 3).join(', ')}.`
    : `Built with quality components for reliable performance.`;
  
  const socialProof = rating > 0
    ? `Rated ${rating}/5 stars with ${reviewCount.toLocaleString()} reviews from verified buyers.`
    : `Trusted by audio professionals and enthusiasts worldwide.`;
  
  const specsSection = specs && Object.keys(specs).length > 0
    ? `Specifications: ${Object.entries(specs).slice(0, 4).map(([k, v]) => `${k}: ${v}`).join(', ')}.`
    : '';
  
  const cta = `${pricePoint}. Get the ${title} for $${price.toFixed(2)}.`;
  
  return [intro, features, socialProof, specsSection, cta].filter(Boolean).join(' ');
}

function getAudience(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes('headphone') || cat.includes('iem')) return 'musicians, producers, and audiophiles';
  if (cat.includes('microphone') || cat.includes('mic')) return 'podcasters, streamers, and recording engineers';
  if (cat.includes('monitor') || cat.includes('speaker')) return 'studio professionals and music producers';
  if (cat.includes('mixer') || cat.includes('console')) return 'live sound engineers and studio professionals';
  if (cat.includes('dj')) return 'DJs and electronic music performers';
  if (cat.includes('interface')) return 'home studio owners and recording artists';
  if (cat.includes('turntable') || cat.includes('vinyl')) return 'vinyl enthusiasts and DJs';
  if (cat.includes('keyboard') || cat.includes('synth')) return 'musicians, producers, and composers';
  if (cat.includes('amp')) return 'guitarists and bass players';
  if (cat.includes('pa') || cat.includes('speaker')) return 'event organizers and live sound professionals';
  return 'audio professionals and enthusiasts';
}

function getPricePoint(price: number): string {
  if (price < 50) return 'An affordable option that delivers excellent value';
  if (price < 150) return 'A mid-range option with professional features';
  if (price < 500) return 'A premium choice for serious professionals';
  if (price < 1000) return 'A high-end investment for top-tier performance';
  return 'A flagship product representing the pinnacle of audio engineering';
}
