'use client';

import { COUNTRIES, flagEmoji } from '@/lib/country-codes';

interface CountryCodeSelectProps {
  /** ISO 3166-1 alpha-2 code of the currently selected country. */
  value: string;
  onChange: (iso2: string) => void;
}

/**
 * Country calling-code picker shown next to the phone number field.
 * Kept as a plain native <select> so it needs no extra dependency and
 * inherits the same light input styling as the rest of the form.
 */
export function CountryCodeSelect({ value, onChange }: CountryCodeSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Country calling code"
      title="Country calling code"
      className="shrink-0 px-2 py-2 text-sm rounded-sm border bg-white border-[var(--line)] text-[var(--navy-solid)] focus:outline-none focus:ring-2 focus:ring-orange-500 max-w-[190px]"
    >
      {COUNTRIES.map((country) => (
        <option key={country.iso2} value={country.iso2}>
          {flagEmoji(country.iso2)} {country.name} (+{country.dial})
        </option>
      ))}
    </select>
  );
}
