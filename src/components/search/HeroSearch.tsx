'use client';

import { CATEGORIES, CATEGORY_SLUGS } from '@/lib/constants/categories';

export function HeroSearch() {
  return (
    <form
      action="/listings"
      method="GET"
      className="flex flex-col md:flex-row rounded-lg overflow-hidden max-w-3xl mb-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.25)',
      }}
    >
      <label
        className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r"
        style={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <span
          className="block text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Equipment type
        </span>
        <select
          name="type"
          className="w-full text-sm bg-transparent focus:outline-none [&>option]:text-black"
          style={{ color: '#FFFFFF' }}
        >
          <option value="">Any type</option>
          <option>Excavators</option>
          <option>Cranes</option>
          <option>Trucks</option>
          <option>Tractors</option>
        </select>
      </label>

      <label
        className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r"
        style={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <span
          className="block text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Category
        </span>
        <select
          name="category"
          className="w-full text-sm bg-transparent focus:outline-none [&>option]:text-black"
          style={{ color: '#FFFFFF' }}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={CATEGORY_SLUGS[c]}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex-1 px-4 py-3 border-b md:border-b-0">
        <span
          className="block text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Location
        </span>
        <input
          name="location"
          type="text"
          placeholder="Country or region"
          className="w-full text-sm bg-transparent focus:outline-none placeholder-white/50"
          style={{ color: '#FFFFFF' }}
        />
      </label>

      <button
        type="submit"
        className="btn-3d px-8 py-3 md:py-0 font-semibold text-sm"
        style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
      >
        Search
      </button>
    </form>
  );
}