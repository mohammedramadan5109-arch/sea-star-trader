'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--paper)' }}>
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold mb-4" style={{ color: 'var(--navy)' }}>
          Oops!
        </h1>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--slate)' }}>
          Something went wrong
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--slate)' }}>
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 text-sm font-semibold rounded-sm"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 text-sm font-semibold rounded-sm border"
            style={{ borderColor: 'var(--line)', color: 'var(--navy)' }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}