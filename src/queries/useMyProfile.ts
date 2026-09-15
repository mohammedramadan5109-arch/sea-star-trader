'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  id: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<Profile | null> => {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return data;
    },
  });
}