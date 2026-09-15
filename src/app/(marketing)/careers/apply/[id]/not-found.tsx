// src/app/(marketing)/careers/apply/[id]/not-found.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Briefcase } from 'lucide-react';

export default function JobNotFound() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--off-white)' }}
    >
      <div className="text-center px-4">
        <Briefcase className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--slate)' }} />
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
          Job Position Not Found
        </h1>
        <p className="text-xl mb-8" style={{ color: 'var(--slate)' }}>
          This job posting may have been filled or is no longer available.
        </p>
        <Link href="/careers">
          <Button
            size="lg"
            style={{
              backgroundColor: 'var(--orange)',
              color: 'var(--paper)',
            }}
          >
            View All Open Positions
          </Button>
        </Link>
      </div>
    </div>
  );
}