import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "khanabdulqadir781@gmail.com";

export async function POST(req: NextRequest) {
  let data: any;

  try {
    console.log("🚀 SEND-ORDER START");

    const rawBody = await req.text();
    console.log("📦 RAW BODY:", rawBody.slice(0, 200));

    try {
      data = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    console.log("📦 PARSED DATA:", {
      email: data.email,
      name: data.name,
      orderId: data.orderId,
      hasItems: !!data.items,
      itemsCount: data.items?.length || 0,
    });

    // 🔥 VALIDATE REQUIRED FIELDS
    if (!data.email || typeof data.email !== 'string') {
      console.log("❌ MISSING EMAIL:", data.email);
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!data.orderId) {
      console.log("❌ MISSING ORDERID");
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const customerEmail = data.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    console.log("✅ VALIDATED:", { customerEmail: customerEmail.slice(0, 10) + "...", orderId: data.orderId });

    // 🔥 CREATE ENHANCED TRANSPORTER (FIXED: TransportOptions)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
      maxConnections: 1,
      maxMessages: 5,
      logger: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development',
    }); // ✅ No type assertion needed - TypeScript infers correctly

    // 🔥 HELPER: Build Items Table HTML
    const buildItemsTable = (items: any[]): string => {
      if (!items?.length) return "<p>No items</p>";
      
      return `
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="text-align: left;">Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item: any) => `
              <tr>
                <td><strong>${item.name || 'N/A'}</strong><br>
                  ${item.size ? `Size: ${item.size}` : ''} 
                  ${item.color ? `| Color: ${item.color}` : ''}
                </td>
                <td style="text-align: center;">${item.quantity || 1}</td>
                <td style="text-align: right;">₹${item.price || 0}</td>
                <td style="text-align: right;"><strong>₹${(item.price * (item.quantity || 1)) || 0}</strong></td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #e9ecef; font-weight: bold;">
              <td colspan="3" style="text-align: right;">TOTAL:</td>
              <td style="text-align: right;">₹${data.total || 0}</td>
            </tr>
          </tfoot>
        </table>
      `;
    };

    // 🔥 STEP 1: ADMIN NOTIFICATION
    console.log("📤 STEP 1: Admin email →", ADMIN_EMAIL.slice(0, 10) + "...");
    
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc3545;">🚨 New Order #${data.orderId}</h1>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>👤 Customer Details</h3>
          <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Total:</strong> <span style="color: #28a745; font-size: 1.2em;">₹${data.total || 0}</span></p>
        </div>

        <h3>🛒 Order Items</h3>
        ${buildItemsTable(data.items || [])}

        <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <strong>Order ID:</strong> ${data.orderId}<br>
          <strong>Date:</strong> ${new Date().toLocaleString('en-IN')}<br>
          <strong>Items:</strong> ${data.items?.length || 0}
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Lycoon WearStore" <${process.env.EMAIL_USER}>`,
      to: [ADMIN_EMAIL, process.env.EMAIL_USER!],
      cc: process.env.EMAIL_USER!,
      subject: `🚨 New Order #${data.orderId} - ₹${data.total || 0}`,
      html: adminHtml,
    });
    console.log("✅ Admin email sent");

    // 🔥 STEP 2: CUSTOMER RECEIPT
    console.log("📤 STEP 2: Customer email →", customerEmail);
    
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">🎉 Order Confirmed #${data.orderId}</h1>
        <p>Hi <strong>${data.name || 'Customer'}</strong>,</p>
        <p>Thank you for your order! It's being processed 🚀</p>

        <div style="background: #d4edda; padding: 20px; border-radius: 8px;">
          <h3>📋 Order Summary</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Total:</strong> ₹${data.total || 0}</p>
        </div>

        <h3>🛒 Your Items</h3>
        ${buildItemsTable(data.items || [])}

        <div style="background: #cce5ff; padding: 15px; border-radius: 8px;">
          <strong>📱 Next Steps:</strong>
          <ul>
            <li>Check your dashboard for updates</li>
            <li>We'll notify you when shipped</li>
            <li>Delivery: 3-5 business days</li>
          </ul>
        </div>

        <p>Thank you for shopping with <strong>Lycoon WearStore</strong>! 🛍️</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Lycoon WearStore" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      cc: process.env.EMAIL_USER!,
      subject: `✅ Order Confirmed #${data.orderId} - Thank You!`,
      html: customerHtml,
    });
    console.log("✅ Customer email sent");

    console.log("🎉 SUCCESS - Both emails sent!");
    
    return NextResponse.json({
      success: true,
      message: "Order emails sent successfully",
      orderId: data.orderId,
      customerEmail,
      itemsCount: data.items?.length || 0,
    });

  } catch (error: unknown) {
    const errorAny = error as any;
    
    console.error("💥 FULL ERROR:", {
      message: errorAny.message,
      code: errorAny.code,
      stack: errorAny.stack?.split('\n').slice(0, 5),
    });

    // 🔥 SMART FALLBACK
    if (errorAny.message?.includes('recipient') || errorAny.code === 'EAUTH') {
      console.log("🔄 FALLBACK: Sending to admin only");
      
      try {
        const fallbackTransporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: { 
            user: process.env.EMAIL_USER!, 
            pass: process.env.EMAIL_PASS! 
          },
        });

        await fallbackTransporter.sendMail({
          from: process.env.EMAIL_USER!,
          to: process.env.EMAIL_USER!,
          subject: `⚠️ URGENT: New Order #${data?.orderId || 'Unknown'}`,
          html: `
            <h1>🚨 Order Received</h1>
            <p>Customer: ${data?.email || 'N/A'}</p>
            <p>Order: #${data?.orderId || 'Unknown'}</p>
            <p>Total: ₹${data?.total || 0}</p>
            <p>Gmail blocked external emails - check logs</p>
          `,
        });
        
        return NextResponse.json({
          success: true,
          message: "✅ Admin notified (external block bypassed)",
          orderId: data?.orderId,
        });
      } catch (fallbackError: unknown) {
        console.error("💥 FALLBACK FAILED:", (fallbackError as any).message);
      }
    }

    return NextResponse.json({
      error: "Email sending failed",
      details: process.env.NODE_ENV === 'development' ? errorAny.message : "Check logs",
      code: errorAny.code || "UNKNOWN",
    }, { status: 500 });
  }
}