// src/app/(marketing)/help/page.tsx

'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  ExternalLink,
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
    color: 'bg-blue-600',
    link: '#buying',
    topics: 5,
  },
  {
    icon: Tag,
    title: 'Selling Equipment',
    description: 'List your machinery, get valuations, and manage sales',
    color: 'bg-green-600',
    link: '#selling',
    topics: 7,
  },
  {
    icon: Gavel,
    title: 'Auctions & Bidding',
    description: 'Participate in live auctions and place competitive bids',
    color: 'bg-purple-600',
    link: '#auctions',
    topics: 6,
  },
  {
    icon: CreditCard,
    title: 'Payments & Financing',
    description: 'Payment methods, invoicing, and financing options',
    color: 'bg-orange-600',
    link: '#payments',
    topics: 4,
  },
  {
    icon: Ship,
    title: 'Shipping & Logistics',
    description: 'International shipping, customs, and delivery tracking',
    color: 'bg-cyan-600',
    link: '#shipping',
    topics: 8,
  },
  {
    icon: Shield,
    title: 'Account & Security',
    description: 'Profile settings, verification, and account security',
    color: 'bg-red-600',
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
  {
    category: 'Shipping',
    question: 'Who handles customs clearance?',
    answer: 'Our logistics partners manage customs clearance in both origin and destination countries. You provide: Commercial invoice, Bill of lading, Packing list, and Import permits (if required). We handle communication with customs authorities and keep you updated throughout the process.',
  },
  {
    category: 'Payments',
    question: 'How long does payment processing take?',
    answer: 'Wire transfers: 1-3 business days. Credit cards: Instant authorization, 1-2 days settlement. Letters of Credit: 5-10 business days. Funds are held in escrow until equipment inspection is completed and approved by buyer.',
  },
];

const guides = [
  {
    icon: Book,
    title: 'Complete Buyer\'s Guide',
    description: 'Step-by-step process from browsing to delivery',
    duration: '15 min read',
    link: '/guides/buyers-guide',
  },
  {
    icon: FileText,
    title: 'How to Import Heavy Equipment',
    description: 'Documentation, customs, and compliance requirements',
    duration: '12 min read',
    link: '/guides/import-guide',
  },
  {
    icon: Video,
    title: 'Auction Participation Tutorial',
    description: 'Video walkthrough of bidding process',
    duration: '8 min video',
    link: '/guides/auction-tutorial',
  },
  {
    icon: Download,
    title: 'Seller\'s Handbook (PDF)',
    description: 'Complete guide to listing and selling equipment',
    duration: 'PDF Download',
    link: '/resources/sellers-handbook.pdf',
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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 text-orange-400 mx-auto mb-6" />
            
            <h1 className="text-5xl font-bold mb-6">
              How Can We Help You?
            </h1>
            
            <p className="text-xl text-gray-300 mb-10">
              Search our knowledge base or browse by category
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search equipment, orders, shipping, or support..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-5 text-lg bg-white text-gray-900 border-2 border-gray-300 focus:outline-none focus:border-orange-600"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-orange-400">150+</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">Help Articles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">&lt;2 hrs</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">Avg Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">24/7</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Select a topic to find relevant help articles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {helpCategories.map((category, index) => (
              <a
                key={index}
                href={category.link}
                className="bg-white border-2 border-gray-200 p-8 hover:border-orange-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`${category.color} w-14 h-14 flex items-center justify-center`}>
                    <category.icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500">
                    {category.topics} articles
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-navy-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {category.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {category.description}
                </p>

                <div className="flex items-center text-orange-600 font-semibold group-hover:gap-2 transition-all">
                  <span>View articles</span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Questions (FAQ) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              filteredQuestions.map((faq, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4 text-left flex-1">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide flex-shrink-0">
                        {faq.category}
                      </span>
                      <span className="text-lg font-bold text-navy-900">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-6 w-6 text-gray-400 flex-shrink-0 transition-transform ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedFAQ === index && (
                    <div className="px-8 pb-6 pt-2 bg-gray-50 border-t-2 border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-lg">
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
      <section className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Guides & Resources
            </h2>
            <p className="text-xl text-gray-300">
              In-depth tutorials and documentation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {guides.map((guide, index) => (
              <a
                key={index}
                href={guide.link}
                className="bg-steel-600 p-8 hover:bg-steel-500 transition-colors group"
              >
                <guide.icon className="h-12 w-12 text-orange-400 mb-6" />
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition-colors">
                  {guide.title}
                </h3>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {guide.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {guide.duration}
                  </span>
                  <ExternalLink className="h-5 w-5 text-orange-400" />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/resources">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-navy-900 px-10 py-4"
              >
                View All Resources
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              Contact Support
            </h2>
            <p className="text-xl text-gray-600">
              Our team is here to help with any questions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 p-8 text-center"
              >
                <div className="bg-orange-600 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <option.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-navy-900 mb-3">
                  {option.title}
                </h3>

                <p className="text-gray-600 mb-2 font-semibold">
                  {option.description}
                </p>

                <p className="text-sm text-gray-500 mb-6">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {option.hours}
                </p>

                <a href={option.link}>
                  <Button 
                    variant="outline"
                    className="border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white w-full"
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-orange-100 border-2 border-orange-600 mb-6">
                  <span className="text-orange-700 font-semibold uppercase tracking-wider text-sm">
                    Enterprise Support
                  </span>
                </div>

                <h2 className="text-4xl font-bold text-navy-900 mb-6">
                  Dedicated Support for<br />Business Partners
                </h2>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
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
                      <CheckCircle2 className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4"
                  >
                    <Building2 className="mr-2 h-5 w-5" />
                    Contact Business Team
                  </Button>
                </Link>
              </div>

              <div className="bg-navy-900 p-12 text-white">
                <Building2 className="h-16 w-16 text-orange-400 mb-8" />
                
                <h3 className="text-3xl font-bold mb-6">
                  Enterprise Support Includes:
                </h3>

                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="bg-orange-600 w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-lg mb-1">Dedicated Account Manager</div>
                      <div className="text-gray-300">Single point of contact for all transactions</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="bg-orange-600 w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-lg mb-1">Priority Processing</div>
                      <div className="text-gray-300">Fast-tracked approvals and shipping</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="bg-orange-600 w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-lg mb-1">Custom Solutions</div>
                      <div className="text-gray-300">Tailored contracts and payment terms</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="bg-orange-600 w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      4
                    </div>
                    <div>
                      <div className="font-bold text-lg mb-1">24/7 Support Line</div>
                      <div className="text-gray-300">Direct phone line for urgent issues</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-20 bg-orange-600 text-white">
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
                className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-4"
              >
                Contact Support Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-4"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call: +1 (888) 555-0199
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}