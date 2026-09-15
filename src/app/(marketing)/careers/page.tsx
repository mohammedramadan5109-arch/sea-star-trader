// src/app/(marketing)/careers/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { CareersHero } from '@/components/careers/CareersHero';
import { Button } from '@/components/ui/Button';
import { 
  Globe2, 
  TrendingUp, 
  Briefcase, 
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Mail,
  Award,
  DollarSign,
  Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers - Build the Future of Global Equipment Trading | SeaStarTrader',
  description: 'Join SeaStarTrader and shape the future of heavy equipment trading across global markets. Explore opportunities in sales, logistics, and technology.',
};

const benefits = [
  {
    icon: DollarSign,
    title: 'Competitive Compensation',
    description: 'Industry-leading salaries with performance-based bonuses up to 30% annually.',
  },
  {
    icon: Globe2,
    title: 'Global Opportunities',
    description: 'Work across our offices in Dubai, Houston, Singapore, London, and more.',
  },
  {
    icon: Award,
    title: 'Career Development',
    description: 'Clear advancement paths with training programs and professional certifications.',
  },
  {
    icon: Shield,
    title: 'Comprehensive Benefits',
    description: 'Health insurance, retirement plans, and relocation assistance for international roles.',
  },
];

const openPositions = [
  {
    id: 'equipment-sales-broker-dubai',
    title: 'Equipment Sales Broker',
    department: 'Sales',
    location: 'Dubai, UAE',
    type: 'Full-time',
    description: 'Lead high-value equipment sales across the MENA region. Manage client relationships and facilitate multi-million dollar transactions.',
    requirements: ['5+ years in equipment sales', 'Proven track record in B2B', 'Arabic language preferred'],
  },
  {
    id: 'logistics-coordinator-houston',
    title: 'Import/Export Coordinator',
    department: 'Logistics',
    location: 'Houston, TX',
    type: 'Full-time',
    description: 'Coordinate international shipping operations for heavy machinery. Handle customs documentation and port logistics.',
    requirements: ['3+ years logistics experience', 'Knowledge of customs regulations', 'Port operations background'],
  },
  {
    id: 'logistics-manager-singapore',
    title: 'Logistics Manager',
    department: 'Operations',
    location: 'Singapore',
    type: 'Full-time',
    description: 'Oversee Asia-Pacific shipping routes and manage relationships with freight partners across the region.',
    requirements: ['7+ years logistics management', 'Experience in heavy equipment', 'Team leadership skills'],
  },
  {
    id: 'backend-engineer-remote',
    title: 'Senior Backend Engineer',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build scalable auction systems and real-time bidding infrastructure. Work with Node.js, PostgreSQL, and modern cloud platforms.',
    requirements: ['5+ years backend development', 'Experience with real-time systems', 'Database optimization skills'],
  },
  {
    id: 'valuation-specialist-london',
    title: 'Equipment Valuation Specialist',
    department: 'Operations',
    location: 'London, UK',
    type: 'Full-time',
    description: 'Conduct technical assessments of construction and mining equipment. Provide accurate market valuations for sellers and buyers.',
    requirements: ['Heavy equipment expertise', 'Certification preferred', '5+ years appraisal experience'],
  },
  {
    id: 'account-manager-perth',
    title: 'Account Manager - Mining Equipment',
    department: 'Sales',
    location: 'Perth, Australia',
    type: 'Full-time',
    description: 'Manage relationships with mining companies throughout Australia. Facilitate equipment procurement and sales.',
    requirements: ['Mining industry background', 'Strong negotiation skills', 'Existing client network preferred'],
  },
];

const departments = ['All Departments', 'Sales', 'Logistics', 'Operations', 'Technology'];
const locations = ['All Locations', 'Dubai', 'Houston', 'Singapore', 'London', 'Perth', 'Remote'];

export default function CareersPage() {
  return (
    <div style={{ backgroundColor: 'var(--paper)' }}>
      <CareersHero />

      {/* Why Join Us */}
      <section className="py-20" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
              Why Join SeaStarTrader
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--slate)' }}>
              Join a global team that's transforming how heavy equipment is bought and sold worldwide. 
              We offer competitive compensation, career growth, and the opportunity to work on high-impact deals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="career-card p-6"
                style={{ 
                  backgroundColor: 'var(--paper)',
                  border: `1px solid var(--line)`
                }}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center mb-4"
                  style={{ 
                    backgroundColor: 'rgba(228, 87, 46, 0.1)',
                  }}
                >
                  <benefit.icon className="h-6 w-6" style={{ color: 'var(--orange)' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
              Open Positions
            </h2>
            <p className="text-xl" style={{ color: 'var(--slate)' }}>
              Explore opportunities across our global offices
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select 
              className="px-4 py-2 text-sm font-medium focus:outline-none"
              style={{
                border: `1px solid var(--line)`,
                backgroundColor: 'var(--paper)',
                color: 'var(--slate)'
              }}
            >
              {departments.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
            
            <select 
              className="px-4 py-2 text-sm font-medium focus:outline-none"
              style={{
                border: `1px solid var(--line)`,
                backgroundColor: 'var(--paper)',
                color: 'var(--slate)'
              }}
            >
              {locations.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {openPositions.map((job) => (
              <div 
                key={job.id}
                className="job-listing p-6"
                style={{
                  border: `1px solid var(--line)`,
                  backgroundColor: 'var(--paper)'
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span 
                        className="px-3 py-1 text-xs font-bold uppercase tracking-wide"
                        style={{
                          backgroundColor: 'rgba(228, 87, 46, 0.1)',
                          color: 'var(--orange)'
                        }}
                      >
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--slate)' }}>
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--slate)' }}>
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                      {job.title}
                    </h3>
                    
                    <p className="leading-relaxed mb-4" style={{ color: 'var(--slate)' }}>
                      {job.description}
                    </p>

                    <div>
                      <p className="text-sm font-semibold mb-2" style={{ color: 'var(--navy)' }}>
                        Key Requirements:
                      </p>
                      <ul className="space-y-1">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--slate)' }}>
                            <span style={{ color: 'var(--orange)' }}>•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link href={`/careers/apply/${job.id}`}>
                    <Button 
                      variant="outline" 
                      className="px-6 py-3 whitespace-nowrap hover:bg-navy-900 hover:text-white"
                      style={{
                        border: `2px solid var(--navy)`,
                        color: 'var(--navy)'
                      }}
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No suitable role CTA */}
          <div 
            className="mt-12 p-8 text-center"
            style={{
              backgroundColor: 'var(--paper)',
              border: `1px solid var(--line)`
            }}
          >
            <Briefcase className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--orange)' }} />
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
              Don't See the Right Role?
            </h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto" style={{ color: 'var(--slate)' }}>
              We're always looking for exceptional talent. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <a href="mailto:careers@seastartrader.com">
              <Button 
                size="lg" 
                className="px-8 py-3"
                style={{
                  backgroundColor: 'var(--orange)',
                  color: 'var(--paper)'
                }}
              >
                <Mail className="mr-2 h-5 w-5" />
                Send Your Resume
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20" style={{ backgroundColor: 'var(--navy)', color: 'var(--paper)' }}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Questions About Working at SeaStarTrader?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--steel-light)' }}>
            Our recruitment team is here to help answer any questions about roles, locations, or the application process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:careers@seastartrader.com">
              <Button 
                size="lg"
                className="px-8 py-3"
                style={{
                  backgroundColor: 'var(--orange)',
                  color: 'var(--paper)'
                }}
              >
                <Mail className="mr-2 h-5 w-5" />
                careers@seastartrader.com
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}