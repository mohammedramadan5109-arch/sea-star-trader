// src/app/(marketing)/press/releases/[slug]/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press Release - SeaStarTrader',
};

export default function PressReleasePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link 
        href="/press" 
        className="inline-flex items-center gap-2 mb-8 hover:underline"
        style={{ color: 'var(--slate)' }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Press
      </Link>
      
      <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--navy)' }}>
        Press Release Title
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <p style={{ color: 'var(--slate)' }}>
          Full press release content here...
        </p>
      </div>
    </div>
  );
}