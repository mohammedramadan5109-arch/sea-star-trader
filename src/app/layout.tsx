import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';

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
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}