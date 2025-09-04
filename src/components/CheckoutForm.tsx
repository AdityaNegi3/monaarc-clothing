import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CreditCard, Lock, Phone, Mail, MapPin, User } from 'lucide-react';

const CheckoutForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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

  const totalAmount = getTotalPrice();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    const options = {
      key: 'rzp_live_RAN3mONBuaMP9h', // ✅ Your live Razorpay Key ID
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'MONAARC',
      description: 'Luxury Clothing Purchase',
      handler: async function (response: any) {
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
        addField('Total Amount', `₹${totalAmount}`);

        cartItems.forEach((item, index) => {
          addField(`Item ${index + 1}`, `${item.name} (Size: ${item.size}, Qty: ${item.quantity}) - ₹${item.price * item.quantity}`);
        });

        addField('_captcha', 'false');
        addField('_next', 'https://monaarcclothing.com/thank-you'); // ✅ Redirect to thank you

        document.body.appendChild(form);
        form.submit();

        clearCart();
        onClose();
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
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
          />
          <input
            type="email"
            name="Email"
            placeholder="Email Address *"
            required
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
          />
        </div>

        <input
          type="tel"
          name="Phone Number"
          placeholder="Phone Number *"
          required
          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
        />

        <textarea
          name="Address"
          placeholder="Complete Address *"
          rows={3}
          required
          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 resize-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="City"
            placeholder="City *"
            required
            onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
          />
          <input
            type="text"
            name="State"
            placeholder="State *"
            required
            onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400"
          />
          <input
            type="text"
            name="PIN Code"
            placeholder="PIN Code *"
            required
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
        <div className="flex justify-between items-center text-white font-bold text-lg">
          <span>Total Amount</span>
          <span className="text-yellow-400">₹{totalAmount}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 px-6 rounded-lg font-semibold text-lg bg-yellow-400 text-black hover:bg-yellow-300 hover:transform hover:scale-105"
      >
        <Lock className="w-5 h-5 mr-2 inline" />
        Pay ₹{totalAmount} Securely
      </button>

      <div className="text-center text-xs text-gray-500">
        Secure payment via Razorpay 
      </div>
    </form>
  );
};

export default CheckoutForm;