// src/components/careers/CareersHero.tsx

'use client';

import { Button } from '@/components/ui/Button';
import { ArrowRight, Mail } from 'lucide-react';

export function CareersHero() {
  const scrollToPositions = () => {
    document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--navy)', color: 'var(--paper)' }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--slate) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Build Your Career in<br />Global Equipment Trading
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-10 leading-relaxed max-w-3xl mx-auto"
            style={{ color: 'var(--steel-light)' }}
          >
            Join our team of industry experts facilitating $100M+ in equipment transactions 
            across 50+ countries. Work on deals that move the construction and mining industries forward.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg"
              style={{
                backgroundColor: 'var(--orange)',
                color: 'var(--paper)'
              }}
              onClick={scrollToPositions}
            >
              View Open Positions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <a href="mailto:careers@seastartrader.com">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg hover:bg-white hover:text-navy-900"
                style={{
                  border: `2px solid var(--paper)`,
                  color: 'var(--paper)',
                  backgroundColor: 'transparent'
                }}
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Recruiting
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div 
        className="relative z-20"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(14, 34, 51, 0.6)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--orange)' }}>$100M+</div>
              <div 
                className="text-xs md:text-sm uppercase tracking-wide mt-1"
                style={{ color: 'var(--steel-light)' }}
              >
                Annual Trading Volume
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--orange)' }}>50+</div>
              <div 
                className="text-xs md:text-sm uppercase tracking-wide mt-1"
                style={{ color: 'var(--steel-light)' }}
              >
                Countries Served
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--orange)' }}>50+</div>
              <div 
                className="text-xs md:text-sm uppercase tracking-wide mt-1"
                style={{ color: 'var(--steel-light)' }}
              >
                Team Members
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--orange)' }}>7</div>
              <div 
                className="text-xs md:text-sm uppercase tracking-wide mt-1"
                style={{ color: 'var(--steel-light)' }}
              >
                Global Offices
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}