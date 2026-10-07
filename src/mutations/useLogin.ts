'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { LoginFormData } from '@/lib/validations/auth';

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginFormData & { captchaToken?: string | null }) => {
      // Login goes through our own API route so failed attempts are rate
      // limited server-side (3 per 10 minutes per IP) and the session
      // cookie is set by the server.
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          captchaToken: data.captchaToken ?? undefined,
        }),
      });

      const payload = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        throw new Error(payload.error || 'Failed to log in');
      }
      return payload;
    },
    onSuccess: () => {
      toast.success('Logged in successfully');
      
      // Force a hard redirect to ensure auth state refreshes
      window.location.href = '/dashboard';
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to log in');
    },
  });
}