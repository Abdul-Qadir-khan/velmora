// app/api/send-order/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("🛒 API Route Hit!");

  try {
    const data = await req.json();
    console.log("📦 Order Data:", {
      orderId: data.orderId,
      name: data.name,
      email: data.email,
      total: data.total,
      itemsCount: data.items?.length || 0
    });

    // 🎭 Simulate email sending delay (1.5 seconds)
    console.log("⏳ Simulating email sending...");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 🎉 Simulate success
    console.log("✅ Mock emails sent to:", data.email, "and admin");
    
    return NextResponse.json({ 
      success: true,
      orderId: data.orderId,
      message: "Order confirmed! Mock emails sent successfully ✅",
      timestamp: new Date().toISOString()
    }, { 
      status: 200 
    });

  } catch (error) {
    console.error("💥 API Error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Server error processing order",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { 
      status: 500 
    });
  }
}