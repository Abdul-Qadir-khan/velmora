import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    console.log("🔍 TEST SMTP - Env check:", {
      hasUser: !!process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
    });

    const transporter = nodemailer.createTransport({  // ✅ FIXED
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    await transporter.verify();
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: process.env.EMAIL_USER!,
      subject: "🧪 VERCEL SMTP TEST SUCCESS",
      text: "✅ Your SMTP works perfectly on Vercel!",
    });

    return NextResponse.json({ 
      success: true, 
      message: "Test email sent to your Gmail!" 
    });
  } catch (error: any) {
    console.error("💥 SMTP TEST ERROR:", error.message);
    return NextResponse.json({ 
      error: error.message, 
      code: error.code 
    }, { status: 500 });
  }
}