import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Send the user back to the homepage of whichever origin they're on
  // (localhost in dev, the deployed domain on Vercel) — no env var needed.
  // 303 so the browser follows with a GET instead of re-POSTing.
  return NextResponse.redirect(new URL('/', request.url), 303);
}