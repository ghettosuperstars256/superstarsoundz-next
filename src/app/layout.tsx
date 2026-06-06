import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: 'Superstar Soundz — Professional Audio Equipment, Reviews & Buying Guides',
  description: 'Honest buying guides, expert reviews, and the best prices on studio monitors, headphones, DJ gear, and pro audio equipment.',
  openGraph: {
    title: 'Superstar Soundz — Professional Audio Equipment',
    description: 'Honest buying guides, expert reviews, and the best prices on studio monitors, headphones, DJ gear, and pro audio equipment.',
    type: 'website',
    siteName: 'Superstar Soundz',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
