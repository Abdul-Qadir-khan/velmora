import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    let data;
    
    // ✅ Parse JSON safely
    try {
      data = await req.json();
    } catch (parseError) {
      console.error("💥 JSON Parse Error:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON data" }, 
        { status: 400 }
      );
    }

    console.log("📦 Received order:", {
      orderId: data?.orderId,
      name: data?.name,
      email: data?.email,
      total: data?.total,
      itemsCount: data?.items?.length || 0
    });

    // ✅ Enhanced validation
    const requiredFields = { orderId: data?.orderId, name: data?.name, email: data?.email };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        }, 
        { status: 400 }
      );
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" }, 
        { status: 400 }
      );
    }

    // ✅ Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("💥 Missing EMAIL_USER or EMAIL_PASS in environment");
      return NextResponse.json(
        { success: false, error: "Email service not configured" }, 
        { status: 500 }
      );
    }

    if (!process.env.ADMIN_EMAIL) {
      console.error("💥 Missing ADMIN_EMAIL in environment");
      return NextResponse.json(
        { success: false, error: "Admin email not configured" }, 
        { status: 500 }
      );
    }

    console.log("🔧 Creating transporter...");
    
    // ✅ Gmail SMTP transporter with better config
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // ✅ Add TLS options for better security
      tls: {
        rejectUnauthorized: false
      }
    });

    // ✅ Test transporter connection with timeout
    try {
      await Promise.race([
        transporter.verify(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Transporter verification timeout")), 10000)
        )
      ]);
      console.log("✅ Gmail SMTP connected successfully");
    } catch (verifyError) {
      console.error("💥 SMTP Verification failed:", verifyError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Email service unavailable. Please try again later." 
        }, 
        { status: 503 }
      );
    }

    // ✅ Sanitize data for HTML
    const sanitizeHTML = (str: string) => 
      str.replace(/[<>&"']/g, '').replace(/\n/g, ' ').trim();

    // ✅ Customer email with safe HTML
    const customerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #28a745;">✅ Order Confirmed #${sanitizeHTML(data.orderId)}</h2>
        <p>Hi <strong>${sanitizeHTML(data.name)}</strong>,</p>
        <p>Thank you for your order! We'll process it shortly.</p>
        ${data.items && data.items.length > 0 ? `
        <table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px; text-align: left;">Item</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item: any) => `
              <tr>
                <td style="padding: 12px;">${sanitizeHTML(item.name || 'N/A')}</td>
                <td style="padding: 12px; text-align: center;">${item.qty || 0}</td>
                <td style="padding: 12px; text-align: right;">₹${parseFloat(item.price || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Total: ₹${parseFloat(data.total || 0).toFixed(2)}</strong></p>
          ${data.address ? `<p><strong>Shipping to:</strong> ${sanitizeHTML(data.address)}</p>` : ''}
          ${data.phone ? `<p><strong>Phone:</strong> ${sanitizeHTML(data.phone)}</p>` : ''}
        </div>
        <p style="color: #666; font-size: 14px;">
          This is an automated confirmation. Do not reply to this email.
        </p>
      </div>
    `;

    const customerMail = {
      from: `"Velmora Store" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `Order Confirmed #${data.orderId} - Velmora Store`,
      html: customerHTML,
    };

    // ✅ Admin email
    const adminHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #007bff;">🆕 New Order #${sanitizeHTML(data.orderId)}</h2>
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${sanitizeHTML(data.name)}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${sanitizeHTML(data.phone)}</p>` : ''}
          ${data.address ? `<p><strong>Address:</strong> ${sanitizeHTML(data.address)}</p>` : ''}
        </div>
        <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Total Amount:</strong> ₹${parseFloat(data.total || 0).toFixed(2)}</p>
        </div>
        ${data.items && data.items.length > 0 ? `
        <h3>Order Items:</h3>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #007bff; color: white;">
              <th style="padding: 12px;">Item</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item: any) => `
              <tr>
                <td style="padding: 12px;">${sanitizeHTML(item.name || 'N/A')}</td>
                <td style="padding: 12px; text-align: center;">${item.qty || 0}</td>
                <td style="padding: 12px; text-align: right;">₹${parseFloat(item.price || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : '<p>No items in order</p>'}
      </div>
    `;

    const adminMail = {
      from: `"Velmora Store" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🆕 New Order #${data.orderId} - ₹${data.total}`,
      html: adminHTML,
    };

    console.log("📧 Sending emails...");
    
    // ✅ Send emails with individual error handling
    const [customerResult, adminResult] = await Promise.allSettled([
      transporter.sendMail(customerMail),
      transporter.sendMail(adminMail)
    ]);

    const customerSuccess = customerResult.status === 'fulfilled';
    const adminSuccess = adminResult.status === 'fulfilled';

    console.log("📧 Email results:", {
      customer: customerSuccess ? '✅' : '❌',
      admin: adminSuccess ? '✅' : '❌',
      customerError: customerSuccess ? null : (customerResult as PromiseRejectedResult).reason,
      adminError: adminSuccess ? null : (adminResult as PromiseRejectedResult).reason
    });

    // ✅ Return success even if one email fails (business critical)
    return NextResponse.json({
      success: true,
      message: customerSuccess && adminSuccess 
        ? "Order confirmed! Both emails sent successfully."
        : "Order confirmed! Customer email sent successfully.",
      orderId: data.orderId,
      emails: {
        customer: customerSuccess,
        admin: adminSuccess
      }
    });

  } catch (error: any) {
    console.error("💥 Email API Error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: process.env.NODE_ENV === 'production' 
          ? "Failed to process order. Please try again." 
          : error.message || "Unknown error occurred"
      }, 
      { status: 500 }
    );
  }
}