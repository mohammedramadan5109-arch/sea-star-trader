'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

/** Accordion FAQ shared by the service pages. First item starts open. */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.question}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: 'var(--line)', backgroundColor: 'var(--off-white)' }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-bold" style={{ color: 'var(--navy)' }}>
                {item.question}
              </span>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className="shrink-0 transition-transform duration-200"
                style={{
                  color: 'var(--orange)',
                  transform: open ? 'rotate(180deg)' : undefined,
                }}
              />
            </button>
            {open && (
              <div className="px-5 pb-4 -mt-1">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
