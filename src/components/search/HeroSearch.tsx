'use client';

import { CATEGORIES, CATEGORY_SLUGS } from '@/lib/constants/categories';

export function HeroSearch() {
  return (
    <form
      action="/listings"
      method="GET"
      className="flex flex-col md:flex-row rounded-sm overflow-hidden max-w-3xl mb-4"
      style={{ backgroundColor: 'var(--paper)' }}
    >
      <label className="flex-1 px-4 py-3 md:border-r" style={{ borderColor: 'var(--line)' }}>
        <span
          className="block text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'var(--slate)' }}
        >
          Equipment type
        </span>
        <select
          name="type"
          className="w-full text-sm bg-transparent focus:outline-none"
          style={{ color: 'var(--ink)' }}
        >
          <option value="">Any type</option>
          <option>Excavators</option>
          <option>Cranes</option>
          <option>Trucks</option>
          <option>Tractors</option>
        </select>
      </label>

      <label className="flex-1 px-4 py-3 md:border-r" style={{ borderColor: 'var(--line)' }}>
        <span
          className="block text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'var(--slate)' }}
        >
          Category
        </span>
        <select
          name="category"
          className="w-full text-sm bg-transparent focus:outline-none"
          style={{ color: 'var(--ink)' }}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={CATEGORY_SLUGS[c]}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex-1 px-4 py-3">
        <span
          className="block text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'var(--slate)' }}
        >
          Location
        </span>
        <input
          name="location"
          type="text"
          placeholder="Country or region"
          className="w-full text-sm bg-transparent focus:outline-none"
          style={{ color: 'var(--ink)' }}
        />
      </label>

      <button
        type="submit"
        className="px-8 font-semibold text-sm"
        style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
      >
        Search
      </button>
    </form>
  );
}