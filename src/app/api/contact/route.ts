import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // For now, log the submission and return success
    // In production, integrate with email service (SendGrid, Resend, etc.)
    console.log('📬 Contact Form Submission:');
    console.log(`  Name: ${name}`);
    console.log(`  Email: ${email}`);
    console.log(`  Subject: ${subject || '(not specified)'}`);
    console.log(`  Message: ${message.substring(0, 200)}...`);

    return NextResponse.json(
      { success: true, message: 'Thank you for your message! We\'ll get back to you within 24-48 hours.' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
