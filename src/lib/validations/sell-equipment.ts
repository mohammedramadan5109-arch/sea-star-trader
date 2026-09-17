import { z } from 'zod';

export const sellEquipmentSchema = z.object({
  equipment_type: z.string().min(1, 'Equipment type is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Needs Repair']),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  asking_price: z.number().positive('Price must be positive').optional(),
  hours: z.number().nonnegative('Hours cannot be negative').optional(),
  serial_number: z.string().optional(),
  mileage: z.number().positive().optional(),
  photos: z.array(z.string()).min(1, 'At least one photo is required').max(10, 'Maximum 10 photos'),
});

export type SellEquipmentFormData = z.infer<typeof sellEquipmentSchema>;