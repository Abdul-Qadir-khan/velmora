import { NextResponse } from "next/server";

let orders: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    orders.push(order);

    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(orders);
}