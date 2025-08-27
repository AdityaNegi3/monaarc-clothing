"use client";
import React, { useMemo, useState } from "react";
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
  "rzp_live_RAN3mONBuaMP9h"; // public key is safe in browser

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  product,
  selectedSize,
  isCartCheckout = false,
}) => {
  const { state } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasItems = useMemo(() => {
    if (isCartCheckout) return state.items && state.items.length > 0;
    return !!product && !!selectedSize;
  }, [isCartCheckout, state.items, product, selectedSize]);

  if (!isOpen) return null;

  const buildOrderDetails = () => {
    if (isCartCheckout) {
      const lines = state.items.map(
        (item) =>
          `${item.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ₹${item.price * item.quantity}`
      );
      return { text: lines.join("\n"), total: Number(state.total) || 0 };
    } else if (product && selectedSize) {
      return { text: `${product.name} (Size: ${selectedSize}) - ₹${product.price}`, total: Number(product.price) || 0 };
    }
    return { text: "", total: 0 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasItems) return;

    // env checks
    if (!API_BASE || !RAZORPAY_KEY_ID) return;

    setIsSubmitting(true);

    try {
      const name = formData.name.trim();
      const phone = formData.phone.trim();
      const email = formData.email.trim();
      const address = formData.address.trim();

      const { text: orderDetails, total: totalAmount } = buildOrderDetails();
      const amountPaise = Math.round(Number(totalAmount) * 100);
      if (!amountPaise || amountPaise < 100) {
        setIsSubmitting(false);
        return;
      }

      // 1) Load SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        setIsSubmitting(false);
        return;
      }

      // 2) Create order on backend
      const createOrderRes = await fetch(`${API_BASE.replace(/\/+$/, "")}/api/razorpay/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          notes: {
            customer_name: name,
            customer_phone: phone,
            customer_email: email,
            order_details: orderDetails,
          },
        }),
      });
      if (!createOrderRes.ok) {
        setIsSubmitting(false);
        return;
      }
      const { order } = await createOrderRes.json();
      if (!order?.id || !order?.amount) {
        setIsSubmitting(false);
        return;
      }

      // 3) Open Razorpay immediately (no alerts)
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
        // Keep redirect false (popup) for better UX. Set to true if you prefer fullpage checkout.
        // redirect: false,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Verify on server
            const verifyRes = await fetch(`${API_BASE.replace(/\/+$/, "")}/api/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyJson.ok) {
              setIsSubmitting(false);
              return;
            }

            // Email via FormSubmit (AJAX JSON)
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

            onClose();
          } catch (err) {
            // swallow errors (no alerts)
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
      };

      const rzp = new window.Razorpay(options);

      // If popup ever gets blocked, a zero-timeout nudge helps some browsers
      setTimeout(() => rzp.open(), 0);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Order Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
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
                {state.items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="text-gray-300 text-sm">
                    {item.name} (Size: {item.selectedSize}, Qty: {item.quantity})
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="text-white font-bold">Total: ₹{state.total}</div>
                </div>
              </div>
            ) : product && selectedSize ? (
              <div className="space-y-1">
                <div className="text-gray-300 text-sm">
                  {product.name} (Size: {selectedSize})
                </div>
                <div className="text-white font-bold">₹{product.price}</div>
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !hasItems}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
