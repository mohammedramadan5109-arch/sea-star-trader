'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--navy)' }}>
        Search Results for &quot;{query}&quot;
      </h1>
      <p style={{ color: 'var(--slate)' }}>
        Search functionality coming soon...
      </p>
    </div>
  );
}

export default function HelpSearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <p style={{ color: 'var(--slate)' }}>Loading...</p>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}