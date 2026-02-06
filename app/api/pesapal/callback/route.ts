import { NextRequest, NextResponse } from "next/server";
import { checkPesapalPaymentStatus } from "@/lib/pesapal";
import { formatCurrency } from "@/lib/utils";
import { Resend } from "resend";
import { SHOP_INFO } from "@/lib/constants";
import { getOrderById, updateOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Pesapal callback received:", JSON.stringify(body, null, 2));

    const {
      OrderTrackingId,
      OrderMerchantReference,
      OrderNotificationType,
    } = body;

    // Validate required fields
    if (!OrderTrackingId || !OrderMerchantReference) {
      console.error("Missing required fields in Pesapal callback");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update order status in database
    const orderId = OrderMerchantReference;

    // Find the order in database
    console.log("🔍 Pesapal: Looking up order:", { orderId });
    const order = await getOrderById(orderId);

    if (!order) {
      console.error("❌ Pesapal: Order not found in database:", { orderId, searchAttempted: true });
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("✅ Pesapal: Order found:", {
      orderId: order.id,
      currentStatus: order.status,
      customerName: order.customer_name,
      totalAmount: order.total_amount || order.total,
      paymentMethod: order.payment_method,
      createdAt: order.created_at
    });

    // Fetch actual payment status from Pesapal API
    let paymentStatus: any = null;
    console.log("🔍 Fetching Pesapal status for:", OrderTrackingId);
    try {
      paymentStatus = await checkPesapalPaymentStatus({ order_tracking_id: OrderTrackingId });
      console.log("📊 Pesapal status response:", JSON.stringify(paymentStatus, null, 2));
    } catch (statusError) {
      console.error("❌ Failed to fetch payment status:", { error: statusError, orderTrackingId: OrderTrackingId });
    }

    // Determine order status from Pesapal response
    let newStatus = "pending";
    let confirmationCode = "";
    let paymentMethod = "";

    if (paymentStatus) {
      // Pesapal status_code: 0 = INVALID, 1 = COMPLETED, 2 = FAILED, 3 = REVERSED
      // Note: status_code is numeric, payment_status_description is a string
      const statusCode = paymentStatus.status_code;
      const statusDesc = paymentStatus.payment_status_description?.toUpperCase();

      if (statusCode === 1 || statusDesc === "COMPLETED") {
        newStatus = "paid";
      } else if (statusCode === 2 || statusDesc === "FAILED") {
        newStatus = "failed";
      } else if (statusCode === 3 || statusDesc === "REVERSED") {
        newStatus = "failed";
      }

      confirmationCode = paymentStatus.confirmation_code || "";
      paymentMethod = paymentStatus.payment_method || "";

      console.log(`📊 Pesapal status: code=${statusCode}, desc=${statusDesc}, newStatus=${newStatus}`);
    } else {
      console.log("⚠️ Pesapal: No payment status received, keeping order as pending");
    }

    console.log("🔄 Pesapal: Updating order status:", {
      orderId,
      previousStatus: order.status,
      newStatus,
      orderTrackingId: OrderTrackingId,
      paymentMethod,
      confirmationCode
    });

    const updateData: any = {
      status: newStatus,
      pesapal_order_tracking_id: OrderTrackingId,
      pesapal_payment_method: paymentMethod,
      updated_at: new Date().toISOString(),
    };

    if (confirmationCode) {
      updateData.pesapal_confirmation_code = confirmationCode;
    }

    const updatedOrder = await updateOrder(orderId, updateData);

    if (!updatedOrder) {
      console.error("❌ Pesapal: Error updating order in database:", { orderId, updateData });
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    console.log("✅ Pesapal: Order updated successfully:", {
      orderId: updatedOrder.id,
      previousStatus: order.status,
      newStatus: updatedOrder.status,
      pesapalTrackingId: updatedOrder.pesapal_order_tracking_id,
      confirmationCode: updatedOrder.pesapal_confirmation_code
    });

    // Send email notification for successful payments
    if (newStatus === "paid") {
      try {
        const getImageUrl = (imagePath: string): string => {
          if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
          }
          return `https://floralwhispersgifts.co.ke${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
        };

        const emailSubject = `✅ Payment Confirmed - Order #${orderId.slice(0, 8)}`;
        const emailHtml = `
          <h2>Payment Confirmed - Order Received</h2>
          <p><strong>Payment Method:</strong> ${paymentMethod || 'Pesapal'}</p>
          <p><strong>Payment Status:</strong> ✅ Paid</p>
          ${confirmationCode ? `<p><strong>Confirmation Code:</strong> ${confirmationCode}</p>` : ''}

          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> ${orderId.slice(0, 8)}</p>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
          <p><strong>Delivery Date:</strong> ${order.delivery_date}</p>

          <h3>Order Items</h3>
          <ul>
            ${(order.items || []).map((item: any) => {
              const imageUrl = item.image ? getImageUrl(item.image) : '';
              return `
                <li>
                  <strong>${item.name || 'Item'}</strong> x${item.quantity || 1} - ${formatCurrency((item.price || 0) * (item.quantity || 1))}
                  ${item.options ? `<br/>Options: ${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}` : ''}
                  ${imageUrl ? `<br/><a href="${imageUrl}">📷 View Product Image</a>` : ''}
                </li>
              `;
            }).join('')}
          </ul>

          <h3>Pricing</h3>
          <p><strong>Total Amount:</strong> ${formatCurrency(order.total_amount || order.total || 0)}</p>

          ${order.notes ? `<h3>Order Notes</h3><p>${order.notes.replace(/\n/g, '<br>')}</p>` : ''}

          <hr/>
          <p><strong>Action Required:</strong> Process and prepare this order for delivery.</p>
        `;

        const resend = new Resend(process.env.RESEND_API_KEY || "re_jE9T351o_6gDh55gy8PHW4LWZJENwXFKR");
        const recipientEmail = process.env.ADMIN_EMAIL || "whispersfloral@gmail.com";
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

        const emailResult = await resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        if (emailResult.error) {
          console.error('Email sending error:', emailResult.error);
        } else {
          console.log('Email notification sent successfully:', emailResult.data?.id);
        }
      } catch (emailErr) {
        console.error('Failed to send email notification:', emailErr);
      }
    }

    console.log(`💰 Pesapal payment ${newStatus} for order ${orderId}`);

    // Log summary for failed payments
    if (newStatus === "failed") {
      console.log("❌ Pesapal: Payment failure summary:", {
        orderId,
        customerName: order.customer_name,
        phone: order.phone,
        amount: order.total_amount || order.total,
        paymentMethod,
        failureReason: paymentStatus?.payment_status_code || 'unknown',
        orderTrackingId: OrderTrackingId
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Callback processed successfully"
    });

  } catch (error: any) {
    console.error("Pesapal callback error:", error);
    return NextResponse.json(
      {
        error: "Callback processing failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for Pesapal redirects (optional)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get('OrderTrackingId');
  const orderMerchantReference = searchParams.get('OrderMerchantReference');

  if (orderTrackingId && orderMerchantReference) {
    // Redirect to order success page
    const redirectUrl = `/order/success?id=${orderMerchantReference}&pesapal_tracking_id=${orderTrackingId}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.json({ error: "Invalid redirect parameters" }, { status: 400 });
}
