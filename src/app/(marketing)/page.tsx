import { Hero } from '@/components/home/Hero';
import { TrustBar } from '@/components/home/TrustBar';
import { LatestEquipmentBento } from '@/components/home/LatestEquipmentBento';
import { SellEquipmentTeaser } from '@/components/home/SellEquipmentTeaser';
import { TalkToExpertBanner } from '@/components/home/TalkToExpertBanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <LatestEquipmentBento />
      <SellEquipmentTeaser />
      <TalkToExpertBanner />
    </>
  );
}