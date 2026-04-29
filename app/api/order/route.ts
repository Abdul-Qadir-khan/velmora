import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // 🔥 ENV CHECK FIRST
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ 
        error: "EMAIL_USER/EMAIL_PASS missing in Vercel env vars ❌",
        hasUser: !!process.env.EMAIL_USER,
        hasPass: !!process.env.EMAIL_PASS
      }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // 🔥 STEP-BY-STEP DEBUG
    await transporter.verify();
    
    // 1. Test to SELF
    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: process.env.EMAIL_USER!,
      subject: "✅ API/ORDER TEST - Step 1 OK",
      text: "Self-test passed!"
    });

    return NextResponse.json({ 
      success: true, 
      message: "✅ Self-test passed! Env vars OK. Use /api/send-order for real orders.",
      nextStep: "Test POST /api/send-order with customer email"
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      code: error.code,
      debug: {
        EMAIL_USER_SET: !!process.env.EMAIL_USER,
        EMAIL_PASS_SET: !!process.env.EMAIL_PASS,
        fix: "1. Enable Gmail 2FA 2. Generate App Password 3. Add to Vercel env vars"
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method",
    endpoints: ["/api/order (debug)", "/api/send-order (production)"]
  });
}