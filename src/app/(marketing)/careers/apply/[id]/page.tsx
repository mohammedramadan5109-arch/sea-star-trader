
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JobApplicationForm } from '@/components/careers/JobApplicationForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const jobPositions: Record<string, {
  title: string;
  department: string;
  location: string;
  type: string;
}> = {
  'equipment-sales-broker-dubai': {
    title: 'Equipment Sales Broker',
    department: 'Sales',
    location: 'Dubai, UAE',
    type: 'Full-time',
  },
  'logistics-coordinator-houston': {
    title: 'Import/Export Coordinator',
    department: 'Logistics',
    location: 'Houston, TX',
    type: 'Full-time',
  },
  'logistics-manager-singapore': {
    title: 'Logistics Manager',
    department: 'Operations',
    location: 'Singapore',
    type: 'Full-time',
  },
  'backend-engineer-remote': {
    title: 'Senior Backend Engineer',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-time',
  },
  'valuation-specialist-london': {
    title: 'Equipment Valuation Specialist',
    department: 'Operations',
    location: 'London, UK',
    type: 'Full-time',
  },
  'account-manager-perth': {
    title: 'Account Manager - Mining Equipment',
    department: 'Sales',
    location: 'Perth, Australia',
    type: 'Full-time',
  },
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const job = jobPositions[params.id];
  
  if (!job) {
    return {
      title: 'Job Not Found - SeaStarTrader',
    };
  }

  return {
    title: `Apply for ${job.title} - SeaStarTrader Careers`,
    description: `Submit your application for ${job.title} position in ${job.location}.`,
  };
}

export default function JobApplicationPage({ params }: { params: { id: string } }) {
  const job = jobPositions[params.id];

  if (!job) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: 'var(--off-white)', minHeight: '100vh' }}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          href="/careers"
          className="inline-flex items-center gap-2 mb-8 hover:underline"
          style={{ color: 'var(--slate)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Careers
        </Link>

        <div 
          className="p-8 mb-8"
          style={{
            backgroundColor: 'var(--paper)',
            border: `1px solid var(--line)`
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <span 
                className="px-3 py-1 text-xs font-bold uppercase tracking-wide inline-block mb-3"
                style={{
                  backgroundColor: 'rgba(228, 87, 46, 0.1)',
                  color: 'var(--orange)'
                }}
              >
                {job.department}
              </span>
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
                {job.title}
              </h1>
              <p className="text-lg" style={{ color: 'var(--slate)' }}>
                {job.location} • {job.type}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-8"
          style={{
            backgroundColor: 'var(--paper)',
            border: `1px solid var(--line)`
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
            Application Form
          </h2>
          <JobApplicationForm jobId={params.id} jobTitle={job.title} />
        </div>
      </div>
    </div>
  );
}