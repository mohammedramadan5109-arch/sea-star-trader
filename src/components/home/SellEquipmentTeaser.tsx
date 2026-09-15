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
    <section style={{ backgroundColor: 'var(--navy)' }}>
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Sell your equipment to a global pool of buyers
          </h2>
          <p className="mb-6" style={{ color: 'var(--steel-light)' }}>
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
                <Check size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--orange)' }} />
                <span className="text-sm" style={{ color: 'var(--paper)' }}>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: 'var(--paper)', ...notchedCardClip }} className="p-8">
          {formSubmitted ? (
            <div className="text-center py-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>
                Thanks — we have got your listing request
              </h3>
              <p className="text-sm" style={{ color: 'var(--slate)' }}>
                A Sea Star Trader specialist will contact you within one business day.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-4 text-sm font-semibold"
                style={{ color: 'var(--orange)' }}
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
                  Equipment Type *
                </label>
                <Input
                  {...register('equipment_type')}
                  placeholder="e.g. Excavator"
                  error={errors.equipment_type?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
                  Make
                </label>
                <Input {...register('make')} placeholder="e.g. Caterpillar" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
                  Model
                </label>
                <Input {...register('model')} placeholder="e.g. 320 GC" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
                  Year
                </label>
                <Input {...register('year')} placeholder="e.g. 2019" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
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
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
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
                  style={{ borderColor: 'var(--line)', color: 'var(--slate)' }}
                >
                  <UploadCloud size={22} className="mx-auto mb-2" style={{ color: 'var(--steel-light)' }} />
                  Photos optional (will be available in full form)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
                  Your Name *
                </label>
                <Input
                  {...register('contact_name')}
                  placeholder="Full name"
                  error={errors.contact_name?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
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
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--navy)' }}>
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
                  className="w-full py-3 text-sm font-bold rounded-sm disabled:opacity-50"
                  style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
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