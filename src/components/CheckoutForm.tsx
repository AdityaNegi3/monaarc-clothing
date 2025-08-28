import React, { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { CreditCard, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
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

  const totalAmount = useMemo(() => getTotalPrice(), [getTotalPrice, cartItems]);

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // --- Send order to FormSubmit (AJAX). Fallback to classic POST if AJAX fails/CORS blocks.
  const sendOrderToFormSubmit = async (payload: Record<string, string>) => {
    try {
      // FormSubmit JSON endpoint for AJAX
      const endpoint = 'https://formsubmit.co/ajax/monaarc.clothing@gmail.com';

      const formBody = new URLSearchParams(payload);
      // FormSubmit options: disable CAPTCHA; (no redirect since AJAX)
      formBody.append('_captcha', 'false');

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: formBody.toString(),
      });

      if (!res.ok) throw new Error('FormSubmit AJAX failed');
      return true;
    } catch {
      // Fallback: classic hidden form POST with redirect (will reload page)
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

      Object.entries(payload).forEach(([k, v]) => addField(k, v));
      addField('_captcha', 'false');
      // If fallback happens, send them to your Thank You page after redirect
      addField('_next', 'https://monaarcclothing.com/thank-you');

      document.body.appendChild(form);
      form.submit();
      return false; // indicates we triggered a full redirect
    }
  };

  const handleRazorpayPayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    const options = {
      key: 'rzp_live_RAN3mONBuaMP9h', // move to env in production
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      name: 'MONAARC',
      description: 'Luxury Clothing Purchase',
      handler: async (rzpResponse: any) => {
        // Prepare payload for FormSubmit
        const payload: Record<string, string> = {
          'Full Name': customerInfo.name,
          Email: customerInfo.email,
          'Phone Number': customerInfo.phone,
          Address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.postalCode}`,
          'Total Amount': `₹${totalAmount}`,
          'Razorpay Order ID': rzpResponse?.razorpay_order_id || '',
          'Razorpay Payment ID': rzpResponse?.razorpay_payment_id || '',
          'Razorpay Signature': rzpResponse?.razorpay_signature || '',
        };

        // Line items
        cartItems.forEach((item, index) => {
          payload[`Item ${index + 1}`] = `${item.name} (Size: ${item.size}, Qty: ${item.quantity}) - ₹${item.price * item.quantity}`;
        });

        // Try AJAX (no reload). If it falls back, a redirect will happen and code below won't run.
        const stayedOnPage = await sendOrderToFormSubmit(payload);

        // Clear + navigate only if we stayed in SPA (AJAX worked)
        if (stayedOnPage) {
          const thankYouState = {
            orderId: rzpResponse?.razorpay_order_id,
            paymentId: rzpResponse?.razorpay_payment_id,
            amount: totalAmount,
            email: customerInfo.email,
            name: customerInfo.name,
          };

          clearCart();
          onClose?.();
          navigate('/thank-you', { replace: true, state: thankYouState });
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
      theme: { color: '#F59E0B' },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!cartItems.length || totalAmount <= 0) {
      alert('Your cart is empty.');
      return;
    }

    // Basic client-side validation guard
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.state || !customerInfo.postalCode) {
      alert('Please fill all required fields.');
      return;
    }

    await handleRazorpayPayment();
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Secure Checkout</h3>
        <div className="flex items-center justify-center text-gray-400 text-sm">
          <Lock className="w-4 h-4 mr-2" />
          Powered by Razorpay & FormSubmit
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
            className={inputClass}
          />
          <input
            type="email"
            name="Email"
            placeholder="Email Address *"
            required
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            className={inputClass}
          />
        </div>

        <input
            type="tel"
            name="Phone Number"
            placeholder="Phone Number *"
            required
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
            pattern="^[0-9+\-()\s]{7,15}$"
            className={inputClass}
        />

        <textarea
          name="Address"
          placeholder="Complete Address *"
          rows={3}
          required
          value={customerInfo.address}
          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
          className={`${inputClass} resize-none`}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="City"
            placeholder="City *"
            required
            value={customerInfo.city}
            onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            name="State"
            placeholder="State *"
            required
            value={customerInfo.state}
            onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            name="PIN Code"
            placeholder="PIN Code *"
            required
            value={customerInfo.postalCode}
            onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Order Summary
        </h4>
        <div className="flex justify-between items-center text-white font-bold text-lg">
          <span>Total Amount</span>
          <span className="text-yellow-400">₹{totalAmount}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!cartItems.length || totalAmount <= 0}
        className="w-full py-4 px-6 rounded-lg font-semibold text-lg bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Lock className="w-5 h-5 mr-2 inline" />
        Pay ₹{totalAmount} Securely
      </button>

      <div className="text-center text-xs text-gray-500">
        Secure payment via Razorpay • Order confirmation via FormSubmit
      </div>
    </form>
  );
};

export default CheckoutForm;
