import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "khanabdulqadir781@gmail.com";

export async function POST(req: NextRequest) {
  try {
    // DEBUG: Log everything
    console.log("🚀 SEND-ORDER STARTED");
    console.log("🔍 ENV:", {
      EMAIL_USER: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.slice(0,3)}***` : "MISSING",
      EMAIL_PASS: process.env.EMAIL_PASS ? "SET" : "MISSING",
    });

    const data = await req.json();
    console.log("📦 DATA RECEIVED:", JSON.stringify(data, null, 2));

    // Create transporter
    console.log("🔌 CREATING TRANSPORTER...");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
      logger: true,  // Enable nodemailer logs
      debug: true,   // Show SMTP conversation
    });

    console.log("✅ TRANSPORTER CREATED");

    // TEST CONNECTION FIRST
    console.log("🔍 TESTING CONNECTION...");
    await transporter.verify();
    console.log("✅ CONNECTION OK!");

    // SIMPLE TEST EMAIL FIRST (like test-smtp)
    console.log("📤 SENDING TEST EMAIL...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: process.env.EMAIL_USER!,  // Send to yourself first
      subject: "🧪 SEND-ORDER TEST - STEP 1",
      text: "If you receive this, transporter works! Next will be order emails.",
    });
    console.log("✅ TEST EMAIL SENT");

    // NOW TRY ADMIN EMAIL
    console.log("📤 SENDING ADMIN EMAIL...");
    await transporter.sendMail({
      from: `"Lycoon Store" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: "🧪 SEND-ORDER TEST - STEP 2 (ADMIN)",
      text: "Admin test email - if this fails, check ADMIN_EMAIL or timeout",
    });
    console.log("✅ ADMIN EMAIL SENT");

    // NOW TRY CUSTOMER EMAIL
    const customerEmail = data.email;
    console.log("📤 SENDING CUSTOMER EMAIL:", customerEmail);
    await transporter.sendMail({
      from: `"Lycoon Store" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: "🧪 SEND-ORDER TEST - STEP 3 (CUSTOMER)",
      text: `Customer test email for order #${data.orderId}`,
    });
    console.log("✅ CUSTOMER EMAIL SENT");

    console.log("🎉 ALL 3 EMAILS SENT SUCCESSFULLY!");

    return NextResponse.json({ 
      success: true, 
      message: "All test emails sent! Check your inbox.",
      steps: ["transporter", "self-test", "admin", "customer"]
    });

  } catch (error: any) {
    console.error("💥 DETAILED ERROR:", {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      responseData: error.responseData,
      stack: error.stack?.split('\n').slice(0, 5)
    });

    return NextResponse.json({ 
      error: "Detailed error logged to console",
      message: error.message,
      code: error.code,
      step: "unknown"
    }, { status: 500 });
  }
}