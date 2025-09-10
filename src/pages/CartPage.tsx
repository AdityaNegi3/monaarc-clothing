// src/pages/CartPage.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const formatCurrency = (n: number) => `₹${n.toFixed(0)}`;

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingOption, setShippingOption] = useState<'free' | 'fast'>('free');

  const shippingCost = shippingOption === 'fast' ? 100 : 0;
  const subtotal = useMemo(() => getTotalPrice(), [cartItems, getTotalPrice]);

  // total quantity in cart
  const totalQty = useMemo(() => cartItems.reduce((s, it) => s + (it.quantity || 0), 0), [cartItems]);

  // Discount tiers by total quantity
  const discountRate = useMemo(() => {
    if (totalQty >= 3) return 0.15;
    if (totalQty === 2) return 0.10;
    return 0;
  }, [totalQty]);

  const discountAmount = useMemo(() => +(subtotal * discountRate), [subtotal, discountRate]);
  const totalAfterDiscount = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);
  const finalTotal = useMemo(() => totalAfterDiscount + shippingCost, [totalAfterDiscount, shippingCost]);

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Discover our luxury collections and add items to your cart.</p>
          <Link
            to="/"
            className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-black">
      {/* Spacer to match fixed navbar height */}
      <div className="h-16 lg:h-20" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ scrollMarginTop: '5.5rem' }}>
            Shopping Cart
          </h1>

          {/* Promo banner - responsive */}
          <div className="ml-0 sm:ml-4">
            <div className="inline-flex items-center bg-white/5 border border-white/10 text-xs sm:text-sm text-yellow-300 px-3 py-2 rounded-lg">
              <strong className="mr-2 text-white text-sm sm:text-base">Bundle deal:</strong>
              <span className="mr-2">Buy 2 — 10% off</span>
              <span className="mx-2 hidden sm:inline">|</span>
              <span>Buy 3+ — 15% off</span>
            </div>
          </div>
        </div>

        {/* Grid: items first, summary second on desktop; on mobile stacks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items (spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="bg-black rounded-lg border border-white/10 p-4 sm:p-6">
                {/* Use column on mobile, row on sm+ */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.frontImage}
                      alt={item.name}
                      className="w-28 h-28 sm:w-24 sm:h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg sm:text-base leading-tight">
                      {/* keep name wrapped cleanly */}
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Size: {item.size}</p>
                    <p className="text-yellow-400 font-bold mt-3">{formatCurrency(item.price)}</p>
                  </div>

                  {/* Controls: place under details on mobile, inline on desktop */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center justify-start sm:justify-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200 flex items-center justify-center p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-black rounded-lg border border-white/10 p-4 sm:p-6">
            <h2 className="text-xl font-bold text-white mb-3">Order Summary</h2>

            {discountRate > 0 ? (
              <div className="mb-4 p-3 rounded-md bg-green-900/30 border border-green-700 text-green-200 text-sm">
                Nice! You're getting <strong>{discountRate * 100}%</strong> off for buying <strong>{totalQty}</strong> item(s).
              </div>
            ) : (
              <div className="mb-4 p-3 rounded-md bg-white/3 border border-white/10 text-gray-300 text-sm">
                Buy 2 items to get 10% off, or 3+ items to get 15% off.
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Discount ({discountRate * 100}%)</span>
                <span className="text-green-300">-{formatCurrency(discountAmount)}</span>
              </div>

              <div className="flex flex-col space-y-2 pt-1">
                <label className="flex items-center text-gray-400 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="free"
                    checked={shippingOption === 'free'}
                    onChange={() => setShippingOption('free')}
                    className="mr-2"
                  />
                  Free Shipping (6 days)
                </label>
                <label className="flex items-center text-gray-400 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="fast"
                    checked={shippingOption === 'fast'}
                    onChange={() => setShippingOption('fast')}
                    className="mr-2"
                  />
                  Fast Shipping (3 days) — ₹100
                </label>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>{shippingOption === 'fast' ? formatCurrency(shippingCost) : 'Free'}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 mt-4"
            >
              Secure Checkout
            </button>

            <Link to="/" className="block text-center text-gray-400 hover:text-white transition-colors duration-200 mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Checkout</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
              >
                ✕
              </button>
            </div>

            <CheckoutForm onClose={() => setShowCheckout(false)} summary={{ subtotal, discountAmount, shippingCost, finalTotal }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
