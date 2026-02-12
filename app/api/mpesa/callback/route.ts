import { NextRequest, NextResponse } from "next/server";
import { getOrders, updateOrder } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle M-Pesa direct STK push callback format
    const resultCode = body.Body?.stkCallback?.ResultCode;
    const resultDesc = body.Body?.stkCallback?.ResultDesc;
    const checkoutRequestID = body.Body?.stkCallback?.CheckoutRequestID;
    const callbackMetadata = body.Body?.stkCallback?.CallbackMetadata;

    // Handle Co-op Bank STK push callback format (M-Pesa payments via Co-op Bank)
    const messageReference = body.MessageReference || body.messageReference;
    const transactionStatus = body.TransactionStatus || body.transactionStatus || body.Status;
    const receiptNumber = body.ReceiptNumber || body.receiptNumber || body.TransactionID || body.transactionId;
    const responseCode = body.ResponseCode || body.responseCode;

    let order = null;
    const orders = await getOrders({});

    // M-Pesa direct callback format
    if (checkoutRequestID) {
      order = orders.find((o) => o.mpesa_checkout_request_id === checkoutRequestID);
      
      if (!order) {
        console.error("Order not found for CheckoutRequestID:", checkoutRequestID);
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }

      if (resultCode === "0") {
        const mpesaReceiptNumber =
          callbackMetadata?.Item?.find((item: any) => item.Name === "MpesaReceiptNumber")
            ?.Value || null;

        await updateOrder(order.id, {
          status: "paid",
          mpesa_result_code: resultCode,
          mpesa_receipt_number: mpesaReceiptNumber,
        } as any);

        // Send email notification after successful payment
        try {
          const getImageUrl = (imagePath: string): string => {
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
              return imagePath;
            }
            return `https://floralwhispersgifts.co.ke${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
          };

          const emailSubject = `✅ Payment Confirmed - Order #${order.id.slice(0, 8)}`;
          const emailHtml = `
            <h2>Payment Confirmed - Order Received</h2>
            <p><strong>Payment Method:</strong> M-Pesa STK Push</p>
            <p><strong>Payment Status:</strong> ✅ Paid</p>
            ${mpesaReceiptNumber ? `<p><strong>M-Pesa Receipt:</strong> ${mpesaReceiptNumber}</p>` : ''}
            
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
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

          const { Resend } = await import("resend");
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
          // Don't fail the callback if email fails
        }
      } else {
        await updateOrder(order.id, {
          status: "failed",
          mpesa_result_code: resultCode,
        } as any);
      }
    }
    // Co-op Bank callback format (M-Pesa payments)
    else if (messageReference) {
      // Find order by MessageReference
      order = orders.find((o) => 
        o.notes?.includes(messageReference) || 
        o.mpesa_checkout_request_id === messageReference
      );

      // If not found, try to extract order ID from MessageReference format (FL-{orderId8})
      if (!order && (messageReference.startsWith("FLORAL-") || messageReference.startsWith("FL-"))) {
        const parts = messageReference.split("-");
        if (parts.length >= 2) {
          const orderIdPrefix = parts[1];
          order = orders.find((o) => o.id.startsWith(orderIdPrefix) || o.id.includes(orderIdPrefix));
        }
      }

      if (!order) {
        console.error("Order not found for MessageReference:", messageReference);
        return NextResponse.json({ 
          success: true,
          message: "Callback received but order not found" 
        });
      }

      // Determine payment status
      const isSuccessful = 
        transactionStatus === "Success" || 
        transactionStatus === "SUCCESS" ||
        responseCode === "00" ||
        responseCode === "0" ||
        (receiptNumber && transactionStatus !== "Failed" && transactionStatus !== "FAILED");

      if (isSuccessful) {
        await updateOrder(order.id, {
          status: "paid",
          mpesa_result_code: responseCode || "0",
          mpesa_receipt_number: receiptNumber || null,
          mpesa_checkout_request_id: messageReference,
          notes: `${order.notes || ''}\nPayment confirmed via Co-op Bank STK Push callback. Receipt: ${receiptNumber || 'N/A'}`.trim(),
        } as any);

        // Send email notification after successful payment
        try {
          const getImageUrl = (imagePath: string): string => {
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
              return imagePath;
            }
            return `https://floralwhispersgifts.co.ke${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
          };

          const emailSubject = `✅ Payment Confirmed - Order #${order.id.slice(0, 8)}`;
          const emailHtml = `
            <h2>Payment Confirmed - Order Received</h2>
            <p><strong>Payment Method:</strong> M-Pesa STK Push (via Co-op Bank)</p>
            <p><strong>Payment Status:</strong> ✅ Paid</p>
            ${receiptNumber ? `<p><strong>M-Pesa Receipt:</strong> ${receiptNumber}</p>` : ''}
            
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
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

          const { Resend } = await import("resend");
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
          // Don't fail the callback if email fails
        }
      } else {
        await updateOrder(order.id, {
          status: "pending",
          mpesa_result_code: responseCode || "1",
          mpesa_checkout_request_id: messageReference,
          notes: `${order.notes || ''}\nPayment attempt failed. Status: ${transactionStatus || 'Unknown'}. Order remains pending.`.trim(),
        } as any);
      }
    } else {
      console.error("No CheckoutRequestID or MessageReference in callback:", body);
      return NextResponse.json({ message: "No CheckoutRequestID or MessageReference" }, { status: 400 });
    }

    return NextResponse.json({ message: "Received" });
  } catch (error: any) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { message: error.message || "Callback processing failed" },
      { status: 500 }
    );
  }
}

