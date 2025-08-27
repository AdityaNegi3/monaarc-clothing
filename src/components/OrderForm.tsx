"use client";
import React, { useState } from "react";
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

const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_API_BASE_URL) ||
  ""; // e.g. "https://api.yourdomain.com" or "http://localhost:5000"

const RAZORPAY_KEY_ID =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_RAZORPAY_KEY_ID) ||
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_RAZORPAY_KEY_ID) ||
  "rzp_live_RAN3mONBuaMP9h"; // fallback to your live key id (safe to expose public key id)

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
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

  if (!isOpen) return null;

  const buildOrderDetails = () => {
    if (isCartCheckout) {
      const lines = state.items.map(
        (item) =>
          `${item.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ₹${
            item.price * item.quantity
          }`
      );
      return {
        text: lines.join("\n"),
        total: state.total,
      };
    } else if (product && selectedSize) {
      return {
        text: `${product.name} (Size: ${selectedSize}) - ₹${product.price}`,
        total: product.price,
      };
    }
    return { text: "", total: 0 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { text: orderDetails, total: totalAmount } = buildOrderDetails();
      if (!totalAmount || totalAmount <= 0) {
        alert("No items to checkout.");
        setIsSubmitting(false);
        return;
      }

      // 1) Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed to load. Check your network.");
        setIsSubmitting(false);
        return;
      }

      // 2) Create order on your server (amount MUST be integer paise)
      if (!API_BASE) {
        console.error("Missing API_BASE_URL env. Set VITE_API_BASE_URL or REACT_APP_API_BASE_URL.");
        alert("Payment service temporarily unavailable. Please try again shortly.");
        setIsSubmitting(false);
        return;
      }

      const createOrderRes = await fetch(`${API_BASE}/api/razorpay/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(Number(totalAmount) * 100),
          currency: "INR",
          notes: {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_email: formData.email,
            order_details: orderDetails,
          },
        }),
      });

      if (!createOrderRes.ok) {
        console.error(await createOrderRes.text());
        alert("Could not create order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const { order } = await createOrderRes.json();

      // 3) Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        name: "MONAARC",
        description: "Order Payment",
        currency: "INR",
        amount: order.amount, // integer paise from server
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: { order_details: orderDetails },
        theme: { color: "#000000" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4) Verify payment on your server
            const verifyRes = await fetch(`${API_BASE}/api/razorpay/verify`, {
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
              alert("Payment verification failed. Please contact support.");
              setIsSubmitting(false);
              return;
            }

            // 5) Send email via FormSubmit (AJAX JSON endpoint to avoid CORS issues)
            await fetch("https://formsubmit.co/ajax/monaarc.clothing@gmail.com", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                order_details: orderDetails,
                total_amount: String(totalAmount),
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                _subject: "New MONAARC Order",
                _captcha: "false",
              }),
            });

            alert("Payment successful! Order confirmed.");
            onClose();
          } catch (err) {
            console.error("Post-payment error:", err);
            alert("Payment received, but we couldn't finalize the order automatically. We'll reach out shortly.");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: { ondismiss: () => setIsSubmitting(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Error submitting order. Please try again.");
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
            disabled={isSubmitting}
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
