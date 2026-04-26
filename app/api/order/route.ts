import { NextResponse } from "next/server";

let orders: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔥 FIX: Flatten customer data for send-order API
    const order = {
      // ✅ FLATTEN customer object
      orderId: body.orderId,
      name: body.customer?.name || body.name || "Customer",
      email: body.customer?.email || body.email || "test@example.com",  // ✅ FLATTENED
      phone: body.customer?.phone || body.phone || "",
      address: body.customer?.address || body.address || "",
      
      // Original data
      ...body,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    console.log("✅ Order saved:", order.orderId);
    console.log("📧 Order email:", order.email);  // ✅ DEBUG

    orders.push(order);

    // 🔥 SEND EMAIL with FLATTENED data
    try {
      const emailRes = await fetch('http://localhost:3000/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)  // ✅ Now has flat email field
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

export async function GET() {
  return NextResponse.json(orders);
}