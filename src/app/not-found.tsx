import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--paper)' }}>
      <div className="text-center">
        <h1 className="text-6xl font-extrabold mb-4" style={{ color: 'var(--navy)' }}>
          404
        </h1>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--slate)' }}>
          Page not found
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--slate)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-sm font-semibold rounded-sm"
          style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}