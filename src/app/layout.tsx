import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'SeaStarTrader — Buy & Sell Heavy Equipment Globally',
  description: 'Transparent, full-service marketplace for construction, agriculture, and marine equipment. Auctions, fixed price, private sales.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={cairo.variable}>
        <QueryProvider>
          <LanguageProvider>
            {children}
            <Toaster position="bottom-right" />
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
