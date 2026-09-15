import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: Implement Stripe webhook handler
  return NextResponse.json({ received: true });
}