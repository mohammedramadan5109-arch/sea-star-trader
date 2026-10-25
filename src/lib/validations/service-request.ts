import { z } from 'zod';

/**
 * Service request forms (Shipping / Inspection / Refurbishing) hit the shared
 * `service_requests` table; Appraisal reuses `valuation_requests`.
 * Schemas keep the form shape flat — the mutation hooks compose the
 * service-specific fields into the `details` JSONB column.
 */

/** Contact block shared by every service request. Prefilled from profile. */
export const serviceContactSchema = z.object({
  contact_name: z.string().min(1, 'Your name is required'),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().optional(),
});

export const serviceNotesSchema = z
  .string()
  .max(2000, 'Notes are limited to 2000 characters')
  .optional();

/** Inserted into service_requests.listing_id when a listing is linked. */
const listingIdSchema = z
  .string()
  .uuid('Invalid listing reference')
  .optional()
  .or(z.literal('').transform(() => undefined));

export const shippingRequestSchema = serviceContactSchema.extend({
  listing_id: listingIdSchema,
  /** Free-text description used when no listing is linked. */
  equipment_description: z.string().max(200, 'Keep the description under 200 characters').optional(),
  /** Where the machine currently stands — yard, site, port. */
  equipment_location: z
    .string()
    .max(200, 'Keep the location under 200 characters')
    .optional(),
  pickup_country: z.string().min(1, 'Pickup country is required'),
  pickup_city: z.string().min(1, 'Pickup city is required'),
  destination_country: z.string().min(1, 'Destination country is required'),
  destination: z.string().min(1, 'Destination port or city is required'),
  shipping_method: z.enum(
    ['container', 'roro', 'flat_rack', 'breakbulk', 'unsure'],
    { errorMap: () => ({ message: 'Please choose a shipping method' }) }
  ),
  dimensions: z
    .string()
    .max(200, 'Dimensions are limited to 200 characters')
    .optional(),
  weight_kg: z
    .string()
    .regex(/^\d*$/, 'Weight must be a number')
    .optional(),
  ready_date: z.string().optional(),
  notes: serviceNotesSchema,
});
export type ShippingRequestFormData = z.infer<typeof shippingRequestSchema>;

export const inspectionRequestSchema = serviceContactSchema
  .extend({
    listing_id: listingIdSchema,
    equipment_make: z.string().optional(),
    equipment_model: z.string().optional(),
    equipment_year: z.string().optional(),
    location_country: z.string().min(1, 'Country is required'),
    location_city: z.string().min(1, 'City is required'),
    inspection_level: z.enum(
      ['visual', 'full_mechanical', 'full_fluid'],
      { errorMap: () => ({ message: 'Please choose an inspection level' }) }
    ),
    preferred_from: z.string().optional(),
    preferred_to: z.string().optional(),
    notes: serviceNotesSchema,
  })
  // Either an existing listing is linked, or the buyer describes the
  // machine in free text — at least one needs to be present.
  .refine(
    (data) =>
      !!data.listing_id ||
      !!(data.equipment_make?.trim() || data.equipment_model?.trim()),
    {
      message:
        'Link a listing or describe the equipment (make or model required)',
      path: ['equipment_make'],
    }
  );
export type InspectionRequestFormData = z.infer<typeof inspectionRequestSchema>;

export const WORK_NEEDED_OPTIONS = [
  'repaint',
  'engine_overhaul',
  'hydraulics',
  'undercarriage',
  'cab_electrical',
  'full_refurbishment',
] as const;

export const refurbishingRequestSchema = serviceContactSchema.extend({
  listing_id: listingIdSchema,
  photo_urls: z.array(z.string()).max(6, 'Maximum 6 photos').optional(),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().optional(),
  hours: z.string().optional(),
  work_needed: z
    .array(z.enum(WORK_NEEDED_OPTIONS))
    .min(1, 'Select at least one type of work'),
  current_condition: z.enum(
    ['Excellent', 'Good', 'Fair', 'Needs work'],
    { errorMap: () => ({ message: 'Please choose the current condition' }) }
  ),
  budget: z.string().optional(),
  timeline: z.enum(['asap', 'one_to_two_weeks', 'about_a_month', 'flexible']).optional(),
  notes: serviceNotesSchema,
});
export type RefurbishingRequestFormData = z.infer<typeof refurbishingRequestSchema>;

/**
 * Appraisal goes into the existing `valuation_requests` table (extended with
 * hours / serial_number / purpose / notes / photo_urls). The base schema and
 * the condition enum stay compatible with that table's CHECK constraint —
 * it only accepts 'Excellent' | 'Good' | 'Fair' | 'Needs Repair'.
 */
const valuationBase = z.object({
  equipment_type: z.string().min(1, 'Equipment type is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().optional(),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Needs Repair']),
  location: z.string().min(1, 'Location is required'),
  contact_name: z.string().min(1, 'Your name is required'),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().optional(),
});

export const appraisalRequestSchema = valuationBase.extend({
  hours: z.string().optional(),
  serial_number: z.string().optional(),
  purpose: z.enum(['selling', 'insurance', 'financing', 'other'], {
    errorMap: () => ({ message: 'Please choose the purpose' }),
  }),
  photo_urls: z.array(z.string()).max(6, 'Maximum 6 photos').optional(),
  notes: serviceNotesSchema,
});
export type AppraisalRequestFormData = z.infer<typeof appraisalRequestSchema>;
