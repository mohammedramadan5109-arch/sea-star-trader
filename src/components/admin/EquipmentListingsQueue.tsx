'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Listing {
  id: string;
  equipment_type: string;
  make: string | null;
  model: string | null;
  year: string | null;
  location: string;
  status: string;
  created_at: string;
  profiles?: {
    email: string;
    company_name: string | null;
  };
}

interface EquipmentListingsQueueProps {
  listings: Listing[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function EquipmentListingsQueue({
  listings,
  onApprove,
  onReject,
}: EquipmentListingsQueueProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12 border border-[var(--line)] rounded-sm" style={{ backgroundColor: 'var(--off-white)' }}>
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          No pending listings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="p-6 rounded-sm border border-[var(--line)]"
          style={{ backgroundColor: 'var(--off-white)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--navy)' }}>
                {listing.year && `${listing.year} `}
                {listing.make} {listing.model}
              </h3>
              <p className="text-sm mb-1" style={{ color: 'var(--slate)' }}>
                {listing.equipment_type} • {listing.location}
              </p>
              <p className="text-xs" style={{ color: 'var(--steel-light)' }}>
                Submitted by: {listing.profiles?.email || 'N/A'}
                {listing.profiles?.company_name && ` (${listing.profiles.company_name})`}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--steel-light)' }}>
                Submitted: {new Date(listing.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  listing.status === 'active' ? 'success' :
                  listing.status === 'pending' ? 'warning' :
                  listing.status === 'rejected' ? 'error' : 'default'
                }
              >
                {listing.status}
              </Badge>
              <Link
                href={`/listings/${listing.id}`}
                className="text-sm font-semibold text-[var(--orange)] hover:underline"
              >
                View →
              </Link>
            </div>
          </div>

          {listing.status === 'pending' && (
            <div className="pt-4 border-t border-[var(--line)] flex gap-3">
              {onApprove && (
                <Button onClick={() => onApprove(listing.id)} size="sm">
                  Approve
                </Button>
              )}
              {onReject && (
                <Button onClick={() => onReject(listing.id)} variant="outline" size="sm">
                  Reject
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}