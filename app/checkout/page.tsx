"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency, formatPhone, validatePhone } from "@/lib/utils";
import { SHOP_INFO, DELIVERY_LOCATIONS } from "@/lib/constants";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import axios from "axios";
import { CreditCardIcon, DevicePhoneMobileIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Analytics } from "@/lib/analytics";

interface OrderData {
  customer: {
    name: string;
    phone: string;
    email?: string;
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
  const { items, getTotal, clearCart } = useCartStore();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stk" | "till" | "paybill" | "pesapal" | null>(null);
  const [stkPhone, setStkPhone] = useState("");
  const [stkError, setStkError] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailNewsletter, setEmailNewsletter] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("Nairobi");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [billingSame, setBillingSame] = useState(false);
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingApartment, setBillingApartment] = useState("");
  const [billingCity, setBillingCity] = useState("Nairobi");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState("");
  const [showTip, setShowTip] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [phoneError, setPhoneError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If cart is empty, redirect to cart
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    // Check if there's saved order data in sessionStorage
    const savedOrder = sessionStorage.getItem("pendingOrder");
    if (savedOrder) {
      try {
        const data = JSON.parse(savedOrder);
        setOrderData(data);
        setPhone(data.customer?.phone?.replace(/^\+/, "") || "");
        setEmail(data.customer?.email || "");
        if (data.recipient?.name) {
          const nameParts = data.recipient.name.split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");
        }
        setAddress(data.delivery?.address || "");
        setCity(data.delivery?.location || "Nairobi");
        setPhoneNumber(data.recipient?.phone?.replace(/^\+/, "") || "");
      } catch (error) {
        console.error("Error parsing saved order:", error);
        // Initialize from cart
        const cartSubtotal = getTotal();
        setOrderData({
          customer: { name: "", phone: "", email: "", whatsapp: null },
          recipient: { name: "", phone: "", whatsapp: null },
          delivery: { location: "Nairobi", address: "", instructions: null },
          giftMessage: null,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            slug: item.slug,
            options: item.options,
          })),
          deliveryFee: 0,
          total: cartSubtotal,
          subtotal: cartSubtotal,
        });
      }
    } else {
      // Initialize orderData from cart
      const cartSubtotal = getTotal();
      setOrderData({
        customer: { name: "", phone: "", email: "", whatsapp: null },
        recipient: { name: "", phone: "", whatsapp: null },
        delivery: { location: "Nairobi", address: "", instructions: null },
        giftMessage: null,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          slug: item.slug,
          options: item.options,
        })),
        deliveryFee: 0,
        total: cartSubtotal,
        subtotal: cartSubtotal,
      });
    }
  }, [router, items.length, getTotal, items]);

  // Show loading only while redirecting or if cart is empty
  if (items.length === 0 || !orderData) {
    return (
      <div className="py-12 bg-white min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gray-600">{items.length === 0 ? "Redirecting to cart..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  const subtotal = orderData?.subtotal || getTotal();
  // Convert delivery fee from regular currency to cents (multiply by 100)
  const deliveryFeeInCents = (orderData?.deliveryFee || 0) * 100;
  const tipValue = tipAmount !== null ? (tipAmount === 0 ? 0 : Math.round(subtotal * (tipAmount / 100))) : 0;
  const total = subtotal + deliveryFeeInCents + tipValue;

  const handleSTKPush = async () => {
    console.log("💳 Checkout: Starting payment process:", {
      paymentMethod,
      total,
      itemCount: (orderData?.items || items).length,
      customerName: firstName && lastName ? `${firstName} ${lastName}`.trim() : "Customer"
    });
    
    setIsProcessing(true);
    setError("");
    setStkError("");

    try {
      // Handle STK Push (M-Pesa) via Co-op Bank API directly - NO Pesapal redirect
      if (paymentMethod === "stk") {
        if (!stkPhone || !validatePhone(stkPhone)) {
          setStkError("Please enter a valid M-Pesa phone number (format: 2547XXXXXXXX)");
          setIsProcessing(false);
          return;
        }

        // Create order in database
        const orderResponse = await axios.post("/api/orders", {
          items: (orderData?.items || items).map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            options: item.options,
          })),
          total: total,
          customer_name: firstName && lastName ? `${firstName} ${lastName}`.trim() : "Customer",
          phone: formatPhone(stkPhone),
          email: email || null,
          delivery_address: address || "To be confirmed",
          delivery_city: city || "Nairobi",
          delivery_date: new Date().toISOString(),
          payment_method: "mpesa",
          notes: `M-Pesa STK Push payment initiated. Phone: ${stkPhone}`,
        });

        const orderId = orderResponse.data.id;

        // Initiate direct Co-op Bank STK Push (no Pesapal redirect)
        console.log("💳 Checkout: Initiating direct Co-op Bank STK Push:", {
          orderId,
          phone: stkPhone,
          amount: total
        });

        const stkResponse = await axios.post("/api/coopbank/stkpush", {
          MobileNumber: stkPhone,
          Amount: total, // Amount in cents (API will convert to KES)
          MessageReference: `FL-${orderId.slice(0, 8)}`, // Use order ID as message reference
          Narration: `Floral Whispers Order #${orderId.slice(0, 8)}`,
        });

        if (stkResponse.data.success && stkResponse.data.data?.ResponseCode === "00") {
          console.log("✅ Checkout: Co-op Bank STK Push initiated successfully:", {
            orderId,
            messageReference: stkResponse.data.data.MessageReference,
            responseDescription: stkResponse.data.data.ResponseDescription
          });
          
          // Store order ID in session for callback handling
          sessionStorage.setItem("pendingOrder", JSON.stringify({
            id: orderId,
            total: total,
            paymentMethod: "mpesa",
            messageReference: stkResponse.data.data.MessageReference,
          }));

          // Track the purchase attempt
          Analytics.trackPurchase(orderId, total, "mpesa");

          // Redirect to success page with pending status
          // The success page will poll for payment confirmation
          router.push(`/order/success?id=${orderId}&pending=true`);
          return;
        } else {
          console.error("❌ Checkout: Co-op Bank STK Push initiation failed:", stkResponse.data);
          setStkError(
            stkResponse.data.data?.ResponseDescription || 
            stkResponse.data.message || 
            "Failed to initiate M-Pesa STK push. Please try again."
          );
          setIsProcessing(false);
          return;
        }
      }

      // Handle Till or Paybill - redirect to WhatsApp
      if (paymentMethod === "till" || paymentMethod === "paybill") {
        // Create order in database
        const orderResponse = await axios.post("/api/orders", {
          items: (orderData?.items || items).map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            options: item.options,
          })),
          total: total,
          customer_name: firstName && lastName ? `${firstName} ${lastName}`.trim() : "Customer",
          phone: formatPhone(phoneNumber || phone),
          email: email || null,
          delivery_address: address || "To be confirmed",
          delivery_city: city || "Nairobi",
          delivery_date: new Date().toISOString(),
          payment_method: paymentMethod === "till" ? "mpesa_till" : "mpesa_paybill",
          notes: `Payment via ${paymentMethod === "till" ? "M-Pesa Till Number" : "M-Pesa Paybill"}. Total: ${formatCurrency(total)}`,
        });

        const orderId = orderResponse.data.id;

        // Generate WhatsApp message with order details
        let orderMessage = `*NEW ORDER #${orderId}*\n\n`;
        orderMessage += `*Items:*\n`;
        (orderData?.items || items).forEach((item, index) => {
          orderMessage += `${index + 1}. ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}\n`;
          if (item.options) {
            orderMessage += `   Options: ${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}\n`;
          }
        });
        orderMessage += `\n*Total: ${formatCurrency(total)}*\n`;
        orderMessage += `*Payment Method: ${paymentMethod === "till" ? "M-Pesa Till Number" : "M-Pesa Paybill"}*\n\n`;
        orderMessage += `Please confirm this order and complete payment.`;

        // Create WhatsApp link
        const encoded = encodeURIComponent(orderMessage);
        const whatsappLink = `https://wa.me/${SHOP_INFO.whatsapp}?text=${encoded}`;

        // Clear cart and redirect
        sessionStorage.removeItem("pendingOrder");
        clearCart();
        
        // Open WhatsApp
        window.open(whatsappLink, "_blank");
        
        // Track order
        Analytics.trackPurchase(orderId, total, paymentMethod || "whatsapp");
        
        // Redirect to success page
        router.push(`/order/success?orderId=${orderId}`);
        return;
      }

      // Handle Pesapal Card Payment
      if (paymentMethod === "pesapal") {
        // Create order in database
        const orderResponse = await axios.post("/api/orders", {
          items: (orderData?.items || items).map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            options: item.options,
          })),
          total: total,
          customer_name: firstName && lastName ? `${firstName} ${lastName}`.trim() : "Customer",
          phone: formatPhone(phoneNumber || phone),
          email: email || null,
          delivery_address: address || "To be confirmed",
          delivery_city: city || "Nairobi",
          delivery_date: new Date().toISOString(),
          payment_method: "card",
          notes: `Card payment initiated via Pesapal`,
        });

        const orderId = orderResponse.data.id;

        // Prepare billing address for Pesapal
        const billingAddress = {
          email_address: email || "",
          phone_number: formatPhone(phoneNumber || phone),
          country_code: "KE",
          first_name: firstName || "Customer",
          middle_name: "",
          last_name: lastName || "",
          line_1: address || "To be confirmed",
          line_2: apartment || "",
          city: city || "Nairobi",
          state: city || "Nairobi",
          postal_code: postalCode || "",
          zip_code: postalCode || "",
        };

        // Initiate Pesapal payment
        const callbackUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/api/pesapal/callback`
          : "https://floralwhispersgifts.co.ke/api/pesapal/callback";

        const pesapalResponse = await axios.post("/api/pesapal/payment", {
          orderId: orderId,
          amount: total / 100, // Convert cents to KES
          currency: "KES",
          description: `Floral Whispers Gifts Order #${orderId.slice(0, 8)}`,
          callbackUrl: callbackUrl,
          customerEmail: email || null,
          customerPhone: formatPhone(phoneNumber || phone),
          customerName: firstName && lastName ? `${firstName} ${lastName}`.trim() : "Customer",
          billingAddress: billingAddress,
        });

        if (pesapalResponse.data.success && pesapalResponse.data.data?.redirect_url) {
          // Store order ID in session for callback handling
          sessionStorage.setItem("pendingOrder", JSON.stringify({
            id: orderId,
            total: total,
            paymentMethod: "pesapal",
            orderTrackingId: pesapalResponse.data.data.order_tracking_id,
          }));

          // Track the purchase attempt
          Analytics.trackPurchase(orderId, total, "card");

          // Redirect to Pesapal payment page
          window.location.href = pesapalResponse.data.data.redirect_url;
          return;
        } else {
          setError(pesapalResponse.data.message || "Failed to initiate card payment. Please try again.");
          setIsProcessing(false);
          return;
        }
      }
    } catch (err: any) {
      console.error("❌ Checkout: Order submission error:", {
        error: err.message,
        paymentMethod,
        total,
        response: err.response?.data,
        stack: err.stack
      });
      setError(err.response?.data?.message || err.message || "An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-brand-pink">floral whispers</span>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Order Summary */}
          <div className="border border-brand-gray-200 rounded-lg p-6">
            <div className="border border-brand-gray-200 rounded-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Order summary</h2>
                <button
                  type="button"
                  onClick={() => setShowOrderSummary(!showOrderSummary)}
                  className="text-brand-gray-600"
                >
                  {showOrderSummary ? (
                    <ChevronUpIcon className="w-5 h-5" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {showOrderSummary && (
                <>
                  <div className="space-y-3 mb-4">
                    {(orderData?.items || items).map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="relative w-16 h-16 overflow-hidden rounded-md bg-brand-gray-100 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brand-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-brand-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>


                  <div className="space-y-2 border-t border-brand-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-gray-600">Subtotal {(orderData?.items || items).length} items</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    {deliveryFeeInCents > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-gray-600">Delivery Fee ({orderData?.delivery?.location || "Nairobi"})</span>
                        <span className="font-medium">{formatCurrency(deliveryFeeInCents)}</span>
                      </div>
                    )}
                    {tipValue > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-gray-600">Tip</span>
                        <span className="font-medium">{formatCurrency(tipValue)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-lg font-bold border-t border-brand-gray-200 pt-4 mt-4">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="mt-4 p-3 bg-brand-red/10 border border-brand-red rounded-md text-brand-red text-sm">
                  {error}
                </div>
              )}

              {stkError && (
                <div className="mt-4 p-3 bg-brand-red/10 border border-brand-red rounded-md text-brand-red text-sm">
                  {stkError}
                </div>
              )}

              {/* Payment Methods */}
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-base text-brand-gray-900 mb-4">Payment Method</h3>
                
                {/* STK Push */}
                <div>
                  <label className="flex items-start gap-3 p-4 border border-brand-gray-200 rounded-md cursor-pointer hover:bg-brand-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="stk"
                      checked={paymentMethod === "stk"}
                      onChange={() => setPaymentMethod("stk")}
                      className="w-4 h-4 mt-1 text-brand-green focus:ring-brand-green"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-5 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[10px]">M-PESA</span>
                        </div>
                        <span className="font-medium text-sm text-brand-gray-900">M-Pesa STK Push</span>
                      </div>
                    </div>
                  </label>
                  {paymentMethod === "stk" && (
                    <div className="mt-3 ml-7 space-y-3">
                      <div className="p-3 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                        <p className="text-xs text-brand-gray-700 mb-3">
                          Enter your M-Pesa phone number for payment:
                        </p>
                        <div>
                          <label htmlFor="stk-phone-checkout" className="block text-xs font-medium text-brand-gray-900 mb-1.5">
                            M-Pesa Phone Number <span className="text-brand-red">*</span>
                          </label>
                          <input
                            id="stk-phone-checkout"
                            type="tel"
                            value={stkPhone}
                            onChange={(e) => {
                              setStkPhone(e.target.value);
                              setStkError("");
                            }}
                            placeholder="2547XXXXXXXX"
                            className="w-full px-3 py-2 border border-brand-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                          />
                          {stkError && (
                            <p className="mt-1 text-xs text-brand-red">{stkError}</p>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs text-green-800">
                          <strong>How it works:</strong> Enter your M-Pesa phone number and you&apos;ll receive a payment prompt on your phone. Complete the payment on your phone to finish your order.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Payments (Disabled) */}
                <div>
                  <label className="flex items-start gap-3 p-4 border border-brand-gray-200 rounded-md cursor-pointer hover:bg-brand-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="pesapal"
                      checked={paymentMethod === "pesapal"}
                      onChange={() => setPaymentMethod("pesapal")}
                      className="w-4 h-4 mt-1 text-brand-green focus:ring-brand-green"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-5 bg-white border border-gray-300 rounded flex items-center justify-center px-1">
                          <span className="text-[#1434CB] font-bold text-[10px]">VISA</span>
                        </div>
                        <span className="font-medium text-sm text-brand-gray-900">Credit/Debit Card</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Till Number */}
                <div>
                  <label className="flex items-start gap-3 p-4 border border-brand-gray-200 rounded-md cursor-pointer hover:bg-brand-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="till"
                      checked={paymentMethod === "till"}
                      onChange={() => setPaymentMethod("till")}
                      className="w-4 h-4 mt-1 text-brand-green focus:ring-brand-green"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-5 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[10px]">M-PESA</span>
                        </div>
                        <span className="font-medium text-sm text-brand-gray-900">M-Pesa Till Number</span>
                      </div>
                    </div>
                  </label>
                  {paymentMethod === "till" && (
                    <div className="mt-3 ml-7 p-3 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                      <h4 className="font-semibold text-sm text-brand-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-5 h-4 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[8px]">M-PESA</span>
                        </div>
                        How to Pay via Till Number
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-brand-gray-700 text-xs">
                        <li>Go to M-Pesa on your phone</li>
                        <li>Select <strong>Lipa na M-Pesa</strong></li>
                        <li>Select <strong>Buy Goods</strong></li>
                        <li>Enter Till Number: <strong className="text-brand-green">{SHOP_INFO.mpesa.till}</strong></li>
                        <li>Enter the amount: <strong className="text-brand-green">{formatCurrency(total)}</strong></li>
                        <li>Enter your M-Pesa PIN</li>
                        <li>Confirm payment</li>
                        <li>Name: <strong>Floral Whispers</strong></li>
                      </ol>
                    </div>
                  )}
                </div>

                {/* Paybill */}
                <div>
                  <label className="flex items-start gap-3 p-4 border border-brand-gray-200 rounded-md cursor-pointer hover:bg-brand-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="paybill"
                      checked={paymentMethod === "paybill"}
                      onChange={() => setPaymentMethod("paybill")}
                      className="w-4 h-4 mt-1 text-brand-green focus:ring-brand-green"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-5 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[10px]">M-PESA</span>
                        </div>
                        <span className="font-medium text-sm text-brand-gray-900">M-Pesa Paybill</span>
                      </div>
                    </div>
                  </label>
                  {paymentMethod === "paybill" && (
                    <div className="mt-3 ml-7 p-3 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                      <h4 className="font-semibold text-sm text-brand-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-5 h-4 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[8px]">M-PESA</span>
                        </div>
                        How to Pay via Paybill
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-brand-gray-700 text-xs">
                        <li>Go to M-Pesa on your phone</li>
                        <li>Select <strong>Lipa na M-Pesa</strong></li>
                        <li>Select <strong>Paybill</strong></li>
                        <li>Enter Business Number: <strong className="text-brand-green">{SHOP_INFO.mpesa.paybill}</strong></li>
                        <li>Enter Account Number: <strong className="text-brand-green">{SHOP_INFO.mpesa.account}</strong></li>
                        <li>Enter the amount: <strong className="text-brand-green">{formatCurrency(total)}</strong></li>
                        <li>Enter your M-Pesa PIN</li>
                        <li>Confirm payment</li>
                        <li>Goes to: <strong>Coop Bank</strong></li>
                        <li>Name: <strong>Floral Whispers</strong></li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Payment Button */}
              {paymentMethod && (
                <button
                  type="button"
                  onClick={handleSTKPush}
                  disabled={isProcessing || (paymentMethod === "stk" && !stkPhone)}
                  className="w-full mt-4 bg-brand-green text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Processing..."
                    : paymentMethod === "stk"
                      ? `Pay with M-Pesa - ${formatCurrency(total)}`
                      : paymentMethod === "pesapal"
                        ? `Pay with Card - ${formatCurrency(total)}`
                        : paymentMethod === "till" || paymentMethod === "paybill"
                          ? `Complete Order - ${formatCurrency(total)}`
                          : "Complete Payment"}
                </button>
              )}


              <div className="mt-4 text-center text-xs text-brand-gray-600 space-y-1">
                <Link href="/refund-policy" className="hover:underline">
                  Refund policy
                </Link>
                <span> • </span>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy policy
                </Link>
                <span> • </span>
                <Link href="/terms-of-service" className="hover:underline">
                  Terms of service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
