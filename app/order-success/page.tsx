"use client";

import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

export const dynamic = "force-dynamic";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}