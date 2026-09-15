'use client';

import { useMutation } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { LoginFormData } from '@/lib/validations/auth';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const supabase = createClient();

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      return authData;
    },
    onSuccess: () => {
      toast.success('Logged in successfully');
      
      // Force a hard redirect to ensure auth state refreshes
      window.location.href = '/dashboard';
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
    },
  });
}