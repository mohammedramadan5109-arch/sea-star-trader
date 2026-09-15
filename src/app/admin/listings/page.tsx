import { createClient } from '@/lib/supabase/server';
import { EquipmentListingsQueue } from '@/components/admin/EquipmentListingsQueue';

export default async function AdminListingsPage() {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from('listings')
    .select('*, profiles(email, company_name)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: 'var(--navy)' }}>
        All Listings
      </h1>

      <EquipmentListingsQueue listings={listings || []} />
    </div>
  );
}