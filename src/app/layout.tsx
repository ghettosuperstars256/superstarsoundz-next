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
    default: 'Superstar Soundz — Audio Equipment & AV Production | Kampala, Uganda',
    template: '%s | Superstar Soundz',
  },
  description: "Kampala's premier audio equipment and AV production company. Professional gear for events, studios, and productions — plus honest reviews, buying guides, and free AI music tools.",
  keywords: ['audio equipment', 'AV production', 'Kampala', 'Uganda', 'live sound', 'studio recording', 'DJ gear', 'microphones', 'studio monitors', 'PA systems', 'event production'],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Superstar Soundz — Audio Equipment & AV Production | Kampala, Uganda',
    description: "Kampala's premier audio equipment and AV production company.",
    url: 'https://superstarsoundz.com',
    siteName: 'Superstar Soundz',
    type: 'website',
    images: [{ url: '/images/og-default.svg', width: 1200, height: 630, type: 'image/svg+xml' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Superstar Soundz — Audio Equipment & AV Production',
    description: "Kampala's premier audio equipment and AV production company.",
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
              '@type': 'LocalBusiness',
              name: 'Superstar Soundz',
              alternateName: 'SSZ',
              url: 'https://superstarsoundz.com',
              logo: 'https://superstarsoundz.com/favicon.svg',
              description: "Kampala's premier audio equipment and AV production company — supplying gear, running events, and sharing expert knowledge.",
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kampala',
                addressCountry: 'UG',
              },
              telephone: '+256741669338',
              priceRange: '$$',
              sameAs: [
                'https://twitter.com/superstarsoundz',
              ],
              knowsAbout: ['Audio Equipment', 'AV Production', 'Live Sound', 'Studio Recording', 'DJ Equipment', 'Music Production'],
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
