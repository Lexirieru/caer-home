import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

// Debug: Check if API key is loaded
console.log('Resend API Key loaded:', process.env.RESEND_API_KEY ? 'Yes' : 'No');

export async function POST(request: NextRequest) {
  try {
    console.log('API Key check:', process.env.RESEND_API_KEY ? 'Present' : 'Missing');
    
    const { email } = await request.json();
    console.log('Received email:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists in database
    const { data: existingUser } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Get current waitlist count
    const { count: currentCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const waitlistPosition = (currentCount || 0) + 1;

    // Add to database
    const { data: dbData, error: dbError } = await supabase
      .from('waitlist')
      .insert([
        {
          email: email,
          position: waitlistPosition,
          joined_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save to database' },
        { status: 500 }
      );
    }

    // Send confirmation email
    // Use verified domain when available, fallback to Resend domain
    const fromEmail = process.env.NODE_ENV === 'production' 
      ? 'Caer <noreply@caer.finance>' 
      : 'Caer <onboarding@resend.dev>';
      
    const { data: emailData, error } = await resend.emails.send({
      from: fromEmail,
      to: [email], // Now we can send directly to user's email
      subject: 'Welcome to the Caer Waitlist! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Hi there!</h1>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            You've been added to the Caer waitlist.
          </p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      padding: 20px; 
                      border-radius: 10px; 
                      text-align: center; 
                      margin: 30px 0;">
            <h2 style="color: white; margin: 0; font-size: 24px;">
              You're currently at #${waitlistPosition} on the 🚀 waitlist.
            </h2>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We'll notify you as soon as Caer launches. Get ready to experience unified liquidity across all chains!
          </p>
          
          <div style="text-align: center; margin-top: 40px;">
            <p style="color: #999; font-size: 14px;">
              Stay connected with us on 
              <a href="https://x.com/caerfinance" style="color: #1da1f2; text-decoration: none;">X (Twitter)</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Failed to send confirmation email: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      position: waitlistPosition,
      message: 'Successfully joined waitlist'
    });

  } catch (error) {
    console.error('Waitlist API error:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
