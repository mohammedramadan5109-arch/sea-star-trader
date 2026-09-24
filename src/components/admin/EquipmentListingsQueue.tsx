'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { reviewListing } from '@/app/admin/listings/actions';
import { toggleFeatured } from '@/app/admin/listings/[id]/edit/actions';

interface Listing {
  id: string;
  make: string;
  model: string;
  year: string | null;
  equipment_type: string;
  asking_price: number | null;
  status: string;
  location: string | null;
  created_at: string;
  is_featured?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  sold: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export function EquipmentListingsQueue({ listings }: { listings: Listing[] }) {
  const [items, setItems] = useState(listings);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [featurePendingId, setFeaturePendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleReview(id: string, action: 'approve' | 'reject') {
    setError(null);
    setPendingId(id);
    startTransition(async () => {
      try {
        const { status } = await reviewListing(id, action);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setPendingId(null);
      }
    });
  }

  function handleToggleFeatured(id: string, next: boolean) {
    setError(null);
    setFeaturePendingId(id);
    startTransition(async () => {
      try {
        const { featured } = await toggleFeatured(id, next);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, is_featured: featured } : item))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setFeaturePendingId(null);
      }
    });
  }

  return (
    <div
      className="rounded-lg border overflow-x-auto"
      style={{ borderColor: 'var(--admin-border)', backgroundColor: 'var(--admin-surface)' }}
    >
      {error && (
        <div className="px-5 py-3 text-sm text-red-400 border-b" style={{ borderColor: 'var(--admin-border)' }}>
          {error}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left" style={{ color: 'var(--admin-text-muted)' }}>
            <th className="px-5 py-3 font-medium">Equipment</th>
            <th className="px-5 py-3 font-medium">Asking price</th>
            <th className="px-5 py-3 font-medium">Location</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Homepage</th>
            <th className="px-5 py-3 font-medium">Submitted</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const busy = isPending && pendingId === item.id;
            return (
              <tr key={item.id} className="border-t" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}>
                <td className="px-5 py-4">
                  <div className="font-semibold">
                    {item.year ? `${item.year} ` : ''}
                    {item.make} {item.model}
                  </div>
                  <div style={{ color: 'var(--admin-text-muted)' }} className="text-xs">
                    {item.equipment_type}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {item.asking_price ? `$${item.asking_price.toLocaleString()}` : '—'}
                </td>
                <td className="px-5 py-4">{item.location ?? '—'}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[item.status] ?? ''}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    disabled={featurePendingId === item.id}
                    onClick={() => handleToggleFeatured(item.id, !item.is_featured)}
                    className="flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
                    style={{ color: item.is_featured ? 'var(--admin-accent)' : 'var(--admin-text-muted)' }}
                    title={item.is_featured ? 'Remove from homepage' : 'Show on homepage'}
                  >
                    <Star size={14} fill={item.is_featured ? 'var(--admin-accent)' : 'none'} />
                    {item.is_featured ? 'Featured' : 'Feature'}
                  </button>
                </td>
                <td className="px-5 py-4" style={{ color: 'var(--admin-text-muted)' }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end items-center gap-2 whitespace-nowrap">
                    <Link
                      href={`/admin/listings/${item.id}/edit`}
                      className="rounded-md border px-3 py-1.5 text-xs font-semibold"
                      style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                    >
                      Edit
                    </Link>
                    {item.status === 'pending' && (
                      <>
                      <button
                        disabled={busy}
                        onClick={() => handleReview(item.id, 'approve')}
                        className="rounded-md px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-50"
                        style={{ backgroundColor: 'var(--admin-accent)' }}
                      >
                        Approve & publish
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => handleReview(item.id, 'reject')}
                        className="rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                        style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                      >
                        Reject
                      </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center" style={{ color: 'var(--admin-text-muted)' }}>
                No listings to review.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}