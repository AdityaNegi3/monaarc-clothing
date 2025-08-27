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
    if (!hasItems) {
      alert("Your cart is empty or the product/size is missing.");
      return;
    }
    // basic sanity on envs
    if (!API_BASE) {
      console.error("Missing API base URL env. Set VITE_API_BASE_URL or REACT_APP_API_BASE_URL.");
      alert("Payments are temporarily unavailable. Please try again shortly.");
      return;
    }
    if (!RAZORPAY_KEY_ID) {
      console.error("Missing Razorpay Key ID env.");
      alert("Payment configuration error. Please contact support.");
      return;
    }

    setIsSubmitting(true);

    try {
      // sanitize inputs
      const name = formData.name.trim();
      const phone = formData.phone.trim();
      const email = formData.email.trim();
      const address = formData.address.trim();

      const { text: orderDetails, total: totalAmount } = buildOrderDetails();
      const amountPaise = Math.round(Number(totalAmount) * 100);

      if (!amountPaise || amountPaise < 100) {
        // Razorpay minimum is ₹1.00 (100 paise) for testing; you’re already showing ₹1 in screenshot.
        alert("Invalid amount. Please check your cart.");
        setIsSubmitting(false);
        return;
      }

      // 1) Load SDK (must be before new Razorpay)
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay failed to load. Check your network and try again.");
        setIsSubmitting(false);
        return;
      }

      // 2) Create order on your backend
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
        const t = await createOrderRes.text();
        console.error("Create order failed:", t);
        alert("Could not start payment. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const { order } = await createOrderRes.json();
      if (!order?.id || !order?.amount) {
        console.error("Invalid order payload:", order);
        alert("Payment service error. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // 3) Prepare checkout options
      const options = {
        key: RAZORPAY_KEY_ID,
        name: "MONAARC",
        description: "Order Payment",
        currency: "INR",
        amount: order.amount, // integer paise from server
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
            // 4) Verify on server
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
              alert("Payment verification failed. Please contact support with your Order ID.");
              setIsSubmitting(false);
              return;
            }

            // 5) Email receipt / order to you via FormSubmit AJAX
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

            // success UX
            onClose();
            alert("Payment successful! Order confirmed.");
          } catch (err) {
            console.error("Post-payment flow error:", err);
            alert("Payment captured, but we couldn't auto-confirm the order. We'll reach out shortly.");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Optional: listen to payment failures for nicer messaging
      rzp.on?.("payment.failed", (resp: any) => {
        console.error("Razorpay payment.failed", resp);
        setIsSubmitting(false);
        alert("Payment failed or cancelled. You were not charged.");
      });

      // 4) Open checkout
      rzp.open();
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong while starting the payment. Please try again.");
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
