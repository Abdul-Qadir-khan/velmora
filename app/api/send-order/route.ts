import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!resendApiKey || !adminEmail) {
    return NextResponse.json({ error: "Missing Resend API key or admin email" }, { status: 500 });
  }

  const orderId = data.orderId;

  const adminHtml = `
    <h2>New Order Received</h2>
    <p><b>Order ID:</b> ${orderId}</p>
    <h3>Customer Details</h3>
    <p>Name: ${data.name}</p>
    <p>Email: ${data.email}</p>
    <p>Phone: ${data.phone}</p>
    <p>Address: ${data.address}, ${data.city}, ${data.zip}</p>
    <h3>Order Items</h3>
    ${data.items.map((item: any) => `<p>${item.name} x ${item.qty} = $${item.price * item.qty}</p>`).join("")}
    <h3>Total: $${data.total}</h3>
  `;

  const userHtml = `
    <h2>Thank you for your order!</h2>
    <p>Your Order ID is: <b>${orderId}</b></p>
    <p>Keep this ID to track your order.</p>
  `;

  // Send admin email
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: [adminEmail],
      subject: `New Order ${orderId}`,
      html: adminHtml
    })
  });

  // Send customer email
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: [data.email],
      subject: `Your Order Confirmation ${orderId}`,
      html: userHtml
    })
  });

  return NextResponse.json({ success: true });
}