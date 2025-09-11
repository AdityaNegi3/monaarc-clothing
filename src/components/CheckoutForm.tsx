// src/components/CheckoutForm.tsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CreditCard, Lock, User } from 'lucide-react';

type Summary = {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  finalTotal: number;
};

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const formatCurrency = (n: number) => currencyFormatter.format(n);

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const CheckoutForm: React.FC<{ onClose: () => void; summary: Summary }> = ({ onClose, summary }) => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Prefer the final total from summary (which includes discounts and shipping).
  // Fallback to getTotalPrice() if summary is missing for any reason.
  const totalAmount = typeof summary?.finalTotal === 'number' ? summary.finalTotal : getTotalPrice();

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpayPayment = async () => {
    // Basic front-end validation: ensure required customer fields are filled
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in name, email, phone and address before proceeding.');
      return;
    }

    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      alert('Razorpay SDK failed to load. Please try again later.');
      return;
    }

    const amountInPaise = Math.round((totalAmount || 0) * 100); // Razorpay expects paise

    const options = {
      key: 'rzp_live_RAN3mONBuaMP9h', // Your live key (already in your code)
      amount: amountInPaise,
      currency: 'INR',
      name: 'MONAARC',
      description: 'Luxury Clothing Purchase',
      handler: async function (response: any) {
        // On successful payment we submit order details to Formsubmit (as you had)
        try {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://formsubmit.co/monaarc.clothing@gmail.com';

          const addField = (name: string, value: string) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
          };

          addField('Full Name', customerInfo.name);
          addField('Email', customerInfo.email);
          addField('Phone Number', customerInfo.phone);
          addField('Address', `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.postalCode}`);
          addField('Subtotal', formatCurrency(summary.subtotal));
          addField('Discount', `-${formatCurrency(summary.discountAmount)}`);
          addField('Shipping', formatCurrency(summary.shippingCost));
          addField('Total Amount', formatCurrency(totalAmount));
          addField('Payment Provider', 'Razorpay');
          addField('Razorpay Payment ID', response?.razorpay_payment_id ?? '');
          addField('Razorpay Order ID', response?.razorpay_order_id ?? '');
          addField('Razorpay Signature', response?.razorpay_signature ?? '');

          cartItems.forEach((item, index) => {
            const qty = Number(item.quantity) || 1;
            const itemTotal = (Number(item.price) || 0) * qty;
            addField(`Item ${index + 1}`, `${item.name} (Size: ${item.size}, Qty: ${qty}) - ${formatCurrency(itemTotal)}`);
          });

          addField('_captcha', 'false');
          addField('_next', 'https://monaarcclothing.com/thank-you');

          document.body.appendChild(form);
          form.submit();

          clearCart();
          onClose();
        } catch (err) {
          console.error('Error submitting order form:', err);
          alert('Payment succeeded but we failed to submit order details. Please contact support.');
        }
      },
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.phone,
      },
      notes: {
        address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.postalCode}`,
      },
      theme: {
        color: '#F59E0B',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRazorpayPayment();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Secure Checkout</h3>
        <div className="flex items-center justify-center text-gray-400 text-sm">
          <Lock className="w-4 h-4 mr-2" />
          Powered by Razorpay
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-white font-semibold flex items-center">
          <User className="w-5 h-5 mr-2" />
          Customer Information
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="Full Name"
            placeholder="Full Name *"
            required
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
          />
          <input
            type="email"
            name="Email"
            placeholder="Email Address *"
            required
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
          />
        </div>

        <input
          type="tel"
          name="Phone Number"
          placeholder="Phone Number *"
          required
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
        />

        <textarea
          name="Address"
          placeholder="Complete Address *"
          rows={3}
          required
          value={customerInfo.address}
          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 resize-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="City"
            placeholder="City *"
            required
            value={customerInfo.city}
            onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
          />
          <input
            type="text"
            name="State"
            placeholder="State *"
            required
            value={customerInfo.state}
            onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
          />
          <input
            type="text"
            name="PIN Code"
            placeholder="PIN Code *"
            required
            value={customerInfo.postalCode}
            onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
          />
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Order Summary
        </h4>

        <div className="space-y-2 text-gray-300 text-sm mb-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-green-300">-{formatCurrency(summary.discountAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{summary.shippingCost > 0 ? formatCurrency(summary.shippingCost) : 'Free'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-white font-bold text-lg">
          <span>Total Amount</span>
          <span className="text-yellow-400">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 px-6 rounded-lg font-semibold text-lg bg-yellow-400 text-black hover:bg-yellow-300 hover:transform hover:scale-105"
      >
        <Lock className="w-5 h-5 mr-2 inline" />
        Pay {formatCurrency(totalAmount)} Securely
      </button>

      <div className="text-center text-xs text-gray-500">
        Secure payment via Razorpay
      </div>
    </form>
  );
};

export default CheckoutForm;
