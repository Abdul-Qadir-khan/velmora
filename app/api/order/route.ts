import { NextResponse } from "next/server";

let orders: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔥 FIX: Flatten customer data for send-order API
    const order = {
      orderId: body.orderId,
      name: body.customer?.name || body.name || "Customer",
      email: body.customer?.email || body.email || "test@example.com",
      phone: body.customer?.phone || body.phone || "",
      address: body.customer?.address || body.address || "",
      ...body,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    console.log("✅ Order saved:", order.orderId);
    console.log("📧 Order email:", order.email);

    orders.push(order);

    // ✅ FIXED: Use relative URL for Vercel
    try {
      const emailRes = await fetch('/api/send-order', {  // ← RELATIVE URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      
      console.log('📧 Email API response:', emailRes.status);
      
      if (!emailRes.ok) {
        const errorText = await emailRes.text();
        console.error('❌ Email API failed:', errorText);
      } else {
        console.log('✅ Beautiful receipt sent!');
      }
    } catch (emailError) {
      console.error('💥 Email call failed:', emailError);
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('❌ Order error:', err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}