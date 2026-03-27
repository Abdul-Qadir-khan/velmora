import { NextResponse } from "next/server";
import { orders } from "../orders-storage";

export async function GET() {
  return NextResponse.json(orders);
}