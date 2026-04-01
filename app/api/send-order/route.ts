import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { orderId, name, email, total, items } = data;

    // Log the incoming order data
    console.log("📦 Order Data:", { orderId, name, email, total, itemsCount: items?.length });

    // Create a Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",  // Gmail service
      auth: {
        user: process.env.EMAIL_USER,  // Email address from .env
        pass: process.env.EMAIL_PASS,  // App password from .env
      },
    });

    // Email content for the customer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,  // Customer's email
      subject: `Order Confirmation #${orderId}`,
      text: `Thank you for your order! Your order ID is ${orderId}. Total: ₹${total}.`,
    };

    // Email content for the admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,  // Admin email from .env
      subject: `New Order Received #${orderId}`,
      text: `Order ID: ${orderId}\nCustomer: ${name}\nEmail: ${email}\nTotal: ₹${total}\nItems: ${JSON.stringify(items)}`,
    };

    // Send both emails (Customer + Admin)
    console.log("✉️ Sending order confirmation emails...");
    const results = await Promise.allSettled([
      transporter.sendMail(mailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    // Log success/failure results
    results.forEach((res, i) => {
      if (res.status === "fulfilled") {
        console.log(i === 0 ? "✅ Customer email sent" : "✅ Admin email sent");
      } else {
        console.error(i === 0 ? "❌ Customer email failed" : "❌ Admin email failed", res.reason);
      }
    });

    // Send success response back
    return NextResponse.json({
      success: true,
      message: "Order emails sent successfully ✅",
      orderId,
    });

  } catch (error) {
    console.error("💥 Error sending email:", error);

    // Send error response back if email fails
    return NextResponse.json({
      success: false,
      error: "Failed to send email",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}