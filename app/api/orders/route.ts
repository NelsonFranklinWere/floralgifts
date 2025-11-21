import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const order = await createOrder({
      items: body.items,
      total_amount: body.total || body.total_amount,
      total: body.total || body.total_amount,
      customer_name: body.customer_name,
      phone: body.phone,
      email: body.email || null,
      delivery_address: body.delivery_address,
      delivery_city: body.delivery_city || "Nairobi",
      delivery_date: body.delivery_date,
      payment_method: body.payment_method || "whatsapp",
      status: "pending",
      notes: body.notes || null,
    } as any);

    if (!order) {
      return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;

    const orders = await getOrders({ status });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

