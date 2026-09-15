// src/app/(marketing)/press/page.tsx

// src/app/(marketing)/press/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Newspaper,
  Calendar,
  Download,
  ExternalLink,
  Mail,
  FileText,
  Image as ImageIcon,
  Globe2,
  TrendingUp,
  Users,
  Building2,
  ArrowRight,
  Quote
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press & Media - SeaStarTrader',
  description: 'Latest news, press releases, and media resources from SeaStarTrader, the global heavy equipment marketplace.',
};

const pressReleases = [
  {
    id: 1,
    title: 'SeaStarTrader Expands Operations to Middle East with New Dubai Headquarters',
    date: '2025-01-15',
    category: 'Expansion',
    summary: 'Global heavy equipment marketplace SeaStarTrader announces the opening of its regional headquarters in Dubai, UAE, strengthening its presence in the MENA region and facilitating $500M+ in annual equipment trade.',
    link: '/press/releases/dubai-expansion-2025',
  },
  {
    id: 2,
    title: 'Platform Surpasses $2 Billion in Equipment Transactions Across 50+ Countries',
    date: '2024-12-10',
    category: 'Milestone',
    summary: 'SeaStarTrader reaches major milestone with over $2B in heavy equipment sales facilitated globally, connecting buyers and sellers across construction, mining, and logistics sectors.',
    link: '/press/releases/2b-milestone-2024',
  },
  {
    id: 3,
    title: 'SeaStarTrader Partners with Maersk for Integrated Equipment Shipping Solutions',
    date: '2024-11-22',
    category: 'Partnership',
    summary: 'Strategic partnership with global shipping leader Maersk to provide seamless logistics and container shipping for heavy equipment buyers worldwide.',
    link: '/press/releases/maersk-partnership-2024',
  },
  {
    id: 4,
    title: 'Launch of Real-Time Auction Platform with Live Bidding for Heavy Machinery',
    date: '2024-10-08',
    category: 'Product',
    summary: 'SeaStarTrader introduces advanced auction technology enabling real-time bidding on excavators, cranes, loaders, and mining equipment across global markets.',
    link: '/press/releases/auction-platform-launch-2024',
  },
  {
    id: 5,
    title: 'Company Secures $50M Series B to Accelerate Global Expansion',
    date: '2024-09-15',
    category: 'Funding',
    summary: 'SeaStarTrader raises $50 million in Series B funding led by industry investors to expand operations in Asia-Pacific and Latin America.',
    link: '/press/releases/series-b-funding-2024',
  },
];

const companyNews = [
  {
    date: '2025-01-20',
    title: `SeaStarTrader Named to Fast Company's Most Innovative Companies 2025`,
    excerpt: 'Recognized for transforming heavy equipment trade through technology and global logistics.',
  },
  {
    date: '2024-12-15',
    title: 'New Financing Program Launched for Equipment Buyers',
    excerpt: 'Partnership with international lenders enables flexible payment terms up to $5M.',
  },
  {
    date: '2024-11-30',
    title: 'Platform Adds 20,000+ Verified Equipment Listings',
    excerpt: 'Inventory expansion includes excavators, cranes, loaders across all major brands.',
  },
];

const mediaAssets = [
  {
    icon: ImageIcon,
    title: 'Company Logos',
    description: 'High-resolution logos in PNG, SVG, and AI formats',
    files: ['Logo - Dark Background', 'Logo - Light Background', 'Logo - Monochrome'],
    size: '2.4 MB',
  },
  {
    icon: FileText,
    title: 'Brand Guidelines',
    description: 'Complete brand style guide and visual identity standards',
    files: ['Brand Manual PDF', 'Color Palette', 'Typography Guide'],
    size: '8.1 MB',
  },
  {
    icon: Users,
    title: 'Leadership Photos',
    description: 'Executive team headshots and company photography',
    files: ['Executive Photos', 'Office Locations', 'Operations'],
    size: '12.3 MB',
  },
  {
    icon: FileText,
    title: 'Company Fact Sheet',
    description: 'Key statistics, market data, and company overview',
    files: ['Fact Sheet PDF', 'Company Timeline', 'Market Data'],
    size: '1.8 MB',
  },
];

const companyStats = [
  { value: '$2B+', label: 'Annual Transaction Volume' },
  { value: '50+', label: 'Countries Served' },
  { value: '15', label: 'Global Offices' },
  { value: '200+', label: 'Team Members' },
];

const featuredMentions = [
  {
    publication: 'Financial Times',
    quote: 'SeaStarTrader is bringing transparency and efficiency to the $100B global heavy equipment market.',
    date: 'December 2024',
  },
  {
    publication: 'Reuters',
    quote: 'A digital transformation leader in industrial equipment trading.',
    date: 'November 2024',
  },
  {
    publication: 'Bloomberg',
    quote: 'The platform is reshaping how construction and mining companies source machinery globally.',
    date: 'October 2024',
  },
];

export default function PressPage() {
  return (
    <div style={{ backgroundColor: 'var(--paper)' }}>
      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--navy)', color: 'var(--paper)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Newspaper className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--orange)' }} />
            
            <h1 className="text-5xl font-bold mb-6">
              Press & Media
            </h1>
            
            <p className="text-xl mb-10" style={{ color: 'var(--steel-light)' }}>
              Latest news, announcements, and company updates from SeaStarTrader
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="#press-releases">
                <Button 
                  size="lg"
                  className="px-8 py-4"
                  style={{
                    backgroundColor: 'var(--orange)',
                    color: 'var(--paper)'
                  }}
                >
                  View Press Releases
                </Button>
              </a>
              
              <a href="#media-kit">
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 hover:bg-white hover:text-navy-900"
                  style={{
                    border: `2px solid var(--paper)`,
                    color: 'var(--paper)',
                    backgroundColor: 'transparent'
                  }}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Media Kit
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats Bar */}
      <section style={{ backgroundColor: 'var(--off-white)', borderTop: `2px solid var(--line)`, borderBottom: `2px solid var(--line)` }}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--orange)' }}>
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wide font-semibold" style={{ color: 'var(--slate)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section id="press-releases" className="py-20" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                  Press Releases
                </h2>
                <p className="text-xl" style={{ color: 'var(--slate)' }}>
                  Official company announcements and news
                </p>
              </div>
              
              <Button 
                variant="outline"
                className="hidden md:flex hover:bg-navy-900 hover:text-white"
                style={{
                  border: `2px solid var(--navy)`,
                  color: 'var(--navy)'
                }}
              >
                Subscribe to Updates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {pressReleases.map((release) => (
                <div
                  key={release.id}
                  className="press-release p-8"
                  style={{
                    border: `2px solid var(--line)`,
                    backgroundColor: 'var(--paper)'
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span 
                          className="px-3 py-1 text-sm font-bold uppercase tracking-wide"
                          style={{
                            backgroundColor: 'rgba(228, 87, 46, 0.1)',
                            color: 'var(--orange)'
                          }}
                        >
                          {release.category}
                        </span>
                        <span className="flex items-center gap-2" style={{ color: 'var(--slate)' }}>
                          <Calendar className="h-4 w-4" />
                          {new Date(release.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                        {release.title}
                      </h3>

                      <p className="leading-relaxed text-lg mb-6" style={{ color: 'var(--slate)' }}>
                        {release.summary}
                      </p>

                      <Link href={release.link}>
                        <Button 
                          variant="outline"
                          className="hover:bg-navy-900 hover:text-white"
                          style={{
                            border: `2px solid var(--navy)`,
                            color: 'var(--navy)'
                          }}
                        >
                          Read Full Release
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company News */}
      <section className="py-20" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
              Company News
            </h2>
            <p className="text-xl mb-12" style={{ color: 'var(--slate)' }}>
              Recent updates and announcements
            </p>

            <div className="space-y-4">
              {companyNews.map((news, index) => (
                <div
                  key={index}
                  className="p-6"
                  style={{
                    backgroundColor: 'var(--paper)',
                    borderLeft: `4px solid var(--orange)`
                  }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 text-center">
                      <div className="text-sm font-semibold" style={{ color: 'var(--slate)' }}>
                        {new Date(news.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
                        {new Date(news.date).getDate()}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--slate)' }}>
                        {new Date(news.date).getFullYear()}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
                        {news.title}
                      </h3>
                      <p className="leading-relaxed" style={{ color: 'var(--slate)' }}>
                        {news.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section id="media-kit" className="py-20" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
                Media Kit
              </h2>
              <p className="text-xl" style={{ color: 'var(--slate)' }}>
                Download logos, brand assets, and company information
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {mediaAssets.map((asset, index) => (
                <div
                  key={index}
                  className="p-8"
                  style={{
                    border: `2px solid var(--line)`,
                    backgroundColor: 'var(--paper)'
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div 
                      className="w-14 h-14 flex items-center justify-center"
                      style={{ backgroundColor: 'var(--orange)' }}
                    >
                      <asset.icon className="h-7 w-7" style={{ color: 'var(--paper)' }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--slate)' }}>
                      {asset.size}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                    {asset.title}
                  </h3>

                  <p className="mb-6 leading-relaxed" style={{ color: 'var(--slate)' }}>
                    {asset.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {asset.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="flex items-center gap-2 text-sm" style={{ color: 'var(--slate)' }}>
                        <FileText className="h-4 w-4" style={{ color: 'var(--orange)' }} />
                        {file}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full hover:bg-navy-900 hover:text-white"
                    style={{
                      border: `2px solid var(--navy)`,
                      color: 'var(--navy)'
                    }}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-12 text-center" style={{ backgroundColor: 'var(--navy)', color: 'var(--paper)' }}>
              <Download className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--orange)' }} />
              <h3 className="text-3xl font-bold mb-4">
                Complete Media Kit
              </h3>
              <p className="text-xl mb-8" style={{ color: 'var(--steel-light)' }}>
                Download all brand assets, logos, and company materials in one package
              </p>
              <Button
                size="lg"
                className="px-10 py-4"
                style={{
                  backgroundColor: 'var(--orange)',
                  color: 'var(--paper)'
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Full Media Kit (24.6 MB)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About SeaStarTrader */}
      <section className="py-20" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--navy)' }}>
              About SeaStarTrader
            </h2>

            <div className="p-12" style={{ backgroundColor: 'var(--paper)', border: `2px solid var(--line)` }}>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--slate)' }}>
                <strong style={{ color: 'var(--navy)' }}>SeaStarTrader</strong> is the leading global marketplace 
                for heavy equipment trading, connecting buyers and sellers across construction, mining, 
                and logistics industries in over 50 countries.
              </p>

              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--slate)' }}>
                Founded in 2020, the platform has facilitated over <strong style={{ color: 'var(--orange)' }}>$2 billion</strong> in 
                equipment transactions, ranging from excavators and cranes to mining trucks and specialized 
                industrial machinery. With operations spanning North America, Europe, Middle East, Asia-Pacific, 
                and Latin America, SeaStarTrader provides end-to-end solutions including equipment verification, 
                international shipping, customs clearance, financing, and secure payment processing.
              </p>

              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--slate)' }}>
                The company&apos;s technology platform enables real-time auctions, transparent pricing, 
                and comprehensive logistics coordination, making international heavy equipment trade 
                accessible, efficient, and secure for businesses of all sizes.
              </p>

              <div className="grid md:grid-cols-3 gap-8 pt-8" style={{ borderTop: `2px solid var(--line)` }}>
                <div className="text-center">
                  <Globe2 className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--orange)' }} />
                  <div className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>50+</div>
                  <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--slate)' }}>Countries</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--orange)' }} />
                  <div className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>$2B+</div>
                  <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--slate)' }}>Traded Volume</div>
                </div>
                <div className="text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--orange)' }} />
                  <div className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>15</div>
                  <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--slate)' }}>Global Offices</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Mentions */}
      <section className="py-20" style={{ backgroundColor: 'var(--navy)', color: 'var(--paper)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Featured In
              </h2>
              <p className="text-xl" style={{ color: 'var(--steel-light)' }}>
                What leading publications are saying about SeaStarTrader
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredMentions.map((mention, index) => (
                <div
                  key={index}
                  className="p-8"
                  style={{ backgroundColor: 'var(--slate)' }}
                >
                  <Quote className="h-12 w-12 mb-6" style={{ color: 'var(--orange)' }} />
                  
                  <p className="text-lg mb-6 leading-relaxed italic" style={{ color: 'var(--paper)' }}>
                    &quot;{mention.quote}&quot;
                  </p>

                  <div className="pt-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <div className="font-bold text-lg mb-1" style={{ color: 'var(--orange)' }}>
                      {mention.publication}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--steel-light)' }}>
                      {mention.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-20" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--orange)' }} />
            
            <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
              Press Contact
            </h2>

            <p className="text-xl mb-8" style={{ color: 'var(--slate)' }}>
              For media inquiries, interview requests, or additional information
            </p>

            <div className="p-12 mb-8" style={{ backgroundColor: 'var(--off-white)', border: `2px solid var(--line)` }}>
              <div className="mb-6">
                <div className="text-sm uppercase tracking-wide font-semibold mb-2" style={{ color: 'var(--slate)' }}>
                  Media Relations
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)' }}>
                  Sarah Mitchell
                </div>
                <div style={{ color: 'var(--slate)' }}>
                  Director of Corporate Communications
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5" style={{ color: 'var(--orange)' }} />
                  <a 
                    href="mailto:press@seastartrader.com"
                    className="text-lg font-semibold hover:underline"
                    style={{ color: 'var(--orange)' }}
                  >
                    press@seastartrader.com
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="px-10 py-4"
                  style={{
                    backgroundColor: 'var(--orange)',
                    color: 'var(--paper)'
                  }}
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <a href="#media-kit">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-4 hover:bg-navy-900 hover:text-white"
                  style={{
                    border: `2px solid var(--navy)`,
                    color: 'var(--navy)'
                  }}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Media Kit
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}