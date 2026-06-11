import pagesData from '@/data/pages.json';

interface Props {
  params: Promise<{ slug: string }>;
}

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
}

const pages: Record<string, PageData> = pagesData as unknown as Record<string, PageData>;

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) {
    return (
      <div className="section">
        <div className="container">
          <h1>Page Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{page.title}</h1>
        </div>
        <div className="prose" dangerouslySetInnerHTML={{ __html: page.content.replace(/<h1[^>]*>.*?<\/h1>/gi, '') }} />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { slug: 'privacy-policy' },
    { slug: 'terms-of-service' },
    { slug: 'affiliate-disclosure' },
  ];
}
