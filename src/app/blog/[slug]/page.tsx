import posts from '@/data/posts.json';
import BlogPostPage from './ClientPage';

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <BlogPostPage params={params} />;
}
