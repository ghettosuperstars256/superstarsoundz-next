import posts from '@/data/posts.json';

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}
