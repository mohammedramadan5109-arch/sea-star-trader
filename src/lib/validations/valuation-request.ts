import { z } from 'zod';

export const valuationRequestSchema = z.object({
  equipment_type: z.string().min(1, 'Equipment type is required'),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Needs Repair']),
  location: z.string().min(1, 'Location is required'),
  contact_name: z.string().min(1, 'Your name is required'),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().optional(), // Added phone
});

export type ValuationRequestFormData = z.infer<typeof valuationRequestSchema>;