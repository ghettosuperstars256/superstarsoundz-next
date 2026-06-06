import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Superstar Soundz — Professional Audio Equipment, Reviews & Buying Guides" />
        <title>Superstar Soundz — Professional Audio Equipment, Reviews & Buying Guides</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
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
