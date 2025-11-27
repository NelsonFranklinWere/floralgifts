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
import Link from "next/link";
import { Analytics } from "@/lib/analytics";
import { PencilIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

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
      if (!value) return true;
      return validatePhone(value);
    }),
  recipientName: yup.string().when("isRecipient", {
    is: false,
    then: (schema) => schema.required("Recipient name is required"),
    otherwise: (schema) => schema.optional(),
  }),
  recipientPhone: yup.string().when("isRecipient", {
    is: false,
    then: (schema) =>
      schema
        .required("Recipient phone number is required")
        .test("phone-format", "Invalid phone number format", (value) => {
          if (!value) return false;
          return validatePhone(value);
        }),
    otherwise: (schema) => schema.optional(),
  }),
  recipientWhatsapp: yup
    .string()
    .optional()
    .test("phone-format", "Invalid WhatsApp number format", (value) => {
      if (!value) return true;
      return validatePhone(value);
    }),
  deliveryLocation: yup.string().required("Delivery location is required"),
  deliveryAddress: yup.string().required("Delivery address is required"),
  giftMessage: yup.string().optional(),
  deliveryInstructions: yup.string().required("Packaging instructions are required"),
  isRecipient: yup.boolean().default(true),
});

type CheckoutFormData = yup.InferType<typeof schema>;

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"till" | "paybill" | "stk" | "card" | "whatsapp" | null>("stk");
  const [showGiftMessage, setShowGiftMessage] = useState(false);
  const [isRecipient, setIsRecipient] = useState(true);
  const [stkPhone, setStkPhone] = useState("");
  const [isProcessingStk, setIsProcessingStk] = useState(false);
  const [tipEnabled, setTipEnabled] = useState(false);
  const [tipPercentage, setTipPercentage] = useState<5 | 10 | 15 | null>(null);
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const subtotal = getTotal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      isRecipient: true,
    },
  });

  const formData = watch();
  const selectedLocation = formData.deliveryLocation;
  const deliveryFeeInCents = selectedLocation 
    ? (DELIVERY_LOCATIONS.find(loc => loc.name === selectedLocation)?.fee || 0) * 100
    : 0;
  const tipAmount = tipEnabled && tipPercentage ? Math.round(subtotal * (tipPercentage / 100)) : 0;
  const total = subtotal + deliveryFeeInCents + tipAmount;

  const handleMpesaCheckout = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setPaymentMethod("till");

    try {
      const customerName = data.name;
      const recipientName = isRecipient ? data.name : (data.recipientName || "");
      const recipientPhone = isRecipient ? data.phone : (data.recipientPhone || "");
      const deliveryLocation = data.deliveryLocation || "";
      const deliveryAddress = data.deliveryAddress || "";

      const orderData = {
        customer: {
          name: customerName,
          phone: formatPhone(data.phone),
          whatsapp: data.whatsapp ? formatPhone(data.whatsapp) : null,
        },
        recipient: {
          name: recipientName,
          phone: formatPhone(recipientPhone),
          whatsapp: data.recipientWhatsapp ? formatPhone(data.recipientWhatsapp) : null,
        },
        delivery: {
          location: deliveryLocation,
          address: deliveryAddress,
          instructions: data.deliveryInstructions || null,
        },
        giftMessage: data.giftMessage || null,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          slug: item.slug,
          options: item.options,
        })),
        subtotal,
        deliveryFee: deliveryFeeInCents,
        tip: tipAmount > 0 ? { percentage: tipPercentage, amount: tipAmount } : null,
        total,
      };

      sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));
      router.push("/checkout");
    } catch (error: any) {
      console.error("Error saving order data:", error);
      alert("Error preparing order. Please try again.");
      setIsSubmitting(false);
      setPaymentMethod(null);
    }
  };

  const handleWhatsAppOrder = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setPaymentMethod("whatsapp");
    
    let whatsappLink: string | undefined;
    
    try {
      const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return imagePath;
        }
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
      };

      const customerName = data.name;
      const recipientName = isRecipient ? data.name : (data.recipientName || "");
      const recipientPhone = isRecipient ? data.phone : (data.recipientPhone || "");
      const deliveryLocation = data.deliveryLocation || "";
      const deliveryAddress = data.deliveryAddress || "";

      let message = `🎁 *New Gift Order*\n\n`;
      message += `*Ordered By:*\n`;
      message += `Name: ${customerName}\n`;
      message += `Phone: ${formatPhone(data.phone)}\n`;
      if (data.whatsapp) {
        message += `WhatsApp: ${formatPhone(data.whatsapp)}\n`;
      }
      message += `\n*Recipient:*\n`;
      message += `Name: ${recipientName}\n`;
      message += `Phone: ${formatPhone(recipientPhone)}\n`;
      if (data.recipientWhatsapp) {
        message += `WhatsApp: ${formatPhone(data.recipientWhatsapp)}\n`;
      }
      
      message += `\n*Delivery Details:*\n`;
      message += `Location: ${deliveryLocation}\n`;
      message += `Address: ${deliveryAddress}\n`;
      
      message += `\n*Items:*\n`;
      items.forEach((item) => {
        message += `• ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}\n`;
        if (item.options) {
          message += `  Options: ${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")}\n`;
        }
        const imageUrl = getImageUrl(item.image);
        message += `  📷 Image: ${imageUrl}\n`;
      });
      
      message += `\n*Pricing:*\n`;
      message += `Subtotal: ${formatCurrency(subtotal)}\n`;
      message += `Delivery Fee: ${deliveryFeeInCents === 0 ? "Free" : formatCurrency(deliveryFeeInCents)}\n`;
      if (tipAmount > 0) {
        message += `Tip (${tipPercentage}%): ${formatCurrency(tipAmount)}\n`;
      }
      message += `Total: ${formatCurrency(total)}\n`;
      
      if (data.giftMessage) {
        message += `\n*Gift Message:*\n${data.giftMessage}\n`;
      }
      
      if (data.deliveryInstructions) {
        message += `\n*Delivery Instructions:*\n${data.deliveryInstructions}\n`;
      }

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
        customerName: customerName,
        phone: formatPhone(data.phone),
        address: `${deliveryLocation}, ${deliveryAddress}`,
        deliveryDate: data.deliveryInstructions || "As per instructions",
        notes: message,
      };

      whatsappLink = generateWhatsAppLink(whatsappData);
      
      try {
        const emailSubject = `New Order - WhatsApp Payment`;
        const emailHtml = `
          <h2>New Order Received</h2>
          <p><strong>Payment Method:</strong> WhatsApp</p>
          
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Phone:</strong> ${formatPhone(data.phone)}</p>
          ${data.whatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${formatPhone(data.whatsapp).replace(/^\+/, "")}">${formatPhone(data.whatsapp)}</a></p>` : ''}
          
          <h3>Recipient Information</h3>
          <p><strong>Name:</strong> ${recipientName}</p>
          <p><strong>Phone:</strong> ${formatPhone(recipientPhone)}</p>
          ${data.recipientWhatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${formatPhone(data.recipientWhatsapp).replace(/^\+/, "")}">${formatPhone(data.recipientWhatsapp)}</a></p>` : ''}
          
          <h3>Delivery Details</h3>
          <p><strong>Location:</strong> ${deliveryLocation}</p>
          <p><strong>Address:</strong> ${deliveryAddress}</p>
          
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
                      ${tipAmount > 0 ? `<p><strong>Tip (${tipPercentage}%):</strong> ${formatCurrency(tipAmount)}</p>` : ''}
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
        
        window.open(whatsappLink, "_blank");
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        window.open(whatsappLink, "_blank");
      }
    } catch (error) {
      console.error("Error processing WhatsApp order:", error);
      if (whatsappLink) {
        window.open(whatsappLink, "_blank");
      }
    } finally {
      setIsSubmitting(false);
      setPaymentMethod(null);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!validateAmount(total)) {
      alert("Invalid order total. Please contact support.");
      return;
    }

    Analytics.trackCheckoutStart(total, items.length);

    const sanitizedData = {
      ...data,
      name: sanitizeInput(data.name),
      deliveryAddress: sanitizeInput(data.deliveryAddress),
      giftMessage: data.giftMessage ? sanitizeInput(data.giftMessage) : undefined,
      deliveryInstructions: sanitizeInput(data.deliveryInstructions),
    };

    if (paymentMethod === "till" || paymentMethod === "paybill" || paymentMethod === "stk") {
      await handleMpesaCheckout(sanitizedData);
    } else {
      await handleWhatsAppOrder(sanitizedData);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Gift Message Section */}
      <div className="border-b border-brand-gray-200 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setShowGiftMessage(!showGiftMessage)}
            className="text-brand-gray-900 font-medium text-base hover:text-brand-gray-700 transition-colors flex items-center gap-2"
          >
            Add your card message here
            <PencilIcon className="h-4 w-4" />
          </button>
        </div>
        
        {showGiftMessage && (
          <div className="mt-3">
            <textarea
              {...register("giftMessage")}
              rows={4}
              className="w-full px-4 py-3 border border-brand-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none"
              placeholder="Write a personal message to be included with the gift..."
            />
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            id="addGiftMessage"
            checked={showGiftMessage}
            onChange={(e) => setShowGiftMessage(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="addGiftMessage" className="text-sm text-brand-gray-700 cursor-pointer">
            Add a gift message
          </label>
        </div>
      </div>

      {/* Your Information */}
      <div className="border-b border-brand-gray-200 pb-4">
        <h3 className="font-medium text-base text-brand-gray-900 mb-4">Your Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-gray-900 mb-1.5">
              Your Name <span className="text-brand-red">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-4 py-2.5 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              placeholder="Full name"
            />
            {errors.name && <p className="mt-1 text-xs text-brand-red">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-brand-gray-900 mb-1.5">
              Your Phone <span className="text-brand-red">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="2547XXXXXXXX"
              {...register("phone")}
              className="w-full px-4 py-2.5 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
            {errors.phone && <p className="mt-1 text-xs text-brand-red">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      {/* Recipient Information */}
      <div className="border-b border-brand-gray-200 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-base text-brand-gray-900">Recipient Information</h3>
          <button
            type="button"
            onClick={() => {
              const newIsRecipient = !isRecipient;
              setIsRecipient(newIsRecipient);
              setValue("isRecipient", newIsRecipient);
              if (newIsRecipient) {
                setValue("recipientName", "");
                setValue("recipientPhone", "");
              }
            }}
            className="text-sm text-brand-gray-600 hover:text-brand-gray-900 transition-colors underline"
          >
            {isRecipient ? "Add recipient details" : "Someone else is receiving"}
          </button>
        </div>

        {!isRecipient && (
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-brand-gray-900 mb-1.5">
                Recipient Name <span className="text-brand-red">*</span>
              </label>
              <input
                id="recipientName"
                type="text"
                {...register("recipientName")}
                className="w-full px-4 py-2.5 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                placeholder="Full name"
              />
              {errors.recipientName && <p className="mt-1 text-xs text-brand-red">{errors.recipientName.message}</p>}
            </div>

            <div>
              <label htmlFor="recipientPhone" className="block text-sm font-medium text-brand-gray-900 mb-1.5">
                Recipient Phone <span className="text-brand-red">*</span>
              </label>
              <input
                id="recipientPhone"
                type="tel"
                placeholder="2547XXXXXXXX"
                {...register("recipientPhone")}
                className="w-full px-4 py-2.5 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
              {errors.recipientPhone && <p className="mt-1 text-xs text-brand-red">{errors.recipientPhone.message}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Delivery Information - Always visible and mandatory */}
      <div className="border-b border-brand-gray-200 pb-4">
        <h3 className="font-medium text-base text-brand-gray-900 mb-4">Delivery Information</h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="deliveryLocation"
              className="block text-sm font-medium text-brand-gray-900 mb-1.5"
            >
              Delivery Location <span className="text-brand-red">*</span>
            </label>
            <select
              id="deliveryLocation"
              {...register("deliveryLocation")}
              className="w-full px-4 py-2.5 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
            >
              <option value="">Select delivery location</option>
              {DELIVERY_LOCATIONS.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name} {location.fee === 0 ? "(Free)" : `(+${formatCurrency(location.fee * 100)})`}
                </option>
              ))}
            </select>
            {errors.deliveryLocation && (
              <p className="mt-1 text-xs text-brand-red">{errors.deliveryLocation.message}</p>
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
              className="block text-sm font-medium text-brand-gray-900 mb-1.5"
            >
              Delivery Address <span className="text-brand-red">*</span>
            </label>
            <textarea
              id="deliveryAddress"
              rows={3}
              {...register("deliveryAddress")}
              className="w-full px-4 py-2.5 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none"
              placeholder="Enter your detailed address (street, building, apartment, etc.)"
            />
            {errors.deliveryAddress && (
              <p className="mt-1 text-xs text-brand-red">{errors.deliveryAddress.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-brand-gray-900 mb-1.5">
              Packaging Instructions <span className="text-brand-red">*</span>
            </label>
            <textarea
              id="deliveryInstructions"
              rows={3}
              {...register("deliveryInstructions")}
              className="w-full px-4 py-2.5 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none"
              placeholder="Delivery date, time, packaging preferences, or special instructions..."
            />
            {errors.deliveryInstructions && (
              <p className="mt-1 text-xs text-brand-red">{errors.deliveryInstructions.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-brand-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base font-medium text-brand-gray-900">Subtotal</span>
          <span className="text-base font-semibold text-brand-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        {selectedLocation && (
          <div className="flex justify-between items-center mb-4 text-sm text-brand-gray-600">
            <span>Delivery Fee ({selectedLocation})</span>
            <span className="font-medium">
              {deliveryFeeInCents === 0 ? "Free" : formatCurrency(deliveryFeeInCents)}
            </span>
          </div>
        )}
        
        {/* Tip Section */}
        <div className="mb-4 pb-4 border-b border-brand-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="tip-enabled"
              checked={tipEnabled}
              onChange={(e) => {
                setTipEnabled(e.target.checked);
                if (!e.target.checked) {
                  setTipPercentage(null);
                }
              }}
              className="w-4 h-4 text-brand-green focus:ring-brand-green rounded"
            />
            <label htmlFor="tip-enabled" className="text-sm font-medium text-brand-gray-900 cursor-pointer">
              Add a tip
            </label>
          </div>
          
          {tipEnabled && (
            <div className="ml-6 space-y-2">
              <p className="text-xs text-brand-gray-600 mb-2">Select tip percentage:</p>
              <div className="flex flex-wrap gap-2">
                {([5, 10, 15] as const).map((percent) => (
                  <button
                    key={percent}
                    type="button"
                    onClick={() => setTipPercentage(percent)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      tipPercentage === percent
                        ? "bg-brand-green text-white"
                        : "bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200"
                    }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
              {tipPercentage && (
                <div className="mt-2 flex justify-between items-center text-sm">
                  <span className="text-brand-gray-600">Tip ({tipPercentage}%)</span>
                  <span className="font-medium text-brand-gray-900">{formatCurrency(tipAmount)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-brand-gray-200">
          <span className="text-lg font-semibold text-brand-gray-900">Total</span>
          <span className="text-lg font-bold text-brand-gray-900">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-brand-gray-200 pt-4">
        <h3 className="font-semibold text-base text-brand-gray-900 mb-4">Payment Method</h3>
        
        {/* Payment Icons */}
        <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-brand-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-7 bg-[#007C42] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">M-PESA</span>
            </div>
            <span className="text-xs text-brand-gray-700">M-Pesa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-7 bg-white border border-gray-300 rounded flex items-center justify-center px-1">
              <span className="text-[#1434CB] font-bold text-xs">VISA</span>
            </div>
            <span className="text-xs text-brand-gray-700">Visa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-7 bg-white border border-gray-300 rounded flex items-center justify-center px-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#EB001B] rounded-full -mr-1.5"></div>
                <div className="w-3 h-3 bg-[#F79E1B] rounded-full"></div>
              </div>
            </div>
            <span className="text-xs text-brand-gray-700">Mastercard</span>
          </div>
          <span className="text-xs text-brand-gray-500">Card payments coming soon</span>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="checkout-stk"
                name="checkout-payment"
                value="stk"
                checked={paymentMethod === "stk"}
                onChange={(e) => setPaymentMethod(paymentMethod === "stk" ? null : "stk")}
                className="mt-1 w-4 h-4 text-brand-green focus:ring-brand-green"
              />
              <label htmlFor="checkout-stk" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-5 bg-[#007C42] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-[10px]">M-PESA</span>
                  </div>
                  <span className="font-medium text-sm text-brand-gray-900">M-Pesa STK Push</span>
                </div>
              </label>
            </div>
            {paymentMethod === "stk" && (
              <div className="mt-3 ml-7 p-3 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                <div className="space-y-3">
                  <div>
                    <label htmlFor="checkout-stk-phone" className="block text-xs font-medium text-brand-gray-900 mb-1">
                      Phone Number <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="checkout-stk-phone"
                      type="tel"
                      placeholder="2547XXXXXXXX"
                      value={stkPhone}
                      onChange={(e) => setStkPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!stkPhone) {
                        alert("Please enter your phone number");
                        return;
                      }
                      setIsProcessingStk(true);
                      try {
                        const response = await axios.post("/api/mpesa/stk-push", {
                          phone: stkPhone,
                          amount: total,
                        });
                        alert("Payment request sent! Please check your phone to complete the payment.");
                        setStkPhone("");
                      } catch (error) {
                        console.error("STK Push error:", error);
                        alert("Failed to initiate payment. Please try again.");
                      } finally {
                        setIsProcessingStk(false);
                      }
                    }}
                    disabled={isProcessingStk || !stkPhone}
                    className="w-full btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingStk ? "Processing..." : `Pay ${formatCurrency(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="checkout-card"
                name="checkout-payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(paymentMethod === "card" ? null : "card")}
                className="mt-1 w-4 h-4 text-brand-green focus:ring-brand-green"
                disabled
              />
              <label htmlFor="checkout-card" className="flex-1 cursor-pointer opacity-50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-5 bg-white border border-gray-300 rounded flex items-center justify-center px-1">
                    <span className="text-[#1434CB] font-bold text-[10px]">VISA</span>
                  </div>
                  <span className="font-medium text-sm text-brand-gray-900">Card Payments</span>
                  <span className="text-xs text-brand-gray-500">(Coming Soon)</span>
                </div>
              </label>
            </div>
            {paymentMethod === "card" && (
              <div className="mt-3 ml-7 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Card payments are coming soon. Please use M-Pesa payment methods for now.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Checkout Button */}
        {(paymentMethod === "till" || paymentMethod === "paybill") && (
          <button
            type="button"
            onClick={() => {
              handleSubmit(async (data) => {
                setIsSubmitting(true);
                await handleMpesaCheckout(data);
              })();
            }}
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base mb-3"
          >
            {isSubmitting ? "Processing..." : `Check out - ${formatCurrency(total)}`}
          </button>
        )}

        <Link
          href="/collections"
          className="block w-full border-2 border-brand-gray-900 text-brand-gray-900 font-semibold py-3.5 px-6 rounded-md text-center hover:bg-brand-gray-50 transition-colors text-base"
        >
          Continue Shopping
        </Link>
      </div>
    </form>
  );
}
