'use client';

import { useState, useTransition } from 'react';
import { updateListingSpecs } from '@/app/admin/listings/[id]/edit/actions';

interface ListingEditFormProps {
  listingId: string;
  listing: Record<string, any>;
}

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>
        {label}
      </span>
      <input
        name={name}
        type={type}
        step={type === 'number' ? 'any' : undefined}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
        style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
      />
      {hint && (
        <span className="block text-[11px] mt-1" style={{ color: 'var(--admin-text-muted)' }}>
          {hint}
        </span>
      )}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg border p-5"
      style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
    >
      <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--admin-text)' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export function ListingEditForm({ listingId, listing }: ListingEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setMessage(null);

    startTransition(async () => {
      try {
        await updateListingSpecs(listingId, formData);
        setMessage({ type: 'ok', text: 'Saved.' });
      } catch (err) {
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Basics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Make" name="make" defaultValue={listing.make} />
          <Field label="Model" name="model" defaultValue={listing.model} />
          <Field label="Year" name="year" defaultValue={listing.year} placeholder="2012" />
          <Field label="Equipment type" name="equipment_type" defaultValue={listing.equipment_type} />
          <Field label="Condition" name="condition" defaultValue={listing.condition} placeholder="Good" />
          <Field label="Location" name="location" defaultValue={listing.location} />
          <Field
            label="Asking price (USD)"
            name="asking_price"
            type="number"
            defaultValue={listing.asking_price}
          />
          <Field
            label="Inspection score"
            name="inspection_score"
            type="number"
            defaultValue={listing.inspection_score}
            hint="0–100. Leave blank to hide."
          />
        </div>

        <label className="flex items-center gap-2 mt-4 text-sm" style={{ color: 'var(--admin-text)' }}>
          <input type="checkbox" name="is_negotiable" defaultChecked={!!listing.is_negotiable} />
          Price is negotiable
        </label>
      </Section>

      <Section title="Specifications">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Hours" name="hours" type="number" defaultValue={listing.hours} />
          <Field label="Serial number" name="serial_number" defaultValue={listing.serial_number} />
          <Field label="Net weight (lbs)" name="net_weight" type="number" defaultValue={listing.net_weight} />
          <Field label="Engine model" name="engine_model" defaultValue={listing.engine_model} placeholder="Cat C13 ACERT" />
          <Field label="Engine power (hp)" name="engine_power" type="number" defaultValue={listing.engine_power} />
          <Field label="Fuel type" name="fuel_type" defaultValue={listing.fuel_type} placeholder="Diesel" />
          <Field label="Transmission" name="transmission" defaultValue={listing.transmission} placeholder="Powershift" />
          <Field label="Bucket capacity" name="bucket_capacity" defaultValue={listing.bucket_capacity} placeholder="4.5 yd³" />
          <Field label="Tire size" name="tire_size" defaultValue={listing.tire_size} placeholder="29.5R25" />
        </div>
        <p className="text-[11px] mt-3" style={{ color: 'var(--admin-text-muted)' }}>
          Blank fields are hidden on the public listing page rather than shown empty.
        </p>
      </Section>

      <Section title="Description & highlights">
        <label className="block mb-4">
          <span className="block text-xs font-medium mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>
            Description
          </span>
          <textarea
            name="description"
            rows={5}
            defaultValue={listing.description ?? ''}
            className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium mb-1.5" style={{ color: 'var(--admin-text-muted)' }}>
            Highlights — one per line
          </span>
          <textarea
            name="highlights"
            rows={4}
            defaultValue={(listing.highlights ?? []).join('\n')}
            placeholder={'Enclosed ROPS cab with A/C\nRide control\nAuto Lube System'}
            className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
            style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
          />
        </label>
      </Section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
          style={{ backgroundColor: 'var(--admin-accent)' }}
        >
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
        {message && (
          <span
            className="text-sm"
            style={{ color: message.type === 'ok' ? '#3FCF8E' : '#F87171' }}
          >
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}