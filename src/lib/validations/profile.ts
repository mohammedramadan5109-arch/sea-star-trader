import { z } from 'zod';

/**
 * Profile fields a user may edit through the public API. Matches the RLS
 * column grant (migration 20240109): only company_name and phone.
 */
export const profileSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  phone: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
