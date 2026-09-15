'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

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

interface ValuationRequestCardProps {
  request: ValuationRequest;
  onUpdate: () => void;
}

export function ValuationRequestCard({ request, onUpdate }: ValuationRequestCardProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleMarkContacted = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('valuation_requests')
        .update({ status: 'contacted' })
        .eq('id', request.id);

      if (error) throw error;

      toast.success('Marked as contacted');
      onUpdate(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToListing = async () => {
    if (!confirm('Convert this valuation request to a full listing? This will create a new equipment listing.')) {
      return;
    }

    setLoading(true);
    try {
      // TODO: This would create a new listing from the valuation request data
      // For now, just mark as converted
      const { error } = await supabase
        .from('valuation_requests')
        .update({ status: 'converted' })
        .eq('id', request.id);

      if (error) throw error;

      toast.success('Converted to listing (placeholder - full implementation pending)');
      onUpdate();
    } catch (error: any) {
      console.error('Error converting:', error);
      toast.error(error.message || 'Failed to convert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
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
            Submitted: {new Date(request.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
        <div className="space-y-2">
          <div>
            <span className="font-semibold" style={{ color: 'var(--slate)' }}>Contact Name:</span>{' '}
            <span style={{ color: 'var(--navy)' }}>{request.contact_name}</span>
          </div>
          <div>
            <span className="font-semibold" style={{ color: 'var(--slate)' }}>Email:</span>{' '}
            <a 
              href={`mailto:${request.contact_email}`} 
              className="text-[var(--orange)] hover:underline"
            >
              {request.contact_email}
            </a>
          </div>
        </div>

        <div className="space-y-2">
          {request.year && (
            <div>
              <span className="font-semibold" style={{ color: 'var(--slate)' }}>Year:</span>{' '}
              <span style={{ color: 'var(--navy)' }}>{request.year}</span>
            </div>
          )}
          {request.condition && (
            <div>
              <span className="font-semibold" style={{ color: 'var(--slate)' }}>Condition:</span>{' '}
              <span style={{ color: 'var(--navy)' }}>{request.condition}</span>
            </div>
          )}
          <div>
            <span className="font-semibold" style={{ color: 'var(--slate)' }}>Location:</span>{' '}
            <span style={{ color: 'var(--navy)' }}>{request.location}</span>
          </div>
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="pt-4 border-t border-[var(--line)] flex gap-3">
          <button
            onClick={handleMarkContacted}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold rounded-sm disabled:opacity-50"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            {loading ? 'Processing...' : 'Mark as Contacted'}
          </button>
          <button
            onClick={handleConvertToListing}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold rounded-sm border disabled:opacity-50"
            style={{ borderColor: 'var(--line)', color: 'var(--navy)' }}
          >
            Convert to Listing
          </button>
        </div>
      )}

      {request.status === 'contacted' && (
        <div className="pt-4 border-t border-[var(--line)]">
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            ✓ This request has been contacted
          </p>
        </div>
      )}

      {request.status === 'converted' && (
        <div className="pt-4 border-t border-[var(--line)]">
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            ✓ Converted to full listing
          </p>
        </div>
      )}
    </div>
  );
}