// Category mapping rules — maps scraped categories/keywords to your site categories
export interface CategoryMapping {
  id: string;
  name: string;
  keywords: string[];
  aliases: string[];
  parentId?: string;
  affiliateCode?: string;
}

export const DEFAULT_CATEGORY_MAPPINGS: CategoryMapping[] = [
  {
    id: 'cat_headphones',
    name: 'Headphones and IEMs',
    keywords: ['headphone', 'headphones', 'earphone', 'earphones', 'iem', 'iems', 'in-ear', 'over-ear', 'on-ear', 'earbud', 'earbuds'],
    aliases: ['audio headphones', 'studio headphones', 'dj headphones', 'monitoring headphones'],
  },
  {
    id: 'cat_microphones',
    name: 'Microphones',
    keywords: ['microphone', 'microphones', 'mic', 'mics', 'condenser mic', 'dynamic mic', 'ribbon mic', 'usb mic', 'xlr mic'],
    aliases: ['studio mic', 'vocal mic', 'podcast mic', 'recording microphone'],
  },
  {
    id: 'cat_studio_monitors',
    name: 'Studio Monitors',
    keywords: ['studio monitor', 'studio monitors', 'monitor speaker', 'reference monitor', 'nearfield monitor', 'bookshelf speaker'],
    aliases: ['active monitor', 'powered monitor', 'studio speaker'],
  },
  {
    id: 'cat_mixers',
    name: 'Mixers',
    keywords: ['mixer', 'mixers', 'mixing console', 'audio mixer', 'digital mixer', 'analog mixer', 'dj mixer'],
    aliases: ['sound board', 'audio console', 'mixing desk'],
  },
  {
    id: 'cat_dj_controllers',
    name: 'DJ Controllers',
    keywords: ['dj controller', 'dj controllers', 'dj mixer', 'turntable', 'turntables', 'cdj', 'deck', 'decks'],
    aliases: ['dj gear', 'dj equipment', 'controller midi dj'],
  },
  {
    id: 'cat_audio_interfaces',
    name: 'Audio Interfaces',
    keywords: ['audio interface', 'audio interfaces', 'sound card', 'usb interface', 'firewire interface', 'thunderbolt interface'],
    aliases: ['recording interface', 'dac', 'adc', 'preamp interface'],
  },
  {
    id: 'cat_pa_systems',
    name: 'PA Systems',
    keywords: ['pa system', 'pa systems', 'speaker', 'speakers', 'loudspeaker', 'subwoofer', 'sub', 'amplifier', 'amp', 'power amp'],
    aliases: ['public address', 'live sound', 'powered speaker', 'passive speaker'],
  },
  {
    id: 'cat_turntables',
    name: 'Turntables',
    keywords: ['turntable', 'turntables', 'record player', 'vinyl player', 'phonograph'],
    aliases: ['direct drive', 'belt drive', 'manual turntable'],
  },
  {
    id: 'cat_keyboards',
    name: 'Keyboards and Synthesizers',
    keywords: ['keyboard', 'keyboards', 'synthesizer', 'synth', 'midi keyboard', 'piano', 'digital piano', 'workstation'],
    aliases: ['midi controller', 'synth keyboard', 'production keyboard'],
  },
  {
    id: 'cat_guitar_amps',
    name: 'Guitar Amps',
    keywords: ['guitar amp', 'guitar amplifier', 'amp head', 'amp combo', 'tube amp', 'solid state amp', 'modeling amp'],
    aliases: ['electric amp', 'bass amp', 'amp head'],
  },
];

// Auto-map a product to a site category based on title, description, and keywords
export function mapProductCategory(
  title: string,
  description: string,
  sourceCategory: string,
  mappings: CategoryMapping[] = DEFAULT_CATEGORY_MAPPINGS
): { categoryId: string; categoryName: string; confidence: number } {
  const text = `${title} ${description} ${sourceCategory}`.toLowerCase();
  
  let bestMatch = { categoryId: '', categoryName: '', confidence: 0 };
  
  for (const mapping of DEFAULT_CATEGORY_MAPPINGS) {
    let score = 0;
    
    // Check keywords
    for (const keyword of mapping.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += 10;
        // Exact word boundary match gets bonus
        const regex = new RegExp(`\\b${keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
        if (regex.test(text)) {
          score += 5;
        }
      }
    }
    
    // Check aliases
    for (const alias of mapping.aliases) {
      if (text.includes(alias.toLowerCase())) {
        score += 7;
      }
    }
    
    // Name exact match gets high score
    if (text.includes(mapping.name.toLowerCase())) {
      score += 15;
    }
    
    if (score > bestMatch.confidence) {
      bestMatch = {
        categoryId: mapping.id,
        categoryName: mapping.name,
        confidence: score,
      };
    }
  }
  
  return bestMatch;
}

// Map a batch of products
export function batchMapCategories(
  products: { title: string; description: string; category: string }[]
): Map<string, { categoryId: string; categoryName: string; confidence: number }> {
  const results = new Map();
  for (const product of products) {
    const mapping = mapProductCategory(product.title, product.description, product.category);
    results.set(product.title, mapping);
  }
  return results;
}
