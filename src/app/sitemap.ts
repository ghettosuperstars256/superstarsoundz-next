import products from '@/data/products.json';
import posts from '@/data/posts.json';
import productCategories from '@/data/product-categories.json';

export default function sitemap() {
  const baseUrl = 'https://superstarsoundz.com';
  const now = new Date().toISOString();

  const staticRoutes = [
    { url: baseUrl, lastModified: now },
    { url: `${baseUrl}/gear`, lastModified: now },
    { url: `${baseUrl}/blog`, lastModified: now },
    { url: `${baseUrl}/about`, lastModified: now },
    { url: `${baseUrl}/services`, lastModified: now },
    { url: `${baseUrl}/deals`, lastModified: now },
    { url: `${baseUrl}/contact`, lastModified: now },
  ];

  const categoryRoutes = productCategories.map(c => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: now,
  }));

  const productRoutes = products.map(p => ({
    url: `${baseUrl}/gear/${p.slug}`,
    lastModified: now,
  }));

  const blogRoutes = posts.map(p => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.date,
  }));

  const legalPages = ['privacy-policy', 'terms-of-service', 'affiliate-disclosure'];
  const legalRoutes = legalPages.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes, ...legalRoutes];
}
