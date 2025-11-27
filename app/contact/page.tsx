"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SHOP_INFO } from "@/lib/constants";
import { sanitizeInput } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required").min(10, "Message must be at least 10 characters"),
});

type ContactFormData = yup.InferType<typeof schema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [paymentMethod, setPaymentMethod] = useState<"till" | "paybill" | "stk" | "card" | null>("stk");
  const [stkPhone, setStkPhone] = useState("");
  const [stkAmount, setStkAmount] = useState("");
  const [isProcessingStk, setIsProcessingStk] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
        phone: sanitizeInput(data.phone),
        subject: sanitizeInput(data.subject),
        message: sanitizeInput(data.message),
      };

      // Send email
      const emailSubject = `Contact Form: ${sanitizedData.subject}`;
      const emailMessage = `New Contact Form Submission\n\nName: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nPhone: ${sanitizedData.phone}\nSubject: ${sanitizedData.subject}\n\nMessage:\n${sanitizedData.message}`;

      try {
        await axios.post("/api/email", {
          type: "contact",
          subject: emailSubject,
          message: emailMessage,
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Continue even if email fails - still show success
      }

      // Also open WhatsApp with pre-filled message as backup
      const whatsappMessage = `Contact Form Submission:\n\nName: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nPhone: ${sanitizedData.phone}\nSubject: ${sanitizedData.subject}\n\nMessage:\n${sanitizedData.message}`;
      const whatsappLink = `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Open WhatsApp with pre-filled message
      window.open(whatsappLink, "_blank");

      setSubmitStatus("success");
      reset();
      
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-brand-gray-600 text-lg">
            We&apos;d love to hear from you. Get in touch with us today.
          </p>
        </div>

        {/* Trust Building Section */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
            <div className="card p-3 md:p-6 text-center">
              <div className="text-2xl md:text-4xl mb-2 md:mb-3">🎯</div>
              <h3 className="font-heading font-bold text-xs md:text-lg text-brand-gray-900 mb-1 md:mb-2">Trusted by Thousands</h3>
              <p className="text-brand-gray-600 text-[10px] md:text-sm">10,000+ happy customers trust us for their special moments</p>
            </div>
            <div className="card p-3 md:p-6 text-center">
              <div className="text-2xl md:text-4xl mb-2 md:mb-3">⚡</div>
              <h3 className="font-heading font-bold text-xs md:text-lg text-brand-gray-900 mb-1 md:mb-2">Fast & Reliable</h3>
              <p className="text-brand-gray-600 text-[10px] md:text-sm">Free same-day delivery in CBD. Your gifts arrive fresh and on time</p>
            </div>
            <div className="card p-3 md:p-6 text-center col-span-2 md:col-span-1">
              <div className="text-2xl md:text-4xl mb-2 md:mb-3">💎</div>
              <h3 className="font-heading font-bold text-xs md:text-lg text-brand-gray-900 mb-1 md:mb-2">Premium Quality</h3>
              <p className="text-brand-gray-600 text-[10px] md:text-sm">Only the finest flowers and carefully curated gift hampers</p>
            </div>
          </div>

          <div className="bg-brand-green/5 border border-brand-green/20 rounded-lg p-6 md:p-8 mb-8">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-brand-gray-900 mb-4 text-center">
              Why Choose Floral Whispers Gifts?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-brand-gray-700">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">✨</div>
                <div>
                  <h4 className="font-semibold text-brand-gray-900 mb-1">Experience & Expertise</h4>
                  <p className="text-sm">Over 5 years of creating beautiful moments. We understand what makes a gift special.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">🌹</div>
                <div>
                  <h4 className="font-semibold text-brand-gray-900 mb-1">Fresh & Beautiful</h4>
                  <p className="text-sm">Every bouquet is hand-arranged with care. Every hamper thoughtfully curated for perfection.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">🎁</div>
                <div>
                  <h4 className="font-semibold text-brand-gray-900 mb-1">Personalized Service</h4>
                  <p className="text-sm">We listen to your needs and create custom arrangements that express your emotions perfectly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">💚</div>
                <div>
                  <h4 className="font-semibold text-brand-gray-900 mb-1">Customer Care</h4>
                  <p className="text-sm">98% satisfaction rate. We&apos;re here to ensure your gift experience is flawless from start to finish.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading font-bold text-2xl text-brand-gray-900 mb-6">
              Send Us a Message
            </h2>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green rounded-lg text-brand-green">
                Thank you for your message! We&apos;ll get back to you soon.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-brand-red/10 border border-brand-red rounded-lg text-brand-red">
                There was an error sending your message. Please try again or contact us directly.
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-gray-900 mb-2">
                  Full Name <span className="text-brand-red">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="input-field"
                  aria-required="true"
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-brand-red">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-gray-900 mb-2">
                  Email <span className="text-brand-red">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="input-field"
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-brand-red">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-brand-gray-900 mb-2">
                  Phone Number <span className="text-brand-red">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="2547XXXXXXXX"
                  {...register("phone")}
                  className="input-field"
                  aria-required="true"
                  aria-invalid={errors.phone ? "true" : "false"}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-brand-red">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-brand-gray-900 mb-2">
                  Subject <span className="text-brand-red">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  {...register("subject")}
                  className="input-field"
                  aria-required="true"
                  aria-invalid={errors.subject ? "true" : "false"}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-brand-red">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-gray-900 mb-2">
                  Message <span className="text-brand-red">*</span>
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register("message")}
                  className="input-field resize-none"
                  aria-required="true"
                  aria-invalid={errors.message ? "true" : "false"}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-brand-red">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            {/* Payment Details Section - Below Form */}
            <div className="mt-8 card p-6 bg-white border-2 border-brand-gray-200">
              <h3 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-4">
                Payment Methods
              </h3>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="payment-stk"
                      name="payment-method"
                      value="stk"
                      checked={paymentMethod === "stk"}
                      onChange={(e) => setPaymentMethod(paymentMethod === "stk" ? null : "stk")}
                      className="mt-1 w-5 h-5 text-brand-green focus:ring-brand-green"
                    />
                    <label htmlFor="payment-stk" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-6 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[10px]">M-PESA</span>
                        </div>
                        <span className="font-semibold text-brand-gray-900">M-Pesa STK Push</span>
                      </div>
                    </label>
                  </div>
                  {paymentMethod === "stk" && (
                    <div className="mt-3 ml-8 p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                      <h4 className="font-semibold text-brand-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-6 h-5 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[8px]">M-PESA</span>
                        </div>
                        M-Pesa STK Push Payment
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="stk-phone" className="block text-sm font-medium text-brand-gray-900 mb-2">
                            Phone Number <span className="text-brand-red">*</span>
                          </label>
                          <input
                            id="stk-phone"
                            type="tel"
                            placeholder="2547XXXXXXXX"
                            value={stkPhone}
                            onChange={(e) => setStkPhone(e.target.value)}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label htmlFor="stk-amount" className="block text-sm font-medium text-brand-gray-900 mb-2">
                            Amount (KES) <span className="text-brand-red">*</span>
                          </label>
                          <input
                            id="stk-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={stkAmount}
                            onChange={(e) => setStkAmount(e.target.value)}
                            className="input-field"
                            min="1"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!stkPhone || !stkAmount) {
                              alert("Please enter phone number and amount");
                              return;
                            }
                            setIsProcessingStk(true);
                            try {
                              const response = await axios.post("/api/mpesa/stk-push", {
                                phone: stkPhone,
                                amount: parseFloat(stkAmount),
                              });
                              alert("Payment request sent! Please check your phone to complete the payment.");
                              setStkPhone("");
                              setStkAmount("");
                            } catch (error) {
                              console.error("STK Push error:", error);
                              alert("Failed to initiate payment. Please try again.");
                            } finally {
                              setIsProcessingStk(false);
                            }
                          }}
                          disabled={isProcessingStk || !stkPhone || !stkAmount}
                          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessingStk ? "Processing..." : "Pay Now"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="payment-till"
                      name="payment-method"
                      value="till"
                      checked={paymentMethod === "till"}
                      onChange={(e) => setPaymentMethod(paymentMethod === "till" ? null : "till")}
                      className="mt-1 w-5 h-5 text-brand-green focus:ring-brand-green"
                    />
                    <label htmlFor="payment-till" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-6 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[10px]">M-PESA</span>
                        </div>
                        <span className="font-semibold text-brand-gray-900">M-Pesa Till Number</span>
                      </div>
                    </label>
                  </div>
                  {paymentMethod === "till" && (
                    <div className="mt-3 ml-8 p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                      <h4 className="font-semibold text-brand-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-5 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[8px]">M-PESA</span>
                        </div>
                        How to Pay via Till Number
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-brand-gray-700 text-sm">
                        <li>Go to M-Pesa on your phone</li>
                        <li>Select <strong>Lipa na M-Pesa</strong></li>
                        <li>Select <strong>Buy Goods</strong></li>
                        <li>Enter Till Number: <strong className="text-brand-green">8618626</strong></li>
                        <li>Enter the amount</li>
                        <li>Enter your M-Pesa PIN</li>
                        <li>Confirm payment</li>
                        <li>Name: <strong>Floral Whispers</strong></li>
                      </ol>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="payment-paybill"
                      name="payment-method"
                      value="paybill"
                      checked={paymentMethod === "paybill"}
                      onChange={(e) => setPaymentMethod(paymentMethod === "paybill" ? null : "paybill")}
                      className="mt-1 w-5 h-5 text-brand-green focus:ring-brand-green"
                    />
                    <label htmlFor="payment-paybill" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-6 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[10px]">M-PESA</span>
                        </div>
                        <span className="font-semibold text-brand-gray-900">M-Pesa Paybill</span>
                      </div>
                    </label>
                  </div>
                  {paymentMethod === "paybill" && (
                    <div className="mt-3 ml-8 p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                      <h4 className="font-semibold text-brand-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-5 bg-[#007C42] rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[8px]">M-PESA</span>
                        </div>
                        How to Pay via Paybill
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-brand-gray-700 text-sm">
                        <li>Go to M-Pesa on your phone</li>
                        <li>Select <strong>Lipa na M-Pesa</strong></li>
                        <li>Select <strong>Paybill</strong></li>
                        <li>Enter Business Number: <strong className="text-brand-green">400200</strong></li>
                        <li>Enter Account Number: <strong className="text-brand-green">40040549</strong></li>
                        <li>Enter the amount</li>
                        <li>Enter your M-Pesa PIN</li>
                        <li>Confirm payment</li>
                        <li>Goes to: <strong>Coop Bank</strong></li>
                        <li>Name: <strong>Floral Whispers</strong></li>
                      </ol>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="payment-card"
                      name="payment-method"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(paymentMethod === "card" ? null : "card")}
                      className="mt-1 w-5 h-5 text-brand-green focus:ring-brand-green"
                    />
                    <label htmlFor="payment-card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-6 bg-white border border-gray-300 rounded flex items-center justify-center">
                          <span className="text-[#1434CB] font-bold text-[10px]">VISA</span>
                        </div>
                        <span className="font-semibold text-brand-gray-900">Card Payments</span>
                        <span className="text-xs text-brand-gray-500">(Coming Soon)</span>
                      </div>
                    </label>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="mt-3 ml-8 p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                      <h4 className="font-semibold text-brand-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-6 h-5 bg-white border border-gray-300 rounded flex items-center justify-center">
                          <span className="text-[#1434CB] font-bold text-[8px]">VISA</span>
                        </div>
                        Card Payment (Coming Soon)
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Card payments are coming soon. Please use M-Pesa payment methods for now.
                          </p>
                        </div>
                        <div className="space-y-4 opacity-50 pointer-events-none">
                          <div>
                            <label className="block text-sm font-medium text-brand-gray-900 mb-2">
                              Card Number
                            </label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              className="input-field"
                              disabled
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-brand-gray-900 mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="input-field"
                                disabled
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-brand-gray-900 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                placeholder="123"
                                className="input-field"
                                disabled
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-brand-gray-900 mb-2">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              className="input-field"
                              disabled
                            />
                          </div>
                          <button
                            type="button"
                            className="btn-primary w-full"
                            disabled
                          >
                            Pay with Card
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-2xl text-brand-gray-900 mb-6">
              Get In Touch
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
                    Phone
                  </h3>
                  <a
                    href={`tel:+${SHOP_INFO.phone}`}
                    className="text-brand-gray-700 hover:text-brand-green transition-colors"
                  >
                    +{SHOP_INFO.phone} / 0721554393
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
                    Email
                  </h3>
                  <a
                    href={`mailto:${SHOP_INFO.email}`}
                    className="text-brand-gray-700 hover:text-brand-green transition-colors"
                  >
                    {SHOP_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
                    Address
                  </h3>
                  <p className="text-brand-gray-700">{SHOP_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-1">
                    Hours
                  </h3>
                  <p className="text-brand-gray-700">{SHOP_INFO.hours}</p>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-brand-gray-50 mb-6">
              <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-3">
                Call Us
              </h3>
              <p className="text-brand-gray-700 mb-4">
                Speak with us directly for immediate assistance:
              </p>
              <a
                href={`tel:+${SHOP_INFO.phone}`}
                className="btn-primary inline-block"
              >
                Call Us
              </a>
            </div>

            <div className="card p-6 bg-brand-gray-50 mb-6">
              <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-3">
                WhatsApp Us
              </h3>
              <p className="text-brand-gray-700 mb-2">
                For quick inquiries, order updates, or to chat with us directly:
              </p>
              <p className="text-brand-gray-600 text-sm mb-4">
                WhatsApp: +{SHOP_INFO.whatsapp} / 0721554393
              </p>
              <a
                href={`https://wa.me/${SHOP_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-block"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="card p-6 bg-brand-green/5 border border-brand-green/20 mb-6">
              <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-3">
                Delivery Information
              </h3>
              <div className="space-y-3 text-brand-gray-700 text-sm">
                <div>
                  <p className="font-semibold text-brand-gray-900 mb-1">Nairobi CBD:</p>
                  <p>Free same-day delivery. Your beautiful gifts arrive the same day at no extra cost.</p>
                </div>
                <div>
                  <p className="font-semibold text-brand-gray-900 mb-1">Outside CBD:</p>
                  <p>Delivery within 24 hours at a nominal fee. We ensure your gifts reach you fresh and on time, wherever you are.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

