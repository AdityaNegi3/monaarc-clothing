import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const { state, dispatch } = useCart();

  if (!state.isOpen) return null;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
    }
  };

  const handleCheckout = () => {
    dispatch({ type: 'CLOSE_CART' });
    onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-end">
      <div className="bg-black border-l border-gray-800 w-full max-w-md h-full overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <ShoppingBag size={24} className="mr-2" />
              Cart ({state.items.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
            <button
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="bg-gray-900 rounded-lg p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.images.front}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{item.name}</h4>
                        <p className="text-gray-400 text-sm">Size: {item.selectedSize}</p>
                        <p className="text-white font-bold">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: `${item.id}-${item.selectedSize}` })}
                          className="text-gray-400 hover:text-white"
                        >
                          <X size={16} />
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(`${item.id}-${item.selectedSize}`, item.quantity - 1)}
                            className="text-white hover:bg-gray-800 p-1 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-white px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(`${item.id}-${item.selectedSize}`, item.quantity + 1)}
                            className="text-white hover:bg-gray-800 p-1 rounded"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-800 pt-4 mb-6">
                <div className="flex justify-between items-center text-white text-xl font-bold">
                  <span>Total:</span>
                  <span>₹{state.total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;