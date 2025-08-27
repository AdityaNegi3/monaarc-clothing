"use client";
import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../contexts/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  selectedSize?: string;
  isCartCheckout?: boolean;
}

const API_BASE: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_API_BASE_URL) ||
  "";

const RAZORPAY_KEY_ID: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_RAZORPAY_KEY_ID) ||
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_RAZORPAY_KEY_ID) ||
  ""; // don't hardcode live key; read from env

function useRazorpayLoader() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => setReady(false);
    document.body.appendChild(script);
    return () => {
      // don't remove the script; keep it cached for subsequent opens
    };
  }, []);
  return ready;
}

const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  product,
  selectedSize,
  isCartCheckout = false,
}) => {
  const { state } = useCart();
  const rzpReady = useRazorpayLoader();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sanitizedApiBase = useMemo(() => API_BASE.replace(/\/+$/, ""), []);
  const cartTotal = useMemo(() => Number(state?.total || 0), [state?.total]);

  const hasItems = useMemo(() => {
    if (isCartCheckout) return Array.isArray(state.items) && state.items.some(i => i.quantity > 0);
    return !!product && !!selectedSize;
  }, [isCartCheckout, state.items, product, selectedSize]);

  if (!isOpen) return null;

  function buildOrderDetails() {
    if (isCartCheckout) {
      const lines = (state.items || []).map(
        (item) =>
          `${item.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ₹${Number(item.price) * Number(item.quantity)}`
      );
      return { text: lines.join("\n"), total: cartTotal };
    } else if (product && selectedSize) {
      return { text: `${product.name} (Size: ${selectedSize}) - ₹${Number(product.price)}`, total: Number(product.price) || 0 };
    }
    return { text: "", total: 0 };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // ensure no page reload
    if (!hasItems) return;

    if (!sanitizedApiBase) {
      alert("Payment server URL is not set (VITE_API_BASE_URL).");
      return;
    }
    if (!RAZORPAY_KEY_ID) {
      alert("Razorpay key is not set (VITE_RAZORPAY_KEY_ID).");
      return;
    }

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const address = formData.address.trim();
    if (!name || !phone || !email || !address) {
      alert("Please fill all fields.");
      return;
    }

    const { text: orderDetails, total: totalAmount } = buildOrderDetails();
    const amountPaise = Math.max(0, Math.round(Number(totalAmount) * 100)); // ₹→paise
    if (!amountPaise || amountPaise < 100) {
      alert("Invalid amount.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!rzpReady || !window.Razorpay) {
        alert("Payment SDK failed to load. Check your network/adblock.");
        setIsSubmitting(false);
        return;
      }

      // 1) Create order on backend
      const createOrderRes = await fetch(`${sanitizedApiBase}/api/razorpay/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          notes: {
            customer_name: name,
            customer_phone: phone,
            customer_email: email,
            address,
            order_details: orderDetails,
          },
        }),
      });

      if (!createOrderRes.ok) {
        const t = await createOrderRes.text();
        throw new Error(t || "Failed to create order");
      }

      const data = await createOrderRes.json();
      const order = data?.order || data; // support either shape
      if (!order?.id || !order?.amount) throw new Error("Malformed order from server");

      // 2) Open Razorpay
      const options = {
        key: RAZORPAY_KEY_ID,
        name: "MONAARC",
        description: "Order Payment",
        currency: "INR",
        amount: order.amount,
        order_id: order.id,
        prefill: { name, email, contact: phone },
        notes: { order_details: orderDetails },
        theme: { color: "#000000" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 3) Verify signature on backend
            const verifyRes = await fetch(`${sanitizedApiBase}/api/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok || !verifyJson?.ok) {
              throw new Error(verifyJson?.error || "Payment verification failed");
            }

            // 4) Send order email to you (optional; can be moved server-side)
            try {
              await fetch("https://formsubmit.co/ajax/monaarc.clothing@gmail.com", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                  name,
                  phone,
                  email,
                  address,
                  order_details: orderDetails,
                  total_amount: String(totalAmount),
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  _subject: "New MONAARC Order",
                  _captcha: "false",
                }),
              });
            } catch {
              // ignore email failures
            }

            onClose();
            alert("Payment successful 🎉");
          } catch (err: any) {
            alert(err?.message || "Payment verification failed");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Something went wrong");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Order Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors" type="button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-white focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData((s) => ({ ...s, phone: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-white focus:outline-none"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-white focus:outline-none"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">Delivery Address</label>
            <textarea
              required
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData((s) => ({ ...s, address: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-white focus:outline-none resize-none"
              placeholder="Enter your complete delivery address"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900 rounded-lg p-4 mt-6">
            <h3 className="text-white font-semibold mb-2">Order Summary</h3>
            {isCartCheckout ? (
              <div className="space-y-1">
                {state.items.map((item: any) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="text-gray-300 text-sm">
                    {item.name} (Size: {item.selectedSize}, Qty: {item.quantity})
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="text-white font-bold">Total: ₹{cartTotal}</div>
                </div>
              </div>
            ) : product && selectedSize ? (
              <div className="space-y-1">
                <div className="text-gray-300 text-sm">
                  {product.name} (Size: {selectedSize})
                </div>
                <div className="text-white font-bold">₹{Number(product.price)}</div>
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !hasItems || !rzpReady}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? "Processing..." : (rzpReady ? "Proceed to Payment" : "Loading payment...")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
