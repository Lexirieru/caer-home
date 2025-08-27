import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('Test email API called');
    console.log('API Key present:', !!process.env.RESEND_API_KEY);
    
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    console.log('Attempting to send email to:', email);

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Test Email from Caer',
      html: '<p>This is a test email from Caer waitlist system.</p>',
    });

    console.log('Email send result:', result);

    if (result.error) {
      console.error('Email error:', result.error);
      return NextResponse.json({ 
        error: 'Email failed', 
        details: result.error 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      data: result.data 
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
