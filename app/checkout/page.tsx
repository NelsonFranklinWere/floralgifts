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
  const { clearCart } = useCartStore();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"pesapal" | "mpesa" | null>(null);
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
  const [shippingMethod, setShippingMethod] = useState<"nairobi" | "kenya">("nairobi");
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
  const [discountCode, setDiscountCode] = useState("");
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [phoneError, setPhoneError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("pendingOrder");
    if (savedOrder) {
      const data = JSON.parse(savedOrder);
      setOrderData(data);
      setPhone(data.customer.phone.replace(/^\+/, ""));
      setEmail(data.customer.email || "");
      if (data.recipient.name) {
        const nameParts = data.recipient.name.split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
      }
      setAddress(data.delivery.address || "");
      setCity(data.delivery.location || "Nairobi");
      setPhoneNumber(data.recipient.phone.replace(/^\+/, "") || "");
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

  const shippingFee = shippingMethod === "nairobi" ? 35000 : 95000; // in cents
  const taxRate = 0.16; // 16% VAT
  const subtotal = orderData.subtotal;
  const estimatedTax = Math.round(subtotal * taxRate);
  const tipValue = tipAmount !== null ? (tipAmount === 0 ? 0 : Math.round(subtotal * (tipAmount / 100))) : 0;
  const total = subtotal + shippingFee + estimatedTax + tipValue;

  const handleSTKPush = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return imagePath;
        }
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
      };

      // Create order in database
      const orderResponse = await axios.post("/api/orders", {
        items: orderData.items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          options: item.options,
        })),
        total: total,
        customer_name: "Customer",
        phone: "",
        email: null,
        delivery_address: "To be confirmed",
        delivery_city: "Nairobi",
        delivery_date: "As per instructions",
        payment_method: paymentMethod === "mpesa" ? "mpesa" : paymentMethod === "pesapal" ? "pesapal" : "whatsapp",
        notes: `Order placed via checkout. Payment method: ${paymentMethod}`,
      });

      const orderId = orderResponse.data.id;

      // Generate WhatsApp message with order details
      let orderMessage = `*NEW ORDER #${orderId}*\n\n`;
      orderMessage += `*Items:*\n`;
      orderData.items.forEach((item, index) => {
        orderMessage += `${index + 1}. ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}\n`;
        if (item.options) {
          orderMessage += `   Options: ${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}\n`;
        }
      });
      orderMessage += `\n*Total: ${formatCurrency(total)}*\n`;
      orderMessage += `*Payment Method: ${paymentMethod === "mpesa" ? "M-Pesa (Till/Paybill)" : paymentMethod === "pesapal" ? "Pesapal" : "WhatsApp"}*\n\n`;
      orderMessage += `Please confirm this order and provide payment instructions.`;

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
    } catch (err: any) {
      console.error("Order submission error:", err);
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
                    {orderData.items.map((item, index) => (
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

                  <div className="border-t border-brand-gray-200 pt-4 mb-4">
                    <input
                      type="text"
                      placeholder="Discount code or gift card"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="w-full px-4 py-2 border border-brand-gray-300 rounded-md mb-2"
                    />
                    <button
                      type="button"
                      className="w-full px-4 py-2 bg-brand-gray-100 hover:bg-brand-gray-200 rounded-md text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="space-y-2 border-t border-brand-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-gray-600">Subtotal {orderData.items.length} items</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-gray-600">Shipping</span>
                      <span className="font-medium">{formatCurrency(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-gray-600">Estimated taxes</span>
                      <span className="font-medium">{formatCurrency(estimatedTax)}</span>
                    </div>
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

              {paymentMethod === "mpesa" && (
                <div className="mt-4 pt-4 border-t border-brand-gray-200">
                  <div className="p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                    <h4 className="font-semibold text-sm text-brand-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-6 h-5 bg-[#007C42] rounded flex items-center justify-center">
                        <span className="text-white font-bold text-[8px]">M-PESA</span>
                      </div>
                      How to Pay via Till Number
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-brand-gray-700 text-sm">
                      <li>Go to M-Pesa on your phone</li>
                      <li>Select <strong>Lipa na M-Pesa</strong></li>
                      <li>Select <strong>Buy Goods</strong></li>
                      <li>Enter Till Number: <strong className="text-brand-green">{SHOP_INFO.mpesa.till}</strong></li>
                      <li>Enter the amount: <strong className="text-brand-green">{formatCurrency(total)}</strong></li>
                      <li>Enter your M-Pesa PIN</li>
                      <li>Confirm payment</li>
                      <li>Name: <strong>Floral Whispers</strong></li>
                    </ol>
                    <div className="mt-4 pt-4 border-t border-brand-gray-200">
                      <h4 className="font-semibold text-sm text-brand-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-5 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[8px]">M-PESA</span>
                        </div>
                        How to Pay via Paybill
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-brand-gray-700 text-sm">
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
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-brand-green rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="pesapal"
                    checked={paymentMethod === "pesapal"}
                    onChange={() => setPaymentMethod("pesapal")}
                    className="w-4 h-4 mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium mb-2">Pesapal</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs">Visa</span>
                      <span className="text-xs">Mastercard</span>
                      <span className="text-xs">M-Pesa</span>
                      <span className="text-xs">+2</span>
                    </div>
                    <p className="text-xs text-brand-gray-600">
                      Clicking &quot;Pay now&quot; will redirect you to Pesapal to complete your purchase securely.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border border-brand-gray-200 rounded-md cursor-pointer hover:bg-brand-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={() => setPaymentMethod("mpesa")}
                    className="w-4 h-4 mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">M-Pesa (Till Number or Paybill)</div>
                  </div>
                </label>
              </div>

              {paymentMethod === "pesapal" && (
                <button
                  type="button"
                  onClick={handleSTKPush}
                  disabled={isProcessing || !paymentMethod}
                  className="w-full mt-4 bg-brand-pink text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-pink/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Pay now"}
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
