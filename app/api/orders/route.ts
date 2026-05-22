import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📦 Creating new order:", {
      customerName: body.customer_name,
      phone: body.phone,
      paymentMethod: body.payment_method,
      totalAmount: body.total || body.total_amount,
      itemCount: body.items?.length || 0,
      deliveryAddress: body.delivery_address
    });

    if (!body.items?.length) {
      return NextResponse.json({ message: "Order must include at least one item" }, { status: 400 });
    }

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

    console.log("✅ Order created successfully:", {
      orderId: order.id,
      status: order.status,
      paymentMethod: order.payment_method
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("❌ Create order error:", error);
    const message = error.message || "Failed to create order";
    const hint =
      /Invalid API key|JWT|service role|permission denied|row-level security/i.test(message)
        ? "Check SUPABASE_SERVICE_ROLE_KEY in .env.local (JWT from Supabase Dashboard → Settings → API)."
        : undefined;
    return NextResponse.json(
      { message, ...(hint ? { hint } : {}), ...(process.env.NODE_ENV === "development" ? { debug: message } : {}) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;

    const orders = await getOrders({ status });

    // Log failed orders summary
    if (status === "failed" || !status) {
      const failedOrders = status === "failed" ? orders : orders.filter(o => o.status === "failed");
      
      console.log(`📊 Failed Orders Summary: Found ${failedOrders.length} failed orders`);
      
      failedOrders.forEach((order, index) => {
        console.log(`❌ Failed Order ${index + 1}:`, {
          orderId: order.id.slice(0, 8),
          customerName: order.customer_name,
          phone: order.phone,
          amount: order.total_amount || order.total || 0,
          paymentMethod: order.payment_method,
          createdAt: order.created_at,
          pesapalTrackingId: order.pesapal_order_tracking_id,
          pesapalPaymentMethod: order.pesapal_payment_method,
          deliveryAddress: order.delivery_address
        });
      });
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

