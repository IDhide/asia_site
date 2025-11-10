'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BackgroundParallax } from '@/components/BackgroundParallax';
import { DataProvider } from '@/contexts/DataContext';
import '@/styles/globals.scss';
import '@/styles/fonts.css';
import './layout.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Асия — Официальный сайт</title>
        <meta name="description" content="Официальный сайт артистки Асия: новые треки, расписание концертов, мерч, контакты" />
        <link rel="icon" href="/assets/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/assets/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/favicon/favicon-96x96.png" />
      </head>
      <body>
        <DataProvider>
          {/* Interactive parallax background */}
          <BackgroundParallax isBlurred={!isHomePage} />
          <div className="global-overlay" />

          {/* Persistent header */}
          <Header />

          {/* Page content */}
          <main className="page-content">
            {children}
          </main>

          {/* Persistent footer */}
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}
