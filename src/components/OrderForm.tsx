import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  selectedSize?: string;
  isCartCheckout?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  selectedSize, 
  isCartCheckout = false 
}) => {
  const { state } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order details
      let orderDetails = '';
      let totalAmount = 0;

      if (isCartCheckout) {
        orderDetails = state.items.map(item => 
          `${item.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ₹${item.price * item.quantity}`
        ).join('\n');
        totalAmount = state.total;
      } else if (product && selectedSize) {
        orderDetails = `${product.name} (Size: ${selectedSize}) - ₹${product.price}`;
        totalAmount = product.price;
      }

      // Submit to formsubmit.co
      const formSubmitData = new FormData();
      formSubmitData.append('name', formData.name);
      formSubmitData.append('phone', formData.phone);
      formSubmitData.append('email', formData.email);
      formSubmitData.append('address', formData.address);
      formSubmitData.append('order_details', orderDetails);
      formSubmitData.append('total_amount', totalAmount.toString());

      await fetch('https://formsubmit.co/monaarc.clothing@gmail.com', {
        method: 'POST',
        body: formSubmitData
      });

      // Redirect to Razorpay (placeholder implementation)
      const razorpayOptions = {
        key: 'rzp_live_RAN3mONBuaMP9h', // User will replace this
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'MONAARC',
        description: 'Order Payment',
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          order_details: orderDetails,
        },
        theme: {
          color: '#000000'
        }
      };

      // This is a placeholder - in real implementation, Razorpay script would be loaded
      console.log('Razorpay Options:', razorpayOptions);
      alert('Order submitted successfully! In production, this would redirect to Razorpay payment.');
      
      onClose();
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Order Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Full Name
            </label>
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
            <label className="block text-white text-sm font-semibold mb-2">
              Phone Number
            </label>
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
            <label className="block text-white text-sm font-semibold mb-2">
              Email Address
            </label>
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
            <label className="block text-white text-sm font-semibold mb-2">
              Delivery Address
            </label>
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
                {state.items.map(item => (
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
            {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;