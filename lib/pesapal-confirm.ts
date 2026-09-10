import { checkPesapalPaymentStatus } from "@/lib/pesapal";
import { getOrderById, updateOrder } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Resend } from "resend";

export type PesapalProcessResult = {
  orderId: string;
  status: "paid" | "failed" | "pending" | "not_found" | "error";
  message?: string;
};

/**
 * Verify a Pesapal transaction and mark the order paid/failed when appropriate.
 * Used by IPN (POST), browser redirect (GET), and client-side status checks.
 */
export async function processPesapalPaymentConfirmation(params: {
  orderId: string;
  orderTrackingId: string;
  sendEmail?: boolean;
}): Promise<PesapalProcessResult> {
  const { orderId, orderTrackingId, sendEmail = true } = params;

  const order = await getOrderById(orderId);
  if (!order) {
    return { orderId, status: "not_found", message: "Order not found" };
  }

  // Already finalized
  if (order.status === "paid") {
    return { orderId, status: "paid" };
  }
  if (order.status === "failed" || order.status === "cancelled") {
    return { orderId, status: order.status as "failed" };
  }

  let paymentStatus: any = null;
  try {
    paymentStatus = await checkPesapalPaymentStatus({
      order_tracking_id: orderTrackingId,
    });
  } catch (err: any) {
    console.error("[Pesapal] status check failed:", err?.message || err);
    // Still store tracking id while pending
    await updateOrder(orderId, {
      pesapal_order_tracking_id: orderTrackingId,
    } as any);
    return {
      orderId,
      status: "pending",
      message: err?.message || "Status check failed",
    };
  }

  const statusCode = paymentStatus?.status_code ?? paymentStatus?.payment_status_code;
  const statusDesc = String(
    paymentStatus?.payment_status_description || paymentStatus?.status || ""
  ).toUpperCase();

  // Pesapal: COMPLETED / status_code 1 (some responses use payment_status_code)
  // Also accept string "COMPLETED" / "SUCCESS"
  let newStatus: "paid" | "failed" | "pending" = "pending";
  if (
    statusCode === 1 ||
    statusDesc === "COMPLETED" ||
    statusDesc === "SUCCESS" ||
    statusDesc.includes("COMPLETE")
  ) {
    newStatus = "paid";
  } else if (
    statusCode === 2 ||
    statusCode === 3 ||
    statusDesc === "FAILED" ||
    statusDesc === "REVERSED" ||
    statusDesc === "INVALID"
  ) {
    newStatus = "failed";
  }

  const confirmationCode =
    paymentStatus?.confirmation_code ||
    paymentStatus?.confirmationCode ||
    "";
  const paymentMethod =
    paymentStatus?.payment_method || paymentStatus?.paymentMethod || "";

  const updated = await updateOrder(orderId, {
    status: newStatus,
    pesapal_order_tracking_id: orderTrackingId,
    pesapal_payment_method: paymentMethod || order.pesapal_payment_method || null,
    ...(confirmationCode
      ? { pesapal_confirmation_code: confirmationCode }
      : {}),
  } as any);

  if (!updated) {
    return { orderId, status: "error", message: "Failed to update order" };
  }

  if (newStatus === "paid" && sendEmail) {
    try {
      await sendPesapalPaidEmail({
        order,
        orderId,
        confirmationCode,
        paymentMethod,
      });
    } catch (emailErr) {
      console.error("[Pesapal] email failed:", emailErr);
    }
  }

  return { orderId, status: newStatus };
}

async function sendPesapalPaidEmail({
  order,
  orderId,
  confirmationCode,
  paymentMethod,
}: {
  order: any;
  orderId: string;
  confirmationCode: string;
  paymentMethod: string;
}) {
  const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `https://floralwhispersgifts.co.ke${
      imagePath.startsWith("/") ? imagePath : `/${imagePath}`
    }`;
  };

  const emailSubject = `✅ Payment Confirmed - Order #${orderId.slice(0, 8)}`;
  const emailHtml = `
    <h2>Payment Confirmed - Order Received</h2>
    <p><strong>Payment Method:</strong> ${paymentMethod || "Pesapal"}</p>
    <p><strong>Payment Status:</strong> ✅ Paid</p>
    ${confirmationCode ? `<p><strong>Confirmation Code:</strong> ${confirmationCode}</p>` : ""}
    <h3>Order Information</h3>
    <p><strong>Order ID:</strong> ${orderId.slice(0, 8)}</p>
    <p><strong>Customer:</strong> ${order.customer_name}</p>
    <p><strong>Phone:</strong> ${order.phone}</p>
    <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
    <p><strong>Delivery Date:</strong> ${order.delivery_date}</p>
    <h3>Order Items</h3>
    <ul>
      ${(order.items || [])
        .map((item: any) => {
          const imageUrl = item.image ? getImageUrl(item.image) : "";
          return `
            <li>
              <strong>${item.name || "Item"}</strong> x${item.quantity || 1} - ${formatCurrency(
                (item.price || 0) * (item.quantity || 1)
              )}
              ${
                item.options
                  ? `<br/>Options: ${Object.entries(item.options)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}`
                  : ""
              }
              ${imageUrl ? `<br/><a href="${imageUrl}">View Product Image</a>` : ""}
            </li>
          `;
        })
        .join("")}
    </ul>
    <p><strong>Total Amount:</strong> ${formatCurrency(
      order.total_amount || order.total || 0
    )}</p>
  `;

  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const recipientEmail = process.env.ADMIN_EMAIL || "whispersfloral@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  await resend.emails.send({
    from: fromEmail,
    to: recipientEmail,
    subject: emailSubject,
    html: emailHtml,
  });
}
