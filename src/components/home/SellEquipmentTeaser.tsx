'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, UploadCloud } from 'lucide-react';
import { valuationRequestSchema, type ValuationRequestFormData } from '@/lib/validations/valuation-request';
import { useSubmitValuationRequest } from '@/mutations/useSubmitValuationRequest';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const notchedCardClip = {
  clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
};

// Pinned literals matching the repainted mockup — independent of the
// site-wide theme tokens, since this section needs a dark surround with
// a deliberately light card inside it (the opposite of what the global
// --navy/--paper flip produces on its own).
const SECTION_BG = 'var(--off-white)';
const HEADLINE = '#FFFFFF';
const BODY_TEXT = '#8FA3B5';
const ACCENT = '#F5B324';
const CARD_LABEL = '#0E2233';
const CARD_MUTED = '#3A5569';
const CARD_BORDER = '#D1CFC7';
const CARD_ICON = '#6B7F92';

export function SellEquipmentTeaser() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { mutate, isPending } = useSubmitValuationRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ValuationRequestFormData>({
    resolver: zodResolver(valuationRequestSchema),
  });

  const onSubmit = (data: ValuationRequestFormData) => {
    mutate(data, {
      onSuccess: () => {
        setFormSubmitted(true);
        reset();
      },
    });
  };

  return (
    <section style={{ backgroundColor: SECTION_BG }}>
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight" style={{ color: HEADLINE }}>
            Sell your equipment to a global pool of buyers
          </h2>
          <p className="mb-6" style={{ color: BODY_TEXT }}>
            Tell us what you are selling and we will get back to you with a free, no-obligation
            valuation and a plan for how it sells — auction, fixed price, or private sale.
          </p>
          <ul className="space-y-3">
            {[
              'Listed in front of serious buyers in over 40 countries',
              'Inspection, shipping, and paperwork handled for you',
              'Clear fees, no surprises at settlement',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                <span className="text-sm font-medium" style={{ color: ACCENT }}>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: 'var(--paper-solid)', ...notchedCardClip }} className="p-8">
          {formSubmitted ? (
            <div className="text-center py-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: CARD_LABEL }}>
                Thanks — we have got your listing request
              </h3>
              <p className="text-sm" style={{ color: CARD_MUTED }}>
                A Sea Star Trader specialist will contact you within one business day.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-4 text-sm font-semibold"
                style={{ color: ACCENT }}
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  Equipment Type *
                </label>
                <Input
                  {...register('equipment_type')}
                  placeholder="e.g. Excavator"
                  error={errors.equipment_type?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  Make
                </label>
                <Input {...register('make')} placeholder="e.g. Caterpillar" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  Model
                </label>
                <Input {...register('model')} placeholder="e.g. 320 GC" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  Year
                </label>
                <Input {...register('year')} placeholder="e.g. 2019" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  Condition *
                </label>
                <Select {...register('condition')} error={errors.condition?.message}>
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Needs Repair">Needs Repair</option>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  Location *
                </label>
                <Input
                  {...register('location')}
                  placeholder="City, country"
                  error={errors.location?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <div
                  className="border border-dashed rounded-sm p-6 text-center text-sm"
                  style={{ borderColor: CARD_BORDER, color: CARD_MUTED }}
                >
                  <UploadCloud size={22} className="mx-auto mb-2" style={{ color: CARD_ICON }} />
                  Photos optional (will be available in full form)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  Your Name *
                </label>
                <Input
                  {...register('contact_name')}
                  placeholder="Full name"
                  error={errors.contact_name?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  Email *
                </label>
                <Input
                  {...register('contact_email')}
                  type="email"
                  placeholder="you@company.com"
                  error={errors.contact_email?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  Phone Number
                </label>
                <Input
                  {...register('contact_phone')}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  error={errors.contact_phone?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 text-sm font-bold rounded-lg disabled:opacity-50"
                  style={{ backgroundColor: ACCENT, color: CARD_LABEL }}
                >
                  {isPending ? 'Submitting...' : 'Get a Free Valuation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}