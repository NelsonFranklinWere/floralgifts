"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency, formatPhone, validatePhone } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { CreditCardIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { Analytics } from "@/lib/analytics";

interface OrderData {
  customer: {
    name: string;
    phone: string;
    whatsapp: string | null;
  };
  recipient: {
    name: string;
    phone: string;
    whatsapp: string | null;
  };
  delivery: {
    location: string;
    address: string;
    instructions: string | null;
  };
  giftMessage: string | null;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    slug: string;
    options?: Record<string, string>;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "stk" | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("pendingOrder");
    if (savedOrder) {
      const data = JSON.parse(savedOrder);
      setOrderData(data);
      setPhone(data.customer.phone.replace(/^\+/, "")); // Pre-fill phone
    } else {
      router.push("/cart");
    }
  }, [router]);

  if (!orderData) {
    return (
      <div className="py-12 bg-white min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gray-600">Loading...</p>
        </div>
      </div>
    );
  }


  const handleSTKPush = async () => {
    if (!phone) {
      setPhoneError("Phone number is required");
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError("Invalid phone number format");
      return;
    }

    setIsProcessing(true);
    setError("");
    setPhoneError("");

    try {
      const formattedPhone = formatPhone(phone);
      const amountInKES = Math.ceil(orderData.total / 100);
      
      // Get base URL for image links
      const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return imagePath;
        }
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
      };

      // Build order notes
      let orderNotes = `Ordered By: ${orderData.customer.name} (${orderData.customer.phone})`;
      if (orderData.customer.whatsapp) {
        orderNotes += `\nCustomer WhatsApp: https://wa.me/${orderData.customer.whatsapp.replace(/^\+/, "")}`;
      }
      orderNotes += `\nPayment Phone: ${formattedPhone}`;
      orderNotes += `\n\nRecipient: ${orderData.recipient.name} (${orderData.recipient.phone})`;
      if (orderData.recipient.whatsapp) {
        orderNotes += `\nRecipient WhatsApp: https://wa.me/${orderData.recipient.whatsapp.replace(/^\+/, "")}`;
      }
      orderNotes += `\n\n*Products Ordered:*\n`;
      orderData.items.forEach((item, index) => {
        orderNotes += `${index + 1}. ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}\n`;
        if (item.options) {
          orderNotes += `   Options: ${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}\n`;
        }
        const imageUrl = getImageUrl(item.image);
        orderNotes += `   📷 Product Image: ${imageUrl}\n`;
      });
      if (orderData.giftMessage) {
        orderNotes += `\n\nGift Message:\n${orderData.giftMessage}`;
      }
      if (orderData.delivery.instructions) {
        orderNotes += `\n\nDelivery Instructions:\n${orderData.delivery.instructions}`;
      }

      // Create order in database
      const orderResponse = await axios.post("/api/orders", {
        items: orderData.items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          options: item.options,
        })),
        total: orderData.total,
        customer_name: orderData.customer.name,
        phone: orderData.customer.phone,
        email: null,
        delivery_address: `${orderData.delivery.location}, ${orderData.delivery.address}`,
        delivery_city: orderData.delivery.location || "Nairobi",
        delivery_date: orderData.delivery.instructions || "As per instructions",
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
          <p><strong>Name:</strong> ${orderData.customer.name}</p>
          <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
          ${orderData.customer.whatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${orderData.customer.whatsapp.replace(/^\+/, "")}">${orderData.customer.whatsapp}</a></p>` : ''}
          <p><strong>Payment Phone:</strong> ${formattedPhone}</p>
          
          <h3>Recipient Information</h3>
          <p><strong>Name:</strong> ${orderData.recipient.name}</p>
          <p><strong>Phone:</strong> ${orderData.recipient.phone}</p>
          ${orderData.recipient.whatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${orderData.recipient.whatsapp.replace(/^\+/, "")}">${orderData.recipient.whatsapp}</a></p>` : ''}
          
          <h3>Delivery Details</h3>
          <p><strong>Location:</strong> ${orderData.delivery.location}</p>
          <p><strong>Address:</strong> ${orderData.delivery.address}</p>
          
          <h3>Order Items</h3>
          <ul>
            ${orderData.items.map((item) => {
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
          <p><strong>Subtotal:</strong> ${formatCurrency(orderData.subtotal)}</p>
          <p><strong>Delivery Fee:</strong> ${orderData.deliveryFee === 0 ? "Free" : formatCurrency(orderData.deliveryFee)}</p>
          <p><strong>Total:</strong> ${formatCurrency(orderData.total)}</p>
          
          ${orderData.giftMessage ? `<h3>Gift Message</h3><p>${orderData.giftMessage.replace(/\n/g, '<br>')}</p>` : ''}
          ${orderData.delivery.instructions ? `<h3>Delivery Instructions</h3><p>${orderData.delivery.instructions.replace(/\n/g, '<br>')}</p>` : ''}
          
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

      // Initiate STK Push
      const stkResponse = await axios.post("/api/mpesa/stkpush", {
        phone: formattedPhone,
        amount: amountInKES,
        accountRef: orderId,
        orderId,
      });

      if (stkResponse.data.ResponseCode === "0") {
        // Track purchase
        Analytics.trackPurchase(orderId, orderData.total, "mpesa");
        
        // Generate WhatsApp link and redirect
        const whatsappData = {
          orderId,
          customerName: orderData.customer.name,
          customerPhone: orderData.customer.phone,
          recipientName: orderData.recipient.name,
          recipientPhone: orderData.recipient.phone,
          items: orderData.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: orderData.total,
          deliveryLocation: orderData.delivery.location,
          deliveryAddress: orderData.delivery.address,
          notes: orderNotes,
        };

        const whatsappLink = generateWhatsAppLink(whatsappData);
        
        // Clear session storage and cart
        sessionStorage.removeItem("pendingOrder");
        clearCart();
        
        // Redirect to WhatsApp
        window.open(whatsappLink, "_blank");
        
        // Also redirect to success page
        router.push(`/order/success?orderId=${orderId}`);
      } else {
        throw new Error(stkResponse.data.CustomerMessage || "Payment initiation failed");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.response?.data?.message || err.message || "An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = () => {
    // Card payment integration will go here
    setError("Card payment is coming soon!");
  };


  return (
    <div className="py-6 sm:py-12 bg-white min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-brand-gray-900 mb-6 sm:mb-8">
          Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <div className="card p-4 sm:p-6 mb-6">
              <h2 className="font-heading font-semibold text-lg sm:text-xl mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {orderData.items.map((item, index) => {
                  const itemKey = `${item.id}-${JSON.stringify(item.options || {})}-${index}`;
                  return (
                    <div key={itemKey} className="flex items-center gap-3 pb-3 border-b border-brand-gray-200 last:border-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg bg-brand-gray-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base text-brand-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs sm:text-sm text-brand-gray-600">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-brand-green">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-brand-gray-200 pt-4">
                <div className="flex justify-between text-sm sm:text-base mb-2">
                  <span className="text-brand-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base mb-2">
                  <span className="text-brand-gray-600">Delivery Fee:</span>
                  <span className="font-medium">{formatCurrency(orderData.deliveryFee)}</span>
                </div>
                <div className="flex justify-between items-center text-lg sm:text-xl font-semibold border-t border-brand-gray-200 pt-4 mt-4">
                  <span>Total:</span>
                  <span className="text-brand-green">{formatCurrency(orderData.total)}</span>
                </div>
              </div>
            </div>

            <div className="card p-4 sm:p-6">
              <h2 className="font-heading font-semibold text-lg sm:text-xl mb-6">Select Payment Method</h2>

              {error && (
                <div className="mb-4 p-4 bg-brand-red/10 border border-brand-red rounded-lg text-brand-red text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-row gap-3 sm:gap-4">
                {/* Card Payment Option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card");
                    handleCardPayment();
                  }}
                  className="flex-1 card p-3 sm:p-6 text-left hover:shadow-cardHover transition-all border-2 border-transparent hover:border-brand-green group"
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-brand-gray-100 rounded-lg group-hover:bg-brand-green/10 transition-colors">
                      <CreditCardIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-gray-600 group-hover:text-brand-green" />
                    </div>
                    <div className="flex-1 text-center">
                      <h3 className="font-heading font-semibold text-xs sm:text-lg text-brand-gray-900 mb-1">
                        Card Payment
                      </h3>
                      <p className="text-xs text-brand-gray-600 hidden sm:block">
                        Pay securely with your debit or credit card
                      </p>
                    </div>
                  </div>
                </button>

                {/* STK Push Option */}
                <div className="flex-1 card p-3 sm:p-6 border-2 border-transparent hover:border-brand-green transition-all">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stk")}
                    className="w-full text-left"
                  >
                    <div className="flex flex-col items-center gap-2 sm:gap-4 mb-0 sm:mb-4">
                      <div className="p-2 sm:p-3 bg-brand-gray-100 rounded-lg">
                        <DevicePhoneMobileIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-gray-600" />
                      </div>
                      <div className="flex-1 text-center">
                        <h3 className="font-heading font-semibold text-xs sm:text-lg text-brand-gray-900 mb-1">
                          M-Pesa STK Push
                        </h3>
                        <p className="text-xs text-brand-gray-600 hidden sm:block">
                          Pay instantly via M-Pesa on your phone
                        </p>
                      </div>
                    </div>
                  </button>

                  {paymentMethod === "stk" && (
                    <div className="mt-4 pt-4 border-t border-brand-gray-200">
                      <label htmlFor="phone" className="block text-sm font-medium text-brand-gray-900 mb-2">
                        Phone Number <span className="text-brand-red">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setPhoneError("");
                        }}
                        placeholder="2547XXXXXXXX"
                        className="input-field text-sm sm:text-base w-full"
                        aria-invalid={phoneError ? "true" : "false"}
                      />
                      {phoneError && (
                        <p className="mt-1 text-xs sm:text-sm text-brand-red">{phoneError}</p>
                      )}
                      <p className="mt-2 text-xs text-brand-gray-500">
                        Enter your M-Pesa registered phone number
                      </p>
                      <button
                        type="button"
                        onClick={handleSTKPush}
                        disabled={isProcessing}
                        className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? "Processing..." : `Pay ${formatCurrency(orderData.total)} with M-Pesa`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="font-heading font-semibold text-base sm:text-lg mb-4">Payment Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-brand-gray-900 mb-1">Till:</p>
                  <p className="font-mono font-semibold text-brand-green">{SHOP_INFO.mpesa.till}</p>
                </div>
                <div>
                  <p className="font-semibold text-brand-gray-900 mb-1">PayBill:</p>
                  <p className="font-mono font-semibold text-brand-green">
                    {SHOP_INFO.mpesa.paybill} <span className="text-brand-gray-600">Acc.</span> {SHOP_INFO.mpesa.account}
                  </p>
                </div>
                <div className="pt-3 border-t border-brand-gray-200">
                  <p className="text-brand-gray-600 text-xs">
                    For M-Pesa payments, you will receive a prompt on your phone to complete the payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

