export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
  sessionVersion: number; // Increment to invalidate all sessions
}

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  exp: number;
  sessionVersion: number;
}

export interface ScrapedProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  source: string;
  sourceUrl: string;
  affiliateUrl: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specs: Record<string, string>;
  scrapedAt: string;
  campaignId: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
}

export interface CampaignSettings {
  autoPublish: boolean;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  requireImage: boolean;
  spinContent: boolean;
  categoryMap: Record<string, string>;
  autoAffiliate: boolean;
  deduplicate: boolean;
  imageRequired: boolean;
}

export const DEFAULT_CAMPAIGN_SETTINGS: CampaignSettings = {
  autoPublish: false,
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  requireImage: true,
  spinContent: false,
  categoryMap: {},
  autoAffiliate: true,
  deduplicate: true,
  imageRequired: true,
};

export interface Campaign {
  id: string;
  name: string;
  type: string;
  keywords: string[];
  category: string;
  affiliateCode: string;
  maxResults: number;
  schedule: string;
  isActive: boolean;
  lastRun: string | null;
  nextRun: string | null;
  totalScraped: number;
  totalPublished: number;
  settings: CampaignSettings;
  createdAt: string;
}
