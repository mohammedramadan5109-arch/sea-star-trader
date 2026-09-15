
'use client';

import { useSearchParams } from 'next/navigation';

export default function HelpSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-navy-900">
        Search Results for "{query}"
      </h1>
      {/* Search results here */}
    </div>
  );
}