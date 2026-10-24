'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  updateServiceRequestStatus,
  updateServiceRequestNotes,
} from '@/app/admin/service-requests/actions';

export interface AdminServiceRequest {
  /** Backing table for server actions: service_requests | valuation_requests. */
  table: 'service_requests' | 'valuation_requests';
  id: string;
  service: 'shipping' | 'inspection' | 'refurbishing' | 'appraisal';
  status: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  created_at: string;
  listing_id: string | null;
  listingLabel: string | null;
  userName: string | null;
  /** Preformatted key details for the table cell. */
  details: string;
  admin_notes: string | null;
}

const SERVICE_LABELS: Record<AdminServiceRequest['service'], string> = {
  shipping: 'Shipping',
  inspection: 'Inspection',
  refurbishing: 'Refurbishing',
  appraisal: 'Appraisal',
};

const STATUSES = ['pending', 'contacted', 'in_progress', 'completed', 'rejected'] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  contacted: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  in_progress: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  converted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

interface AdminServiceRequestsQueueProps {
  requests: AdminServiceRequest[];
}

export function AdminServiceRequestsQueue({ requests }: AdminServiceRequestsQueueProps) {
  const [items, setItems] = useState(requests);
  const [serviceTab, setServiceTab] =
    useState<AdminServiceRequest['service'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notesId, setNotesId] = useState<string | null>(null);
  const [draftNotes, setDraftNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const tabs = useMemo(() => {
    const counts = items.reduce<Record<string, number>>((acc, r) => {
      acc[r.service] = (acc[r.service] ?? 0) + 1;
      return acc;
    }, {});
    return (
      ['all', 'shipping', 'inspection', 'refurbishing', 'appraisal'] as const
    ).map((key) => ({
      key,
      label: key === 'all' ? 'All' : SERVICE_LABELS[key],
      count: key === 'all' ? items.length : counts[key] ?? 0,
    }));
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter(
        (r) =>
          (serviceTab === 'all' || r.service === serviceTab) &&
          (statusFilter === 'all' || r.status === statusFilter)
      ),
    [items, serviceTab, statusFilter]
  );

  function handleStatus(id: string, table: string, status: string) {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      try {
        await updateServiceRequestStatus(table, id, status);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setBusyId(null);
      }
    });
  }

  function openNotes(item: AdminServiceRequest) {
    setNotesId(item.id);
    setDraftNotes(item.admin_notes ?? '');
  }

  function saveNotes(id: string, table: string) {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      try {
        await updateServiceRequestNotes(table, id, draftNotes);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, admin_notes: draftNotes } : item))
        );
        setNotesId(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setBusyId(null);
      }
    });
  }

  return (
    <div>
      {/* Service tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setServiceTab(tab.key)}
            className="px-4 py-2 rounded-md text-sm font-semibold transition-opacity"
            style={
              serviceTab === tab.key
                ? { backgroundColor: 'var(--admin-accent)', color: '#0B0F17' }
                : { backgroundColor: 'var(--admin-surface)', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)' }
            }
          >
            {tab.label}
            <span className="ml-2 opacity-70">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
        <span style={{ color: 'var(--admin-text-muted)' }}>Status:</span>
        {(['all', ...STATUSES] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize"
            style={
              statusFilter === status
                ? { backgroundColor: 'var(--admin-accent)', color: '#0B0F17' }
                : { color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)' }
            }
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div
        className="rounded-lg border overflow-x-auto"
        style={{ borderColor: 'var(--admin-border)', backgroundColor: 'var(--admin-surface)' }}
      >
        {error && (
          <div className="px-5 py-3 text-sm text-red-400 border-b" style={{ borderColor: 'var(--admin-border)' }}>
            {error}
          </div>
        )}
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-left" style={{ color: 'var(--admin-text-muted)' }}>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Details</th>
              <th className="px-5 py-3 font-medium">Listing</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const busy = isPending && busyId === item.id;
              const statuses =
                item.table === 'valuation_requests'
                  ? (['pending', 'contacted', 'converted'] as const)
                  : STATUSES;
              return (
                <tr
                  key={item.id}
                  className="border-t align-top"
                  style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                >
                  <td className="px-5 py-4 whitespace-nowrap" style={{ color: 'var(--admin-text-muted)' }}>
                    {new Date(item.created_at).toLocaleDateString()}
                    <div className="text-xs">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold">{item.contact_name}</div>
                    <div className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                      {item.contact_email}
                    </div>
                    {item.contact_phone && (
                      <div className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                        {item.contact_phone}
                      </div>
                    )}
                    {item.userName && (
                      <div className="text-xs mt-1" style={{ color: 'var(--admin-accent)' }}>
                        Account: {item.userName}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-medium">{SERVICE_LABELS[item.service]}</td>
                  <td className="px-5 py-4 max-w-72">
                    <span className="text-xs whitespace-pre-line" style={{ color: 'var(--admin-text-muted)' }}>
                      {item.details}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {item.listing_id ? (
                      <Link
                        href={`/listings/${item.listing_id}`}
                        className="text-xs underline"
                        style={{ color: 'var(--admin-accent)' }}
                        title={item.listingLabel ?? undefined}
                      >
                        View listing →
                      </Link>
                    ) : (
                      <span style={{ color: 'var(--admin-text-muted)' }}>—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      disabled={busy}
                      value={item.status}
                      onChange={(e) => handleStatus(item.id, item.table, e.target.value)}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[item.status] ?? ''}`}
                      style={{ backgroundColor: 'transparent', color: 'inherit' }}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status} className="capitalize">
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {notesId === item.id ? (
                      <div className="flex flex-col items-end gap-2">
                        <textarea
                          value={draftNotes}
                          onChange={(e) => setDraftNotes(e.target.value)}
                          rows={3}
                          className="w-64 rounded-md border p-2 text-xs"
                          style={{
                            borderColor: 'var(--admin-border)',
                            backgroundColor: 'var(--admin-bg)',
                            color: 'var(--admin-text)',
                          }}
                          placeholder="Internal note…"
                        />
                        <div className="flex gap-2">
                          <button
                            disabled={busy}
                            onClick={() => saveNotes(item.id, item.table)}
                            className="rounded-md px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-50"
                            style={{ backgroundColor: 'var(--admin-accent)' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setNotesId(null)}
                            className="rounded-md border px-3 py-1.5 text-xs font-semibold"
                            style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => openNotes(item)}
                        className="rounded-md border px-3 py-1.5 text-xs font-semibold"
                        style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                      >
                        {item.admin_notes ? 'Edit note' : 'Add note'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center" style={{ color: 'var(--admin-text-muted)' }}>
                  {items.length === 0 ? 'No service requests yet.' : 'No requests match these filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {items.some((r) => r.admin_notes) && (
        <p className="mt-3 text-xs" style={{ color: 'var(--admin-text-muted)' }}>
          Saved notes appear in the note button per row and are visible to admins only.
        </p>
      )}
    </div>
  );
}
