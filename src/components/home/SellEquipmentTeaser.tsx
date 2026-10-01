'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, UploadCloud } from 'lucide-react';
import { valuationRequestSchema, type ValuationRequestFormData } from '@/lib/validations/valuation-request';
import { useSubmitValuationRequest } from '@/mutations/useSubmitValuationRequest';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useLanguage } from '@/components/providers/LanguageProvider';

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
  const { t } = useLanguage();

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
            {t('sell.title')}
          </h2>
          <p className="mb-6" style={{ color: BODY_TEXT }}>
            {t('sell.subtitle')}
          </p>
          <ul className="space-y-3">
            {(['sell.bullets.0', 'sell.bullets.1', 'sell.bullets.2'] as const).map((key) => (
              <li key={key} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                <span className="text-sm font-medium" style={{ color: ACCENT }}>
                  {t(key)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: 'var(--paper-solid)', ...notchedCardClip }} className="p-8">
          {formSubmitted ? (
            <div className="text-center py-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: CARD_LABEL }}>
                {t('sell.successTitle')}
              </h3>
              <p className="text-sm" style={{ color: CARD_MUTED }}>
                {t('sell.successBody')}
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-4 text-sm font-semibold"
                style={{ color: ACCENT }}
              >
                {t('sell.submitAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  {t('sell.equipmentType')} *
                </label>
                <Input
                  {...register('equipment_type')}
                  placeholder={t('sell.equipmentTypePlaceholder')}
                  error={errors.equipment_type?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  {t('sell.make')}
                </label>
                <Input {...register('make')}                  placeholder={t('sell.makePlaceholder')} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  {t('sell.model')}
                </label>
                <Input {...register('model')}                  placeholder={t('sell.modelPlaceholder')} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  {t('sell.year')}
                </label>
                <Input {...register('year')}                  placeholder={t('sell.yearPlaceholder')} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  {t('sell.condition')} *
                </label>
                <Select {...register('condition')} error={errors.condition?.message}>
                  <option value="">{t('sell.selectCondition')}</option>
                  <option value="Excellent">{t('sell.conditionExcellent')}</option>
                  <option value="Good">{t('sell.conditionGood')}</option>
                  <option value="Fair">{t('sell.conditionFair')}</option>
                  <option value="Needs Repair">{t('sell.conditionNeedsRepair')}</option>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  {t('sell.location')} *
                </label>
                <Input
                  {...register('location')}
                  placeholder={t('sell.locationPlaceholder')}
                  error={errors.location?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <div
                  className="border border-dashed rounded-sm p-6 text-center text-sm"
                  style={{ borderColor: CARD_BORDER, color: CARD_MUTED }}
                >
                  <UploadCloud size={22} className="mx-auto mb-2" style={{ color: CARD_ICON }} />
                  {t('sell.photosNote')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  {t('sell.yourName')} *
                </label>
                <Input
                  {...register('contact_name')}
                  placeholder={t('sell.namePlaceholder')}
                  error={errors.contact_name?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  {t('sell.email')} *
                </label>
                <Input
                  {...register('contact_email')}
                  type="email"
                  placeholder={t('sell.emailPlaceholder')}
                  error={errors.contact_email?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: CARD_LABEL }}>
                  {t('sell.phone')}
                </label>
                <Input
                  {...register('contact_phone')}
                  type="tel"
                  placeholder={t('sell.phonePlaceholder')}
                  error={errors.contact_phone?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 text-sm font-bold rounded-lg disabled:opacity-50 transition-transform duration-150 active:scale-[0.98]"
                  style={{ backgroundColor: ACCENT, color: CARD_LABEL }}
                >
                  {isPending ? t('sell.submitting') : t('sell.submit')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}