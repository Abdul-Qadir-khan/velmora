import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "khanabdulqadir781@gmail.com";

// ✅ GLOBAL TRANSPORTER - Fixes cold starts & timeouts
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    // ✅ Validate env vars first
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER or EMAIL_PASS missing in environment variables");
    }

    transporter = nodemailer.createTransport({  // ✅ FIXED: createTransport
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
      // ✅ Serverless optimizations
      pool: true,
      maxConnections: 1,
      maxMessages: 5,
      connectionTimeout: 20000,  // 20s
      greetingTimeout: 20000,
      socketTimeout: 20000,
      logger: process.env.NODE_ENV === 'development',
    });
  }
  return transporter;
}

const sanitizeHTML = (str: string): string =>
  str
    .replace(/[<>&"']/g, "")
    .replace(/\n/g, " ")
    .trim();

export async function POST(req: NextRequest) {
  try {
    console.log("🔍 Env check:", {
      hasUser: !!process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
      userPrefix: process.env.EMAIL_USER?.slice(0, 3) + "***",
    });

    const data = await req.json();

    // VALIDATION
    const requiredFields = ["email", "name", "orderId", "total", "items"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Parse data
    const orderId = data.orderId;
    const customerName = sanitizeHTML(data.name);
    const customerEmail = data.email.trim().toLowerCase();
    const total = parseFloat(data.total);
    const items = Array.isArray(data.items) ? data.items : [];
    const address = sanitizeHTML(data.address || "");
    const phone = sanitizeHTML(data.phone || "");

    // 🔥 CUSTOMER RECEIPT (same as before)
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Receipt #${orderId}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; color: #333; background: #f8f9fa;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background: #1a1a1a; padding: 24px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 500;">Order Receipt</h1>
      <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">#${orderId}</p>
    </div>
    <div style="padding: 32px 24px;">
      <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 500; color: #1a1a1a;">Hello ${customerName},</h2>
      <div style="background: #e8f5e8; padding: 16px; border-radius: 6px; border-left: 4px solid #28a745; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; font-size: 14px; color: #28a745; font-weight: 500;">Order Confirmed</p>
        <p style="margin: 0; font-size: 13px; color: #666;">Processing in 1-2 days</p>
      </div>
    </div>
    <div style="padding: 0 24px 24px;">
      <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 500; color: #1a1a1a; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">
        Order Items (${items.length})
      </h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${items.map((item: any) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
            <div style="flex: 1;">
              <div style="font-weight: 500; font-size: 14px; color: #1a1a1a; margin-bottom: 4px;">
                ${sanitizeHTML(item.name || "Item")}
              </div>
              <div style="display: flex; gap: 16px; font-size: 12px; color: #666;">
                <span>Size: ${sanitizeHTML(item.size || "N/A")}</span>
                <span>Color: ${sanitizeHTML(item.color || "N/A")}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 600; font-size: 16px; color: #1a1a1a;">
                ₹${parseFloat(item.price || 0).toLocaleString()}
              </div>
              <div style="font-size: 12px; color: #666;">Qty: ${item.qty || 1}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <div style="padding: 0 24px 24px; background: #f8f9fa; border-top: 1px solid #e9ecef;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0;">
        <span style="font-size: 18px; font-weight: 500; color: #1a1a1a;">Total Amount</span>
        <span style="font-size: 28px; font-weight: 600; color: #1a1a1a;">₹${total.toLocaleString()}</span>
      </div>
    </div>
    <div style="padding: 24px; background: #f8f9fa; border-top: 1px solid #e9ecef;">
      <h4 style="margin: 0 0 12px; font-size: 14px; font-weight: 500; color: #1a1a1a;">Delivery Address</h4>
      <p style="margin: 0 0 8px; font-size: 13px; line-height: 1.5;">${address}</p>
      ${phone ? `<p style="margin: 0; font-size: 13px; color: #666;"><strong>Phone:</strong> ${phone}</p>` : ""}
    </div>
    <div style="padding: 24px; background: #1a1a1a; color: white; text-align: center;">
      <p style="margin: 0 0 4px; font-size: 13px;">Lycoon WearStore</p>
      <p style="margin: 0; font-size: 12px; opacity: 0.8;">Questions? Reply to this email</p>
    </div>
  </div>
</body>
</html>`;

    // 🔥 ADMIN ALERT (same as before)
    const adminHTML = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>New Order #${orderId}</title></head>
<body style="margin: 0; padding: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; color: #333; background: #f8f9fa;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background: #28a745; padding: 20px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 500;">New Order Received</h1>
      <p style="margin: 6px 0 0; font-size: 14px;">Order #${orderId}</p>
    </div>
    <div style="padding: 24px;">
      <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; border-left: 4px solid #28a745; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px; font-size: 14px; color: #28a745; font-weight: 500;">Order Summary</h3>
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; font-size: 14px;">
          <span>Total:</span><strong>₹${total.toLocaleString()}</strong>
          <span>Items:</span><strong>${items.length}</strong>
        </div>
      </div>
      <h4 style="margin: 0 0 16px; font-size: 14px; font-weight: 500; color: #1a1a1a;">Customer Details</h4>
      <div style="padding: 20px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
        <p style="margin: 0 0 8px; font-size: 13px;"><strong>Name:</strong> ${customerName}</p>
        <p style="margin: 0 0 8px; font-size: 13px;"><strong>Email:</strong> ${customerEmail}</p>
        <p style="margin: 0 0 8px; font-size: 13px;"><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p style="margin: 0; font-size: 13px;"><strong>Address:</strong> ${address}</p>
      </div>
    </div>
    <div style="padding: 20px; background: #1a1a1a; color: white; text-align: center; font-size: 12px;">
      Lycoon WearStore - Order Notification
    </div>
  </div>
</body>
</html>`;

    const transporterInstance = getTransporter();

    // ✅ STEP 1: Test connection
    console.log("🔌 Testing SMTP...");
    await transporterInstance.verify();
    console.log("✅ SMTP OK");

    // ✅ STEP 2: Admin email
    console.log("📤 Admin:", ADMIN_EMAIL);
    await transporterInstance.sendMail({
      from: `"Lycoon Store" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Order #${orderId} - ₹${total.toLocaleString()}`,
      html: adminHTML,
    });

    // ✅ STEP 3: Customer email
    console.log("📤 Customer:", customerEmail);
    await transporterInstance.sendMail({
      from: `"Lycoon WearStore" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Receipt #${orderId} - Thank You!`,
      html: receiptHTML,
    });

    console.log("🎉 SUCCESS - Both emails sent!");

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
      orderId,
    });

  } catch (error: any) {
    console.error("💥 ERROR:", error.message, error.code);

    return NextResponse.json(
      { 
        error: "Email failed",
        details: process.env.NODE_ENV === 'development' ? error.message : "Check logs",
        code: error.code,
      },
      { status: 500 }
    );
  }
}