import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const supabase = await createClient();

    // TODO: Create an 'inquiries' table if you want to store these
    // For now, you could send an email via Resend or another service

    /*
    const { error } = await supabase
      .from('inquiries')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        inquiry_type: data.inquiry_type,
      });

    if (error) throw error;
    */

    console.log('Contact form submission:', data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}