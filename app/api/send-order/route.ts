import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "khanabdulqadir781@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // VALIDATION (unchanged)
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

    const sanitizeHTML = (str: string) =>
      str
        .replace(/[<>&"']/g, "")
        .replace(/\n/g, " ")
        .trim();

    const orderId = data.orderId;
    const customerName = sanitizeHTML(data.name);
    const customerEmail = data.email.trim().toLowerCase();
    const total = parseFloat(data.total);
    const items = Array.isArray(data.items) ? data.items : [];
    const address = sanitizeHTML(data.address || "");
    const phone = sanitizeHTML(data.phone || "");

    // 🔥 CLEAN MINIMAL CUSTOMER RECEIPT
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
    
    <!-- Header -->
    <div style="background: #1a1a1a; padding: 24px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 500;">Order Receipt</h1>
      <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">#${orderId}</p>
    </div>
    
    <!-- Greeting -->
    <div style="padding: 32px 24px;">
      <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 500; color: #1a1a1a;">Hello ${customerName},</h2>
      <div style="background: #e8f5e8; padding: 16px; border-radius: 6px; border-left: 4px solid #28a745; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; font-size: 14px; color: #28a745; font-weight: 500;">Order Confirmed</p>
        <p style="margin: 0; font-size: 13px; color: #666;">Processing in 1-2 days</p>
      </div>
    </div>
    
    <!-- Items -->
    <div style="padding: 0 24px 24px;">
      <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 500; color: #1a1a1a; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">
        Order Items (${items.length})
      </h3>
      
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${items
          .map(
            (item: any) => `
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
              <div style="font-size: 12px; color: #666;">
                Qty: ${item.qty || 1}
              </div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
    
    <!-- Total -->
    <div style="padding: 0 24px 24px; background: #f8f9fa; border-top: 1px solid #e9ecef;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0;">
        <span style="font-size: 18px; font-weight: 500; color: #1a1a1a;">Total Amount</span>
        <span style="font-size: 28px; font-weight: 600; color: #1a1a1a;">₹${total.toLocaleString()}</span>
      </div>
    </div>
    
    <!-- Address -->
    <div style="padding: 24px; background: #f8f9fa; border-top: 1px solid #e9ecef;">
      <h4 style="margin: 0 0 12px; font-size: 14px; font-weight: 500; color: #1a1a1a;">Delivery Address</h4>
      <p style="margin: 0 0 8px; font-size: 13px; line-height: 1.5;">${address}</p>
      ${phone ? `<p style="margin: 0; font-size: 13px; color: #666;"><strong>Phone:</strong> ${phone}</p>` : ""}
    </div>
    
    <!-- Footer -->
    <div style="padding: 24px; background: #1a1a1a; color: white; text-align: center;">
      <p style="margin: 0 0 4px; font-size: 13px;">Lycoon WearStore</p>
      <p style="margin: 0; font-size: 12px; opacity: 0.8;">Questions? Reply to this email</p>
    </div>
  </div>
</body>
</html>`;

    // 🔥 CLEAN MINIMAL ADMIN ALERT
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

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    // 1. ADMIN: New Order Alert ONLY
    await transporter.sendMail({
      from: `"Lycoon Store" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Order #${orderId} - ₹${total.toLocaleString()}`,
      html: adminHTML,
    });

    // 2. CUSTOMER: Receipt ONLY
    await transporter.sendMail({
      from: `"Lycoon WearStore" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order Receipt #${orderId}`,
      html: receiptHTML,
    });

    console.log("✅ Admin alert:", ADMIN_EMAIL);
    console.log("✅ Customer receipt:", customerEmail);

    return NextResponse.json({
      success: true,
      admin: ADMIN_EMAIL,
      customer: customerEmail,
    });
  } catch (error: any) {
    console.error("💥 Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
