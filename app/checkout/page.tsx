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
      const amountInKES = Math.ceil(total / 100);
      
      const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return imagePath;
        }
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
      };

      let orderNotes = `Ordered By: ${firstName} ${lastName} (${email || phone})`;
      if (phone) {
        orderNotes += `\nPayment Phone: ${formattedPhone}`;
      }
      orderNotes += `\n\nRecipient: ${firstName} ${lastName} (${phoneNumber})`;
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

      const orderResponse = await axios.post("/api/orders", {
        items: orderData.items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          options: item.options,
        })),
        total: total,
        customer_name: `${firstName} ${lastName}`,
        phone: phone || phoneNumber,
        email: email || null,
        delivery_address: `${address}${apartment ? `, ${apartment}` : ""}, ${city}`,
        delivery_city: city || "Nairobi",
        delivery_date: orderData.delivery.instructions || "As per instructions",
        payment_method: paymentMethod === "mpesa" ? "mpesa" : "whatsapp",
        notes: orderNotes,
      });

      const orderId = orderResponse.data.id;

      if (paymentMethod === "mpesa") {
        const stkResponse = await axios.post("/api/mpesa/stkpush", {
          phone: formattedPhone,
          amount: amountInKES,
          accountRef: orderId,
          orderId,
        });

        if (stkResponse.data.ResponseCode === "0") {
          Analytics.trackPurchase(orderId, total, "mpesa");
          sessionStorage.removeItem("pendingOrder");
          clearCart();
          router.push(`/order/success?orderId=${orderId}`);
        } else {
          throw new Error(stkResponse.data.CustomerMessage || "Payment initiation failed");
        }
      } else {
        const whatsappData = {
          orderId,
          customerName: `${firstName} ${lastName}`,
          customerPhone: phone || phoneNumber,
          recipientName: `${firstName} ${lastName}`,
          recipientPhone: phoneNumber,
          items: orderData.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: total,
          deliveryLocation: city,
          deliveryAddress: address,
          notes: orderNotes,
        };

        const whatsappLink = generateWhatsAppLink(whatsappData);
        sessionStorage.removeItem("pendingOrder");
        clearCart();
        window.open(whatsappLink, "_blank");
        router.push(`/order/success?orderId=${orderId}`);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Section */}
            <div className="border border-brand-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Contact</h2>
              </div>
              <input
                type="text"
                placeholder="Email or mobile phone number"
                value={email || phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes("@")) {
                    setEmail(value);
                    setPhone("");
                  } else {
                    setPhone(value);
                    setEmail("");
                  }
                }}
                className="w-full px-4 py-2 border border-brand-gray-300 rounded-md mb-3"
              />
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={emailNewsletter}
                  onChange={(e) => setEmailNewsletter(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="newsletter" className="text-sm text-brand-gray-700">
                  Email me with news and offers
                </label>
              </div>
              <div className="text-right">
                <button type="button" className="text-sm text-brand-green hover:underline">
                  Sign in
                </button>
              </div>
            </div>

            {/* Delivery Section */}
            <div className="border border-brand-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Delivery</h2>
              <div className="space-y-4">
                <select
                  value="Kenya"
                  className="w-full px-4 py-2 border border-brand-gray-300 rounded-md"
                  disabled
                >
                  <option>Kenya</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="px-4 py-2 border border-brand-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="px-4 py-2 border border-brand-gray-300 rounded-md"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-brand-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full px-4 py-2 border border-brand-gray-300 rounded-md"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="px-4 py-2 border border-brand-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Postal code (optional)"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="px-4 py-2 border border-brand-gray-300 rounded-md"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-brand-gray-300 rounded-md"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="saveInfo" className="text-sm text-brand-gray-700">
                    Save this information for next time
                  </label>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="border border-brand-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Shipping method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-brand-gray-200 rounded-md cursor-pointer hover:bg-brand-gray-50">
                  <input
                    type="radio"
                    name="shipping"
                    value="nairobi"
                    checked={shippingMethod === "nairobi"}
                    onChange={(e) => setShippingMethod(e.target.value as "nairobi" | "kenya")}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Shipping Within Nairobi</div>
                  </div>
                  <div className="font-semibold">{formatCurrency(35000)}</div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-brand-gray-200 rounded-md cursor-pointer hover:bg-brand-gray-50">
                  <input
                    type="radio"
                    name="shipping"
                    value="kenya"
                    checked={shippingMethod === "kenya"}
                    onChange={(e) => setShippingMethod(e.target.value as "nairobi" | "kenya")}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Shipping To All Towns Across Kenya</div>
                  </div>
                  <div className="font-semibold">{formatCurrency(95000)}</div>
                </label>
              </div>
            </div>

            {/* Payment Section */}
            <div className="border border-brand-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Payment</h2>
              <p className="text-sm text-brand-gray-600 mb-4">All transactions are secure and encrypted</p>
              <div className="space-y-3">
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
                    <div className="font-medium">MPESA Till Number {SHOP_INFO.mpesa.till}</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Billing Address */}
            <div className="border border-brand-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Billing address</h2>
              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="billing"
                    checked={billingSame}
                    onChange={() => setBillingSame(true)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Same as shipping address</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="billing"
                    checked={!billingSame}
                    onChange={() => setBillingSame(false)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Use a different billing address</span>
                </label>
              </div>
              {!billingSame && (
                <div className="space-y-4">
                  <select
                    value="Kenya"
                    className="w-full px-4 py-2 border border-brand-gray-300 rounded-md"
                    disabled
                  >
                    <option>Kenya</option>
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First name (optional)"
                      value={billingFirstName}
                      onChange={(e) => setBillingFirstName(e.target.value)}
                      className="px-4 py-2 border border-brand-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={billingLastName}
                      onChange={(e) => setBillingLastName(e.target.value)}
                      className="px-4 py-2 border border-brand-gray-300 rounded-md"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-brand-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={billingApartment}
                    onChange={(e) => setBillingApartment(e.target.value)}
                    className="w-full px-4 py-2 border border-brand-gray-300 rounded-md"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      className="px-4 py-2 border border-brand-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Postal code (optional)"
                      value={billingPostalCode}
                      onChange={(e) => setBillingPostalCode(e.target.value)}
                      className="px-4 py-2 border border-brand-gray-300 rounded-md"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-brand-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Add Tip */}
            {showTip && (
              <div className="border border-brand-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Add tip</h2>
                  <button
                    type="button"
                    onClick={() => setShowTip(false)}
                    className="text-sm text-brand-gray-600 hover:underline"
                  >
                    Hide
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="showTip"
                    checked={showTip}
                    onChange={(e) => setShowTip(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="showTip" className="text-sm text-brand-gray-700">
                    Show your support for the team at Floral Whispers Gifts
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setTipAmount(5)}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      tipAmount === 5
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-brand-gray-300 hover:bg-brand-gray-50"
                    }`}
                  >
                    5% ({formatCurrency(Math.round(subtotal * 0.05))})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipAmount(10)}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      tipAmount === 10
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-brand-gray-300 hover:bg-brand-gray-50"
                    }`}
                  >
                    10% ({formatCurrency(Math.round(subtotal * 0.1))})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipAmount(15)}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      tipAmount === 15
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-brand-gray-300 hover:bg-brand-gray-50"
                    }`}
                  >
                    15% ({formatCurrency(Math.round(subtotal * 0.15))})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipAmount(0)}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      tipAmount === 0
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-brand-gray-300 hover:bg-brand-gray-50"
                    }`}
                  >
                    None
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomTip(String(Math.max(0, parseInt(customTip || "0") - 100)))}
                    className="px-3 py-1 border border-brand-gray-300 rounded-md"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    placeholder="Custom tip"
                    value={customTip}
                    onChange={(e) => {
                      setCustomTip(e.target.value);
                      if (e.target.value) {
                        setTipAmount(null);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-brand-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomTip(String(parseInt(customTip || "0") + 100))}
                    className="px-3 py-1 border border-brand-gray-300 rounded-md"
                  >
                    +
                  </button>
                </div>
                {tipAmount !== null && tipAmount > 0 && (
                  <p className="mt-2 text-sm text-brand-green">Thank you, we appreciate it.</p>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
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
                  <label className="block text-sm font-medium text-brand-gray-900 mb-2">
                    M-Pesa Phone Number <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError("");
                    }}
                    placeholder="2547XXXXXXXX"
                    className="w-full px-4 py-2 border border-brand-gray-300 rounded-md mb-2"
                  />
                  {phoneError && <p className="text-xs text-brand-red mb-2">{phoneError}</p>}
                </div>
              )}

              <button
                type="button"
                onClick={handleSTKPush}
                disabled={isProcessing || !paymentMethod}
                className="w-full mt-4 bg-brand-pink text-white px-6 py-3 rounded-md font-semibold hover:bg-brand-pink/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Pay now"}
              </button>

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
