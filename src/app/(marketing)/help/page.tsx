// src/app/(marketing)/help/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Search,
  ShoppingCart,
  Tag,
  Gavel,
  CreditCard,
  Ship,
  Shield,
  FileText,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  ArrowRight,
  Book,
  Download,
  Video,
  HelpCircle
} from 'lucide-react';

const helpCategories = [
  {
    icon: ShoppingCart,
    title: 'Buying Equipment',
    description: 'Browse listings, request quotes, and complete purchases',
    color: '#3b82f6',
    link: '#buying',
    topics: 5,
  },
  {
    icon: Tag,
    title: 'Selling Equipment',
    description: 'List your machinery, get valuations, and manage sales',
    color: '#10b981',
    link: '#selling',
    topics: 7,
  },
  {
    icon: Gavel,
    title: 'Auctions & Bidding',
    description: 'Participate in live auctions and place competitive bids',
    color: '#8b5cf6',
    link: '#auctions',
    topics: 6,
  },
  {
    icon: CreditCard,
    title: 'Payments & Financing',
    description: 'Payment methods, invoicing, and financing options',
    color: 'var(--orange)',
    link: '#payments',
    topics: 4,
  },
  {
    icon: Ship,
    title: 'Shipping & Logistics',
    description: 'International shipping, customs, and delivery tracking',
    color: '#06b6d4',
    link: '#shipping',
    topics: 8,
  },
  {
    icon: Shield,
    title: 'Account & Security',
    description: 'Profile settings, verification, and account security',
    color: '#ef4444',
    link: '#account',
    topics: 5,
  },
];

const popularQuestions = [
  {
    category: 'Buying',
    question: 'How do I purchase equipment on SeaStarTrader?',
    answer: 'You can purchase equipment through three methods: 1) Direct purchase from fixed-price listings, 2) Winning an auction bid, or 3) Requesting a private quote from sellers. After selecting equipment, complete verification, agree to terms, and submit payment through our secure platform.',
  },
  {
    category: 'Auctions',
    question: 'How does the bidding process work?',
    answer: 'To participate in auctions: 1) Complete identity verification and get bidding access approved, 2) Review auction details and equipment condition reports, 3) Place bids during the live auction window, 4) Highest bidder at auction close wins. You\'ll receive instant notifications if outbid.',
  },
  {
    category: 'Shipping',
    question: 'How do I arrange international shipping?',
    answer: 'SeaStarTrader partners with global freight forwarders. After purchase: 1) We provide shipping quotes from verified carriers, 2) Choose your preferred shipping method (container, RoRo, flat rack), 3) Our logistics team handles documentation, customs clearance, and tracking. Shipping typically takes 15-45 days depending on destination.',
  },
  {
    category: 'Payments',
    question: 'What payment methods are accepted?',
    answer: 'We accept: Wire transfer (most common for high-value equipment), Letter of Credit (L/C) for international deals, Credit card (up to $50,000), and ACH/Bank transfer. Financing options available through our partner lenders for qualified buyers.',
  },
  {
    category: 'Selling',
    question: 'How do I list equipment for sale?',
    answer: 'Submit equipment through our "Sell Equipment" form with photos, specifications, and condition details. Our team reviews submissions within 48 hours. Approved listings appear in search results or are scheduled for auction. You receive notifications for inquiries and bids.',
  },
  {
    category: 'Verification',
    question: 'Why do I need to verify my account?',
    answer: 'Verification ensures secure, legitimate transactions. Required documents include: Business registration, Tax ID, Proof of identity (passport/ID), and Proof of address. This protects both buyers and sellers from fraud and meets international trade compliance requirements.',
  },
];

const guides = [
  {
    icon: Book,
    title: 'Complete Buyer\'s Guide',
    description: 'Step-by-step process from browsing to delivery',
    duration: '15 min read',
  },
  {
    icon: FileText,
    title: 'How to Import Heavy Equipment',
    description: 'Documentation, customs, and compliance requirements',
    duration: '12 min read',
  },
  {
    icon: Video,
    title: 'Auction Participation Tutorial',
    description: 'Video walkthrough of bidding process',
    duration: '8 min video',
  },
  {
    icon: Download,
    title: 'Seller\'s Handbook (PDF)',
    description: 'Complete guide to listing and selling equipment',
    duration: 'PDF Download',
  },
];

const contactOptions = [
  {
    icon: Phone,
    title: 'Phone Support',
    description: '+1 (888) 555-0199',
    hours: 'Mon-Fri: 8am-8pm EST',
    action: 'Call Now',
    link: 'tel:+18885550199',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'support@seastartrader.com',
    hours: 'Response within 24 hours',
    action: 'Send Email',
    link: 'mailto:support@seastartrader.com',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with support team',
    hours: 'Mon-Fri: 9am-6pm EST',
    action: 'Start Chat',
    link: '#chat',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  const filteredQuestions = searchQuery
    ? popularQuestions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularQuestions;

  return (
    <div style={{ backgroundColor: 'var(--paper)' }}>
      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--navy)', color: 'var(--paper)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6" style={{ color: 'var(--orange)' }} />
            
            <h1 className="text-5xl font-bold mb-6">
              How Can We Help You?
            </h1>
            
            <p className="text-xl mb-10" style={{ color: 'var(--steel-light)' }}>
              Search our knowledge base or browse by category
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search 
                className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
                style={{ color: 'var(--slate)' }}
              />
              <input
                type="text"
                placeholder="Search equipment, orders, shipping, or support..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-5 text-lg focus:outline-none"
                style={{
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink)',
                  border: `2px solid var(--line)`
                }}
              />
            </div>

            {/* Quick Stats */}
            <div 
              className="grid grid-cols-3 gap-6 mt-10 pt-10"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--orange)' }}>150+</div>
                <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--steel-light)' }}>
                  Help Articles
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--orange)' }}>&lt;2 hrs</div>
                <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--steel-light)' }}>
                  Avg Response Time
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--orange)' }}>24/7</div>
                <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--steel-light)' }}>
                  Support Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
              Browse by Category
            </h2>
            <p className="text-xl" style={{ color: 'var(--slate)' }}>
              Select a topic to find relevant help articles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {helpCategories.map((category, index) => (
              <a
                key={index}
                href={category.link}
                className="help-category p-8"
                style={{
                  backgroundColor: 'var(--paper)',
                  border: `2px solid var(--line)`
                }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div 
                    className="w-14 h-14 flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <category.icon className="h-7 w-7" style={{ color: 'var(--paper)' }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--slate)' }}>
                    {category.topics} articles
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                  {category.title}
                </h3>
                
                <p className="leading-relaxed mb-4" style={{ color: 'var(--slate)' }}>
                  {category.description}
                </p>

                <div className="flex items-center font-semibold" style={{ color: 'var(--orange)' }}>
                  <span>View articles</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Questions (FAQ) */}
      <section className="py-20" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl" style={{ color: 'var(--slate)' }}>
              Quick answers to common questions
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'var(--slate)' }}>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              filteredQuestions.map((faq, index) => (
                <div
                  key={index}
                  className="faq-item overflow-hidden"
                  style={{ border: `2px solid var(--line)`, backgroundColor: 'var(--paper)' }}
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-8 py-6 flex items-center justify-between"
                  >
                    <div className="flex items-start gap-4 text-left flex-1">
                      <span 
                        className="px-3 py-1 text-xs font-bold uppercase tracking-wide flex-shrink-0"
                        style={{
                          backgroundColor: 'rgba(228, 87, 46, 0.1)',
                          color: 'var(--orange)'
                        }}
                      >
                        {faq.category}
                      </span>
                      <span className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-6 w-6 flex-shrink-0 transition-transform ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                      style={{ color: 'var(--slate)' }}
                    />
                  </button>

                  {expandedFAQ === index && (
                    <div 
                      className="px-8 pb-6 pt-2"
                      style={{
                        backgroundColor: 'var(--off-white)',
                        borderTop: `2px solid var(--line)`
                      }}
                    >
                      <p className="leading-relaxed text-lg" style={{ color: 'var(--slate)' }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Guides & Resources */}
      <section className="py-20" style={{ backgroundColor: 'var(--navy)', color: 'var(--paper)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Guides & Resources
            </h2>
            <p className="text-xl" style={{ color: 'var(--steel-light)' }}>
              In-depth tutorials and documentation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {guides.map((guide, index) => (
              <a
                key={index}
                href="#"
                className="guide-card p-8"
                style={{ backgroundColor: 'var(--slate)' }}
              >
                <guide.icon className="h-12 w-12 mb-6" style={{ color: 'var(--orange)' }} />
                
                <h3 className="text-xl font-bold mb-3">
                  {guide.title}
                </h3>
                
                <p className="mb-4 leading-relaxed" style={{ color: 'var(--steel-light)' }}>
                  {guide.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--steel-light)' }}>
                    <Clock className="h-4 w-4 inline mr-1" />
                    {guide.duration}
                  </span>
                  <ArrowRight className="h-5 w-5" style={{ color: 'var(--orange)' }} />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/resources">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-4 hover:bg-white hover:text-navy-900"
                style={{
                  border: `2px solid var(--paper)`,
                  color: 'var(--paper)',
                  backgroundColor: 'transparent'
                }}
              >
                View All Resources
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
              Contact Support
            </h2>
            <p className="text-xl" style={{ color: 'var(--slate)' }}>
              Our team is here to help with any questions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactOptions.map((option, index) => (
              <div
                key={index}
                className="p-8 text-center"
                style={{
                  backgroundColor: 'var(--paper)',
                  border: `2px solid var(--line)`
                }}
              >
                <div 
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: 'var(--orange)' }}
                >
                  <option.icon className="h-8 w-8" style={{ color: 'var(--paper)' }} />
                </div>

                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                  {option.title}
                </h3>

                <p className="mb-2 font-semibold" style={{ color: 'var(--slate)' }}>
                  {option.description}
                </p>

                <p className="text-sm mb-6" style={{ color: 'var(--slate)' }}>
                  <Clock className="h-4 w-4 inline mr-1" />
                  {option.hours}
                </p>

                <a href={option.link}>
                  <Button 
                    variant="outline"
                    className="w-full hover:bg-navy-900 hover:text-white"
                    style={{
                      border: `2px solid var(--navy)`,
                      color: 'var(--navy)'
                    }}
                  >
                    {option.action}
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Support */}
      <section className="py-20" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div 
                  className="inline-block px-4 py-2 mb-6"
                  style={{
                    backgroundColor: 'rgba(228, 87, 46, 0.1)',
                    border: `2px solid var(--orange)`
                  }}
                >
                  <span 
                    className="font-semibold uppercase tracking-wider text-sm"
                    style={{ color: 'var(--orange)' }}
                  >
                    Enterprise Support
                  </span>
                </div>

                <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
                  Dedicated Support for<br />Business Partners
                </h2>

                <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--slate)' }}>
                  High-volume dealers, fleet buyers, and corporate accounts receive 
                  priority support with dedicated account managers.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    'Direct access to senior sales team',
                    'Custom logistics solutions',
                    'Volume pricing and financing',
                    'White-glove service for complex deals',
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 
                        className="h-6 w-6 flex-shrink-0 mt-1"
                        style={{ color: 'var(--orange)' }}
                      />
                      <span className="text-lg" style={{ color: 'var(--slate)' }}>{benefit}</span>
                    </div>
                  ))}
                </div>

                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="px-10 py-4"
                    style={{
                      backgroundColor: 'var(--orange)',
                      color: 'var(--paper)'
                    }}
                  >
                    <Building2 className="mr-2 h-5 w-5" />
                    Contact Business Team
                  </Button>
                </Link>
              </div>

              <div className="p-12" style={{ backgroundColor: 'var(--navy)', color: 'var(--paper)' }}>
                <Building2 className="h-16 w-16 mb-8" style={{ color: 'var(--orange)' }} />
                
                <h3 className="text-3xl font-bold mb-6">
                  Enterprise Support Includes:
                </h3>

                <ul className="space-y-6">
                  {[
                    { num: '1', title: 'Dedicated Account Manager', desc: 'Single point of contact for all transactions' },
                    { num: '2', title: 'Priority Processing', desc: 'Fast-tracked approvals and shipping' },
                    { num: '3', title: 'Custom Solutions', desc: 'Tailored contracts and payment terms' },
                    { num: '4', title: '24/7 Support Line', desc: 'Direct phone line for urgent issues' },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold"
                        style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
                      >
                        {item.num}
                      </div>
                      <div>
                        <div className="font-bold text-lg mb-1">{item.title}</div>
                        <div style={{ color: 'var(--steel-light)' }}>{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-20" style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}>
        <div className="container mx-auto px-4 text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-6" />
          
          <h2 className="text-4xl font-bold mb-6">
            Still Need Help?
          </h2>
          
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Our support team is available to assist with any questions about buying, 
            selling, shipping, or account management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg"
                className="px-10 py-4"
                style={{
                  backgroundColor: 'var(--paper)',
                  color: 'var(--orange)'
                }}
              >
                Contact Support Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <a href="tel:+18885550199">
              <Button 
                size="lg"
                variant="outline"
                className="px-10 py-4 hover:bg-white hover:text-orange-600"
                style={{
                  border: `2px solid var(--paper)`,
                  color: 'var(--paper)',
                  backgroundColor: 'transparent'
                }}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call: +1 (888) 555-0199
              </Button>
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .help-category {
          transition: border-color 0.3s ease;
        }
        .help-category:hover {
          border-color: var(--orange) !important;
        }
        .faq-item {
          transition: background-color 0.2s ease;
        }
        .faq-item button:hover {
          background-color: var(--off-white);
        }
        .guide-card {
          transition: background-color 0.3s ease;
        }
        .guide-card:hover {
          background-color: var(--steel-light);
        }
      `}</style>
    </div>
  );
}