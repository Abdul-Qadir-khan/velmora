import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = "khanabdulqadir781@gmail.com";

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 SEND-ORDER START");

    const rawBody = await req.text();
    if (!rawBody.trim()) {
      return NextResponse.json({ error: "Empty body" }, { status: 400 });
    }

    const parsedData = JSON.parse(rawBody); // ✅ Simple name, no interface
    const { orderId, email, name, phone, total = 0, items = [] } = parsedData;

    // 🔥 VALIDATION
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ error: "orderId (string) required" }, { status: 400 });
    }
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "email (string) required" }, { status: 400 });
    }

    const customerEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    console.log("✅ VALIDATED:", { orderId, customerEmail: customerEmail.slice(0, 10) + "..." });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false },
      pool: true,
      maxConnections: 1,
    });

    // 🔥 Items Table - NO external data refs
    const buildItemsTable = (items: any[], totalAmount: number): string => {
      if (!items.length) return '<p>No items</p>';
      
      return `
        <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
          <thead><tr style="background: #667eea; color: white;">
            <th style="padding: 10px;">Item</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
            <th style="padding: 10px; text-align: right;">Total</th>
          </tr></thead>
          <tbody>
            ${items.map((item: any) => {
              const qty = item.quantity || 1;
              const lineTotal = (item.price || 0) * qty;
              return `<tr>
                <td style="padding: 10px;"><strong>${item.name || 'Item'}</strong>
                  ${item.size ? `<br>Size: ${item.size}` : ''}
                  ${item.color ? `Color: ${item.color}` : ''}
                </td>
                <td style="text-align: center; padding: 10px;">${qty}</td>
                <td style="text-align: right; padding: 10px;">₹${item.price || 0}</td>
                <td style="text-align: right; padding: 10px; font-weight: bold;">₹${lineTotal}</td>
              </tr>`;
            }).join('')}
          </tbody>
          <tfoot><tr style="background: #f8f9fa; font-weight: bold;">
            <td colspan="3" style="text-align: right; padding: 12px;">TOTAL:</td>
            <td style="text-align: right; padding: 12px;">₹${totalAmount}</td>
          </tr></tfoot>
        </table>
      `;
    };

    // 🔥 Admin Email
    const adminHtml = `
      <div style="font-family: Arial; max-width: 700px; margin: 0 auto;">
        <h1 style="color: #dc3545;">🚨 New Order #${orderId}</h1>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3>${name || 'Customer'}</h3>
          <p>${customerEmail}</p>
          <p>Phone: ${phone || 'N/A'}</p>
          <p><strong>Total: ₹${total.toLocaleString()}</strong></p>
        </div>
        <h3>Items:</h3>
        ${buildItemsTable(items, total)}
      </div>
    `;

    const customerHtml = `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">✅ Order #${orderId} Confirmed</h1>
        <p>Hi ${name || 'Customer'},</p>
        <div style="background: #d4edda; padding: 20px; text-align: center;">
          <h2>₹${total.toLocaleString()}</h2>
        </div>
        <h3>Your Items:</h3>
        ${buildItemsTable(items, total)}
        <p style="text-align: center;">Processing soon! 🚀</p>
      </div>
    `;

    // 🔥 Parallel emails
    const [adminResult, customerResult] = await Promise.all([
      transporter.sendMail({
        from: `"Lycoon WearStore" <${process.env.EMAIL_USER}>`,
        to: [ADMIN_EMAIL, process.env.EMAIL_USER!],
        replyTo: customerEmail,
        subject: `🚨 NEW ORDER #${orderId}`,
        html: adminHtml,
      }),
      transporter.sendMail({
        from: `"Lycoon WearStore" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        replyTo: process.env.EMAIL_USER!,
        subject: `✅ Order #${orderId} Confirmed`,
        html: customerHtml,
      })
    ]);

    console.log("✅ Emails sent:", { admin: !!adminResult.messageId, customer: !!customerResult.messageId });

    return NextResponse.json({
      success: true,
      message: "Order emails sent successfully",
      orderId,
      customerEmail,
      total,
      itemsCount: items.length,
    });

  } catch (error: any) {
    // ✅ NO 'data' reference here!
    console.error("💥 ERROR:", error.message);
    
    return NextResponse.json({
      error: "Failed to send emails",
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "API ready! Use POST with:",
    example: JSON.stringify({
      orderId: "ORD-123",
      email: "customer@gmail.com",
      name: "John Doe",
      total: 1999,
      items: [{ name: "T-Shirt", price: 999, quantity: 2 }]
    }, null, 2)
  });
}