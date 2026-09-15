import { z } from 'zod';

export const reviewListingSchema = z.object({
  listing_id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
});

export const updateListingStatusSchema = z.object({
  listing_id: z.string().uuid(),
  status: z.enum(['pending', 'approved', 'active', 'sold', 'rejected']),
});

export const convertToAuctionSchema = z.object({
  listing_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  starting_price: z.number().positive(),
  reserve_price: z.number().positive().optional(),
});

export type ReviewListingFormData = z.infer<typeof reviewListingSchema>;
export type UpdateListingStatusFormData = z.infer<typeof updateListingStatusSchema>;
export type ConvertToAuctionFormData = z.infer<typeof convertToAuctionSchema>;