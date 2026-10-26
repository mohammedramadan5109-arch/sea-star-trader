import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// /listings sits outside the (marketing) group, so it gets its own shell —
// same Header (Sea Star Trader name + full navigation) and Footer.
export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: 'var(--paper)' }}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
