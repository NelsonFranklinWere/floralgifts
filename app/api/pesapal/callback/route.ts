import { NextRequest, NextResponse } from "next/server";
import { verifyPesapalIPN } from "@/lib/pesapal";
import { formatCurrency } from "@/lib/utils";
import { Resend } from "resend";
import { SHOP_INFO } from "@/lib/constants";
import { getOrderById, updateOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Pesapal callback received:", JSON.stringify(body, null, 2));

    // Verify the IPN notification
    if (!verifyPesapalIPN(body)) {
      console.error("Invalid Pesapal IPN notification");
      return NextResponse.json({ error: "Invalid notification" }, { status: 400 });
    }

    const {
      OrderTrackingId,
      OrderMerchantReference,
      OrderNotificationType,
      Status,
      Amount,
      Currency,
      ConfirmationCode,
      PaymentMethod,
    } = body;

    // Update order status in database
    const orderId = OrderMerchantReference;

    if (!orderId) {
      console.error("No order ID in Pesapal callback");
      return NextResponse.json({ error: "No order ID" }, { status: 400 });
    }

    // Find the order in database
    const order = await getOrderById(orderId);

    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order with Pesapal payment details
    let newStatus = "pending";
    if (Status === "COMPLETED" || Status === "200") {
      newStatus = "paid";
    } else if (Status === "FAILED" || Status === "400") {
      newStatus = "failed";
    }

    const updateData: any = {
      status: newStatus,
      pesapal_order_tracking_id: OrderTrackingId,
      pesapal_payment_method: PaymentMethod,
      updated_at: new Date().toISOString(),
    };

    if (ConfirmationCode) {
      updateData.pesapal_confirmation_code = ConfirmationCode;
    }

    const updatedOrder = await updateOrder(orderId, updateData);

    if (!updatedOrder) {
      console.error("Error updating order:", orderId);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

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
          <p><strong>Payment Method:</strong> Card Payment (Pesapal)</p>
          <p><strong>Payment Status:</strong> ✅ Paid</p>
          ${ConfirmationCode ? `<p><strong>Confirmation Code:</strong> ${ConfirmationCode}</p>` : ''}

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

    console.log(`Pesapal payment ${newStatus} for order ${orderId}`);

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
