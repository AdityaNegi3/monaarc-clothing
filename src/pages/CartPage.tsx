import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const totalPrice = getTotalPrice();

  if (cartItems.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Discover our luxury collections and add items to your cart.</p>
          <Link
            to="/"
            className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="bg-gray-900/50 rounded-lg border border-white/10 p-6"
              >
                <div className="flex items-center space-x-6">
                  <img
                    src={item.frontImage}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">Size: {item.size}</p>
                    <p className="text-yellow-400 font-bold">₹{item.price}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900/50 rounded-lg border border-white/10 p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowCheckout(true)}
              className="w-full bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-300 mb-4"
            >
              Secure Checkout
            </button>
            
            <Link
              to="/"
              className="block text-center text-gray-400 hover:text-white transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Checkout</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <CheckoutForm onClose={() => setShowCheckout(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;