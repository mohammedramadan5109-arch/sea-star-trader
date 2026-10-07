/**
 * Public hCaptcha site key — safe to expose in the client bundle (the secret
 * key lives only in the Supabase dashboard captcha settings). Set in
 * .env.local as NEXT_PUBLIC_HCAPTCHA_SITE_KEY.
 */
export const HCAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? '';
