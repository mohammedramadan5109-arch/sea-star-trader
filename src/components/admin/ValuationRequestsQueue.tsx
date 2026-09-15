// src/components/admin/ValuationRequestsQueue.tsx

'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ValuationRequest {
  id: string;
  equipment_type: string;
  make: string | null;
  model: string | null;
  year: string | null;
  condition: string | null;
  location: string;
  contact_name: string;
  contact_email: string;
  status: string;
  created_at: string;
}

interface ValuationRequestsQueueProps {
  requests: ValuationRequest[];
  onMarkContacted?: (id: string) => void;
  onConvertToListing?: (id: string) => void;
}

export function ValuationRequestsQueue({
  requests,
  onMarkContacted,
  onConvertToListing,
}: ValuationRequestsQueueProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 border border-[var(--line)] rounded-sm" style={{ backgroundColor: 'var(--off-white)' }}>
        <p className="text-sm" style={{ color: 'var(--slate)' }}>
          No valuation requests yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="p-6 rounded-sm border border-[var(--line)]"
          style={{ backgroundColor: 'var(--off-white)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--navy)' }}>
                {request.equipment_type}
                {request.make && ` - ${request.make}`}
                {request.model && ` ${request.model}`}
              </h3>
              <p className="text-sm" style={{ color: 'var(--slate)' }}>
                Submitted: {new Date(request.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge
              variant={
                request.status === 'pending' ? 'warning' :
                request.status === 'contacted' ? 'success' : 'default'
              }
            >
              {request.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="font-semibold" style={{ color: 'var(--slate)' }}>Contact:</span>{' '}
              {request.contact_name}
            </div>
            <div>
              <span className="font-semibold" style={{ color: 'var(--slate)' }}>Email:</span>{' '}
              <a href={`mailto:${request.contact_email}`} className="text-[var(--orange)] hover:underline">
                {request.contact_email}
              </a>
            </div>
            {request.year && (
              <div>
                <span className="font-semibold" style={{ color: 'var(--slate)' }}>Year:</span>{' '}
                {request.year}
              </div>
            )}
            {request.condition && (
              <div>
                <span className="font-semibold" style={{ color: 'var(--slate)' }}>Condition:</span>{' '}
                {request.condition}
              </div>
            )}
            <div className="col-span-2">
              <span className="font-semibold" style={{ color: 'var(--slate)' }}>Location:</span>{' '}
              {request.location}
            </div>
          </div>

          {request.status === 'pending' && (
            <div className="pt-4 border-t border-[var(--line)] flex gap-3">
              {/* ✅ FIXED: Removed size prop since it's not in ButtonProps */}
              {onMarkContacted && (
                <Button onClick={() => onMarkContacted(request.id)}>
                  Mark as Contacted
                </Button>
              )}
              {onConvertToListing && (
                <Button onClick={() => onConvertToListing(request.id)} variant="outline">
                  Convert to Listing
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}