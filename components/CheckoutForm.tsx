"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  formatPhone,
  validatePhone,
  sanitizeInput,
  validateAmount,
} from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { generateWhatsAppLink, type WhatsAppOrderData } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";
import { DELIVERY_LOCATIONS, SHOP_INFO } from "@/lib/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Analytics } from "@/lib/analytics";

const schema = yup.object({
  name: yup.string().required("Your name is required"),
  phone: yup
    .string()
    .required("Your phone number is required")
    .test("phone-format", "Invalid phone number format", (value) => {
      if (!value) return false;
      return validatePhone(value);
    }),
  whatsapp: yup
    .string()
    .optional()
    .test("phone-format", "Invalid WhatsApp number format", (value) => {
      if (!value) return true; // Optional field
      return validatePhone(value);
    }),
  recipientName: yup.string().required("Recipient name is required"),
  recipientPhone: yup
    .string()
    .required("Recipient phone number is required")
    .test("phone-format", "Invalid phone number format", (value) => {
      if (!value) return false;
      return validatePhone(value);
    }),
  recipientWhatsapp: yup
    .string()
    .optional()
    .test("phone-format", "Invalid WhatsApp number format", (value) => {
      if (!value) return true; // Optional field
      return validatePhone(value);
    }),
  paymentPhone: yup
    .string()
    .optional()
    .test("phone-format", "Invalid payment phone number format", (value) => {
      if (!value) return true; // Optional field
      return validatePhone(value);
    }),
  deliveryLocation: yup.string().required("Delivery location is required"),
  deliveryAddress: yup.string().required("Delivery address is required"),
  giftMessage: yup.string().optional(),
  deliveryInstructions: yup.string().optional(),
});

type CheckoutFormData = yup.InferType<typeof schema>;

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "whatsapp" | null>(null);
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const subtotal = getTotal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema),
  });

  const formData = watch();
  const selectedLocation = formData.deliveryLocation;
  const deliveryFeeInCents = selectedLocation 
    ? (DELIVERY_LOCATIONS.find(loc => loc.name === selectedLocation)?.fee || 0) * 100
    : 0;
  const total = subtotal + deliveryFeeInCents;

  const handleMpesaCheckout = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setPaymentMethod("mpesa");

    try {
      // Get base URL for image links
      const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return imagePath; // Already a full URL
        }
        // Convert relative path to absolute URL
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
      };

      // Use payment phone if provided, otherwise use the customer's phone number
      const paymentPhoneNumber = data.paymentPhone ? formatPhone(data.paymentPhone) : formatPhone(data.phone);

      // Build notes with all order details
      let orderNotes = `Ordered By: ${data.name} (${formatPhone(data.phone)})`;
      if (data.whatsapp) {
        orderNotes += `\nCustomer WhatsApp: https://wa.me/${formatPhone(data.whatsapp).replace(/^\+/, "")}`;
      }
      if (data.paymentPhone && data.paymentPhone !== data.phone) {
        orderNotes += `\nPayment Phone: ${paymentPhoneNumber} (M-Pesa payment will be sent to this number)`;
      } else {
        orderNotes += `\nPayment Phone: ${paymentPhoneNumber} (same as customer phone)`;
      }
      orderNotes += `\n\nRecipient: ${data.recipientName} (${formatPhone(data.recipientPhone)})`;
      if (data.recipientWhatsapp) {
        orderNotes += `\nRecipient WhatsApp: https://wa.me/${formatPhone(data.recipientWhatsapp).replace(/^\+/, "")}`;
      }
      
      orderNotes += `\n\n*Products Ordered:*\n`;
      items.forEach((item, index) => {
        orderNotes += `${index + 1}. ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}\n`;
        if (item.options) {
          orderNotes += `   Options: ${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}\n`;
        }
        // Add product image link
        const imageUrl = getImageUrl(item.image);
        orderNotes += `   📷 Product Image: ${imageUrl}\n`;
      });
      
      if (data.giftMessage) {
        orderNotes += `\n\nGift Message:\n${data.giftMessage}`;
      }
      if (data.deliveryInstructions) {
        orderNotes += `\n\nDelivery Instructions:\n${data.deliveryInstructions}`;
      }

      const orderResponse = await axios.post("/api/orders", {
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          options: item.options,
        })),
        total,
        customer_name: data.name,
        phone: formatPhone(data.phone),
        email: null,
        delivery_address: `${data.deliveryLocation}, ${data.deliveryAddress}`,
        delivery_city: data.deliveryLocation || "Nairobi",
        delivery_date: data.deliveryInstructions || "As per instructions",
        payment_method: "mpesa",
        notes: orderNotes,
      });

      const orderId = orderResponse.data.id;

      // Send email notification
      try {
        const emailSubject = `New Order #${orderId} - M-Pesa Payment`;
        const emailHtml = `
          <h2>New Order Received</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Payment Method:</strong> M-Pesa</p>
          
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Phone:</strong> ${formatPhone(data.phone)}</p>
          ${data.whatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${formatPhone(data.whatsapp).replace(/^\+/, "")}">${formatPhone(data.whatsapp)}</a></p>` : ''}
          ${data.paymentPhone && data.paymentPhone !== data.phone ? `<p><strong>Payment Phone:</strong> ${paymentPhoneNumber} (M-Pesa payment will be sent to this number)</p>` : ''}
          
          <h3>Recipient Information</h3>
          <p><strong>Name:</strong> ${data.recipientName}</p>
          <p><strong>Phone:</strong> ${formatPhone(data.recipientPhone)}</p>
          ${data.recipientWhatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${formatPhone(data.recipientWhatsapp).replace(/^\+/, "")}">${formatPhone(data.recipientWhatsapp)}</a></p>` : ''}
          
          <h3>Delivery Details</h3>
          <p><strong>Location:</strong> ${data.deliveryLocation}</p>
          <p><strong>Address:</strong> ${data.deliveryAddress}</p>
          
          <h3>Order Items</h3>
          <ul>
            ${items.map((item, index) => {
              const imageUrl = getImageUrl(item.image);
              return `
                <li>
                  <strong>${item.name}</strong> x${item.quantity} - ${formatCurrency(item.price * item.quantity)}
                  ${item.options ? `<br/>Options: ${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}` : ''}
                  <br/><a href="${imageUrl}">📷 View Product Image</a>
                </li>
              `;
            }).join('')}
          </ul>
          
          <h3>Pricing</h3>
          <p><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</p>
          <p><strong>Delivery Fee:</strong> ${deliveryFeeInCents === 0 ? "Free" : formatCurrency(deliveryFeeInCents)}</p>
          <p><strong>Total:</strong> ${formatCurrency(total)}</p>
          
          ${data.giftMessage ? `<h3>Gift Message</h3><p>${data.giftMessage.replace(/\n/g, '<br>')}</p>` : ''}
          ${data.deliveryInstructions ? `<h3>Delivery Instructions</h3><p>${data.deliveryInstructions.replace(/\n/g, '<br>')}</p>` : ''}
          
          <hr/>
          <p><small>Order Notes:</small></p>
          <pre style="white-space: pre-wrap; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 4px;">${orderNotes}</pre>
        `;

        await axios.post("/api/email", {
          type: "order",
          subject: emailSubject,
          html: emailHtml,
          message: orderNotes,
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Continue even if email fails
      }

      // Convert amount from cents to KES for M-Pesa (M-Pesa expects amount in KES, not cents)
      const amountInKES = Math.ceil(total / 100);

      const stkResponse = await axios.post("/api/mpesa/stkpush", {
        phone: paymentPhoneNumber,
        amount: amountInKES,
        accountRef: orderId,
        orderId,
      });

      if (stkResponse.data.ResponseCode === "0") {
        // Track purchase
        Analytics.trackPurchase(orderId, total, "mpesa");
        
        // STK push initiated successfully - show success message
        alert("M-Pesa STK Push initiated! Please check your phone and enter your M-Pesa PIN to complete the payment.");
        
        clearCart();
        // Start polling for order status update
        let pollCount = 0;
        const maxPolls = 30; // Poll for 30 seconds (30 * 1s)
        const pollInterval = setInterval(async () => {
          pollCount++;
          try {
            const orderResponse = await axios.get(`/api/orders/${orderId}`);
            const orderStatus = orderResponse.data.status;
            
            if (orderStatus === "paid" || orderStatus === "failed" || pollCount >= maxPolls) {
              clearInterval(pollInterval);
              router.push(`/order/success?id=${orderId}`);
            }
          } catch (error) {
            console.error("Polling error:", error);
            if (pollCount >= maxPolls) {
              clearInterval(pollInterval);
              router.push(`/order/success?id=${orderId}`);
            }
          }
        }, 1000); // Poll every 1 second
        
        // Fallback: navigate after max polls even if status not updated
        setTimeout(() => {
          clearInterval(pollInterval);
          router.push(`/order/success?id=${orderId}`);
        }, maxPolls * 1000);
      } else {
        throw new Error(stkResponse.data.CustomerMessage || "Payment initiation failed");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Checkout failed. Please try again.";
      
      // Show more detailed error for missing configuration
      if (errorMessage.includes("MPESA_PASSKEY") || errorMessage.includes("Passkey")) {
        alert(`M-Pesa Configuration Error:\n\n${errorMessage}\n\nTo get your Passkey:\n1. Go to https://developer.safaricom.co.ke/\n2. Log in to your account\n3. Navigate to your app\n4. Go to STK Push section\n5. Copy the Passkey value\n6. Add it to .env.local as: MPESA_PASSKEY=your_passkey`);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
      setPaymentMethod(null);
    }
  };

  const handleWhatsAppOrder = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setPaymentMethod("whatsapp");
    
    let whatsappLink: string | undefined;
    
    try {
      // Get base URL for image links
      const getImageUrl = (imagePath: string): string => {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath; // Already a full URL
      }
      // Convert relative path to absolute URL
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    };

    // Build WhatsApp message with all details
    let message = `🎁 *New Gift Order*\n\n`;
    message += `*Ordered By:*\n`;
    message += `Name: ${data.name}\n`;
    message += `Phone: ${formatPhone(data.phone)}\n`;
    if (data.whatsapp) {
      message += `WhatsApp: ${formatPhone(data.whatsapp)}\n`;
    }
    message += `\n*Recipient:*\n`;
    message += `Name: ${data.recipientName}\n`;
    message += `Phone: ${formatPhone(data.recipientPhone)}\n`;
    if (data.recipientWhatsapp) {
      message += `WhatsApp: ${formatPhone(data.recipientWhatsapp)}\n`;
    }
    
    message += `\n*Delivery Details:*\n`;
    message += `Location: ${data.deliveryLocation}\n`;
    message += `Address: ${data.deliveryAddress}\n`;
    
    message += `\n*Items:*\n`;
    items.forEach((item) => {
      message += `• ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}\n`;
      if (item.options) {
        message += `  Options: ${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}\n`;
      }
      // Add product image link
      const imageUrl = getImageUrl(item.image);
      message += `  📷 Image: ${imageUrl}\n`;
    });
    
    message += `\n*Pricing:*\n`;
    message += `Subtotal: ${formatCurrency(subtotal)}\n`;
    message += `Delivery Fee: ${deliveryFeeInCents === 0 ? "Free" : formatCurrency(deliveryFeeInCents)}\n`;
    message += `Total: ${formatCurrency(total)}\n`;
    
    if (data.giftMessage) {
      message += `\n*Gift Message:*\n${data.giftMessage}\n`;
    }
    
    if (data.deliveryInstructions) {
      message += `\n*Delivery Instructions:*\n${data.deliveryInstructions}\n`;
    }

    // Create WhatsApp links for phone numbers
    const whatsappLinks: string[] = [];
    if (data.whatsapp) {
      const customerWhatsApp = formatPhone(data.whatsapp);
      whatsappLinks.push(`Customer WhatsApp: https://wa.me/${customerWhatsApp.replace(/^\+/, "")}`);
    }
    if (data.recipientWhatsapp) {
      const recipientWhatsApp = formatPhone(data.recipientWhatsapp);
      whatsappLinks.push(`Recipient WhatsApp: https://wa.me/${recipientWhatsApp.replace(/^\+/, "")}`);
    }
    
    if (whatsappLinks.length > 0) {
      message += `\n*WhatsApp Links:*\n${whatsappLinks.join("\n")}\n`;
    }

    const whatsappData: WhatsAppOrderData = {
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        options: item.options,
      })),
      total: total,
      customerName: data.name,
      phone: formatPhone(data.phone),
      address: `${data.deliveryLocation}, ${data.deliveryAddress}`,
      deliveryDate: data.deliveryInstructions || "As per instructions",
      notes: message,
    };

    whatsappLink = generateWhatsAppLink(whatsappData);
    
    // Send email notification for WhatsApp orders
    try {
      const emailSubject = `New Order - WhatsApp Payment`;
      const emailHtml = `
        <h2>New Order Received</h2>
        <p><strong>Payment Method:</strong> WhatsApp</p>
        
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${formatPhone(data.phone)}</p>
        ${data.whatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${formatPhone(data.whatsapp).replace(/^\+/, "")}">${formatPhone(data.whatsapp)}</a></p>` : ''}
        
        <h3>Recipient Information</h3>
        <p><strong>Name:</strong> ${data.recipientName}</p>
        <p><strong>Phone:</strong> ${formatPhone(data.recipientPhone)}</p>
        ${data.recipientWhatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${formatPhone(data.recipientWhatsapp).replace(/^\+/, "")}">${formatPhone(data.recipientWhatsapp)}</a></p>` : ''}
        
        <h3>Delivery Details</h3>
        <p><strong>Location:</strong> ${data.deliveryLocation}</p>
        <p><strong>Address:</strong> ${data.deliveryAddress}</p>
        
        <h3>Order Items</h3>
        <ul>
          ${items.map((item) => {
            const imageUrl = getImageUrl(item.image);
            return `
              <li>
                <strong>${item.name}</strong> x${item.quantity} - ${formatCurrency(item.price * item.quantity)}
                ${item.options ? `<br/>Options: ${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}` : ''}
                <br/><a href="${imageUrl}">📷 View Product Image</a>
              </li>
            `;
          }).join('')}
        </ul>
        
        <h3>Pricing</h3>
        <p><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</p>
        <p><strong>Delivery Fee:</strong> ${deliveryFeeInCents === 0 ? "Free" : formatCurrency(deliveryFeeInCents)}</p>
        <p><strong>Total:</strong> ${formatCurrency(total)}</p>
        
        ${data.giftMessage ? `<h3>Gift Message</h3><p>${data.giftMessage.replace(/\n/g, '<br>')}</p>` : ''}
        ${data.deliveryInstructions ? `<h3>Delivery Instructions</h3><p>${data.deliveryInstructions.replace(/\n/g, '<br>')}</p>` : ''}
        
        <hr/>
        <p><small>Full Order Details:</small></p>
        <pre style="white-space: pre-wrap; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 4px;">${message}</pre>
      `;

      await axios.post("/api/email", {
        type: "order",
        subject: emailSubject,
        html: emailHtml,
        message: message,
      });
      
      // Email sent successfully, now redirect to WhatsApp
      window.open(whatsappLink, "_blank");
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Even if email fails, still redirect to WhatsApp
      window.open(whatsappLink, "_blank");
    }
    } catch (error) {
      console.error("Error processing WhatsApp order:", error);
      // Even if there's an error, try to redirect to WhatsApp if we have the link
      if (whatsappLink) {
        window.open(whatsappLink, "_blank");
      }
    } finally {
      setIsSubmitting(false);
      setPaymentMethod(null);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    // Validate amount
    if (!validateAmount(total)) {
      alert("Invalid order total. Please contact support.");
      return;
    }

    // Track checkout start
    Analytics.trackCheckoutStart(total, items.length);

    // Sanitize inputs
    const sanitizedData = {
      ...data,
      name: sanitizeInput(data.name),
      deliveryAddress: sanitizeInput(data.deliveryAddress),
      giftMessage: data.giftMessage ? sanitizeInput(data.giftMessage) : undefined,
      deliveryInstructions: data.deliveryInstructions ? sanitizeInput(data.deliveryInstructions) : undefined,
    };

    if (paymentMethod === "mpesa") {
      await handleMpesaCheckout(sanitizedData);
    } else {
      // Default: Submit order (send email then redirect to WhatsApp)
      await handleWhatsAppOrder(sanitizedData);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="border-b border-brand-gray-200 pb-6 mb-6">
        <h3 className="font-heading font-semibold text-lg mb-4">Your Information</h3>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-brand-gray-900 mb-1.5 sm:mb-2">
              Your Name <span className="text-brand-red">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="input-field text-sm sm:text-base"
              placeholder="Full name"
              aria-required="true"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <p className="mt-1 text-xs sm:text-sm text-brand-red">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-brand-gray-900 mb-1.5 sm:mb-2">
              Your Phone <span className="text-brand-red">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="2547XXXXXXXX"
              {...register("phone")}
              className="input-field text-sm sm:text-base"
              aria-required="true"
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && <p className="mt-1 text-xs sm:text-sm text-brand-red">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="paymentPhone" className="block text-xs sm:text-sm font-medium text-brand-gray-900 mb-1.5 sm:mb-2">
              Payment Phone (Optional)
            </label>
            <input
              id="paymentPhone"
              type="tel"
              placeholder="2547XXXXXXXX"
              {...register("paymentPhone")}
              className="input-field text-sm sm:text-base"
              aria-invalid={errors.paymentPhone ? "true" : "false"}
            />
            {errors.paymentPhone && <p className="mt-1 text-xs sm:text-sm text-brand-red">{errors.paymentPhone.message}</p>}
            <p className="mt-1 text-xs text-brand-gray-500 hidden sm:block">
              If different from your phone number above. This is the number that will receive the M-Pesa payment prompt.
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-brand-gray-200 pb-6 mb-6">
        <h3 className="font-heading font-semibold text-lg mb-4">Recipient Information</h3>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="recipientName" className="block text-xs sm:text-sm font-medium text-brand-gray-900 mb-1.5 sm:mb-2">
              Recipient Name <span className="text-brand-red">*</span>
            </label>
            <input
              id="recipientName"
              type="text"
              {...register("recipientName")}
              className="input-field text-sm sm:text-base"
              placeholder="Full name"
              aria-required="true"
              aria-invalid={errors.recipientName ? "true" : "false"}
            />
            {errors.recipientName && <p className="mt-1 text-xs sm:text-sm text-brand-red">{errors.recipientName.message}</p>}
          </div>

          <div>
            <label htmlFor="recipientPhone" className="block text-xs sm:text-sm font-medium text-brand-gray-900 mb-1.5 sm:mb-2">
              Recipient Phone <span className="text-brand-red">*</span>
            </label>
            <input
              id="recipientPhone"
              type="tel"
              placeholder="2547XXXXXXXX"
              {...register("recipientPhone")}
              className="input-field text-sm sm:text-base"
              aria-required="true"
              aria-invalid={errors.recipientPhone ? "true" : "false"}
            />
            {errors.recipientPhone && <p className="mt-1 text-xs sm:text-sm text-brand-red">{errors.recipientPhone.message}</p>}
          </div>

        </div>
      </div>

      <div>
        <label
          htmlFor="deliveryLocation"
          className="block text-xs sm:text-sm font-medium text-brand-gray-900 mb-1.5 sm:mb-2"
        >
          Delivery Location <span className="text-brand-red">*</span>
        </label>
        <select
          id="deliveryLocation"
          {...register("deliveryLocation")}
          className="input-field text-sm sm:text-base"
          aria-required="true"
          aria-invalid={errors.deliveryLocation ? "true" : "false"}
        >
          <option value="">Select delivery location</option>
          {DELIVERY_LOCATIONS.map((location) => (
            <option key={location.name} value={location.name}>
              {location.name} {location.fee === 0 ? "(Free)" : `(+${formatCurrency(location.fee * 100)})`}
            </option>
          ))}
        </select>
        {errors.deliveryLocation && (
          <p className="mt-1 text-xs sm:text-sm text-brand-red">{errors.deliveryLocation.message}</p>
        )}
        {selectedLocation && deliveryFeeInCents > 0 && (
          <p className="mt-1 text-xs text-brand-gray-600">
            Delivery fee: {formatCurrency(deliveryFeeInCents)}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="deliveryAddress"
          className="block text-xs sm:text-sm font-medium text-brand-gray-900 mb-1.5 sm:mb-2"
        >
          Delivery Address <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="deliveryAddress"
          rows={3}
          {...register("deliveryAddress")}
          className="input-field resize-none text-sm sm:text-base"
          placeholder="Enter your detailed address (street, building, apartment, etc.)"
          aria-required="true"
          aria-invalid={errors.deliveryAddress ? "true" : "false"}
        />
        {errors.deliveryAddress && (
          <p className="mt-1 text-xs sm:text-sm text-brand-red">{errors.deliveryAddress.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="giftMessage" className="block text-xs sm:text-sm font-medium text-brand-gray-900 mb-1.5 sm:mb-2">
          Message for the Gift (Optional)
        </label>
        <textarea
          id="giftMessage"
          rows={4}
          {...register("giftMessage")}
          className="input-field resize-none text-sm sm:text-base"
          placeholder="Write a personal message to be included with the gift..."
          aria-invalid={errors.giftMessage ? "true" : "false"}
        />
        {errors.giftMessage && <p className="mt-1 text-xs sm:text-sm text-brand-red">{errors.giftMessage.message}</p>}
      </div>

      <div>
        <label htmlFor="deliveryInstructions" className="block text-xs sm:text-sm font-medium text-brand-gray-900 mb-1.5 sm:mb-2">
          Delivery & Packaging Instructions (Optional)
        </label>
        <textarea
          id="deliveryInstructions"
          rows={4}
          {...register("deliveryInstructions")}
          className="input-field resize-none text-sm sm:text-base"
          placeholder="How should the gift be packaged, delivered, or presented? Include delivery date and time if needed. (e.g., 'Deliver on Dec 25th at 2 PM', 'Surprise delivery', 'Wrap in pink paper', 'Deliver to reception desk')"
          aria-invalid={errors.deliveryInstructions ? "true" : "false"}
        />
        {errors.deliveryInstructions && <p className="mt-1 text-xs sm:text-sm text-brand-red">{errors.deliveryInstructions.message}</p>}
      </div>

      <div className="pt-3 sm:pt-4 border-t border-brand-gray-200">
        <div className="space-y-2 mb-3 sm:mb-4">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-brand-gray-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {selectedLocation && (
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-brand-gray-600">Delivery Fee ({selectedLocation}):</span>
              <span className="font-medium">
                {deliveryFeeInCents === 0 ? "Free" : formatCurrency(deliveryFeeInCents)}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-4 sm:mb-6 text-base sm:text-lg font-semibold border-t border-brand-gray-200 pt-3 sm:pt-4">
          <span>Total:</span>
          <span className="text-brand-green">{formatCurrency(total)}</span>
        </div>

        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-brand-green/5 border border-brand-green/20 rounded-lg">
          <h3 className="font-semibold text-sm sm:text-base text-brand-gray-900 mb-2 sm:mb-3">M-Pesa Payment Details</h3>
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-brand-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-medium min-w-[80px] sm:min-w-[100px]">Paybill:</span>
              <span className="font-mono font-semibold text-brand-green">{SHOP_INFO.mpesa.paybill}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium min-w-[80px] sm:min-w-[100px]">Account:</span>
              <span className="font-mono font-semibold text-brand-green">{SHOP_INFO.mpesa.account}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium min-w-[80px] sm:min-w-[100px]">Till:</span>
              <span className="font-mono font-semibold text-brand-green">{SHOP_INFO.mpesa.till}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              handleSubmit(async (data) => {
                setIsSubmitting(true);
                setPaymentMethod("mpesa");
                await handleMpesaCheckout(data);
              })();
            }}
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
            aria-label="Pay with M-Pesa"
          >
            {isSubmitting && paymentMethod === "mpesa" ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Processing...</span>
                <span className="sm:hidden">Processing</span>
              </>
            ) : (
              <>
                <span>Pay with M-Pesa</span>
              </>
            )}
          </button>

          <button
            type="submit"
            onClick={() => setPaymentMethod("whatsapp")}
            disabled={isSubmitting}
            className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
            aria-label="Submit Order"
          >
            {isSubmitting && paymentMethod === "whatsapp" ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-gray-900 border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Sending Order...</span>
                <span className="sm:hidden">Sending...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Submit Order</span>
                <span className="sm:hidden">Submit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

