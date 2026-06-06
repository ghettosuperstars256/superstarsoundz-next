import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Superstar Soundz — Professional Audio Equipment, Reviews & Buying Guides',
    template: '%s | Superstar Soundz',
  },
  description: 'Expert reviews, buying guides, and hand-picked audio gear for musicians, DJs, producers, and audio engineers. Find the best microphones, headphones, studio monitors, and more.',
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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
