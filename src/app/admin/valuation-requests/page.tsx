'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { ValuationRequestCard } from '@/components/admin/ValuationRequestCard';
import { Spinner } from '@/components/ui/Spinner';

export default function ValuationRequestsPage() {
  const supabase = createClient();

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'valuation-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('valuation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--navy)' }}>
        Valuation Requests
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size={40} />
        </div>
      ) : !requests || requests.length === 0 ? (
        <div className="text-center py-12 border border-[var(--line)] rounded-sm" style={{ backgroundColor: 'var(--off-white)' }}>
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            No valuation requests yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <ValuationRequestCard 
              key={request.id} 
              request={request} 
              onUpdate={() => refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}