'use client';

import { useMutation } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { RegisterFormData } from '@/lib/validations/auth';

export function useRegister() {
  const router = useRouter();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            company_name: data.company_name,
            phone: data.phone,
          },
        },
      });

      if (authError) throw authError;

      // Profile is auto-created by trigger
      // Just update the additional fields
      if (authData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            company_name: data.company_name,
            phone: data.phone || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
          // Don't throw - the user is created, just missing extra data
        }
      }

      return authData;
    },
    onSuccess: () => {
      toast.success('Account created! Please check your email to confirm.');
      router.push('/login');
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    },
  });
}