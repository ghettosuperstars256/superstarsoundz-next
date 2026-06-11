import './globals.css';
import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#08080a',
};

export const metadata: Metadata = {
  title: {
    default: 'Superstar Soundz — Professional Audio Equipment, Reviews & Blog',
    template: '%s | Superstar Soundz',
  },
  description: 'Expert reviews and hand-picked audio gear for musicians, DJs, producers, and audio engineers. Find the best microphones, headphones, studio monitors, and more.',
  keywords: ['audio equipment', 'studio gear', 'microphones', 'headphones', 'DJ controllers', 'studio monitors', 'buying guides', 'music production'],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Superstar Soundz — Professional Audio Equipment',
    description: 'Expert reviews and curated gear for audio professionals',
    url: 'https://superstarsoundz.com',
    siteName: 'Superstar Soundz',
    type: 'website',
    images: [{ url: '/images/og-default.svg', width: 1200, height: 630, type: 'image/svg+xml' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Superstar Soundz — Professional Audio Equipment',
    description: 'Expert reviews and curated gear for audio professionals',
  },
  alternates: {
    canonical: 'https://superstarsoundz.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Superstar Soundz',
              alternateName: 'SSZ',
              url: 'https://superstarsoundz.com',
              logo: 'https://superstarsoundz.com/favicon.svg',
              description: 'Expert audio gear reviews, buying guides, free AI music tools, and professional AV production services.',
              sameAs: [
                'https://twitter.com/superstarsoundz',
              ],
            }),
          }}
        />
      </head>
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
