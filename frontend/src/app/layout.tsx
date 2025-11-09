import type { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DataProvider } from '@/contexts/DataContext';
import '@/styles/globals.scss';
import '@/styles/fonts.css';
import './layout.scss';

export const metadata: Metadata = {
  title: 'Асия — Официальный сайт',
  description: 'Официальный сайт артистки Асия: новые треки, расписание концертов, мерч, контакты',
  keywords: ['Асия', 'музыка', 'треки', 'концерты', 'мерч'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <DataProvider>
          {/* Global background - persists across all pages */}
          <div className="global-background">
            <Image
              src="/assets/main/hero2.png"
              alt=""
              fill
              priority
              style={{ objectFit: 'cover' }}
              quality={90}
            />
          </div>
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
