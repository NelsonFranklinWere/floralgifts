import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate order exists
    const existingOrder = await getOrderById(id);
    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Update order
    const updatedOrder = await updateOrder(id, body as any);

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

