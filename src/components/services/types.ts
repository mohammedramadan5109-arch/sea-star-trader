/** Shared props for the four service request forms. */

/** Signed-in user's contact block from their profile, for prefilling. */
export interface ServiceContactPrefill {
  name: string;
  email: string;
  phone: string;
}

/** A selectable listing option (own + public equipment). */
export interface ListingOption {
  id: string;
  label: string;
}
