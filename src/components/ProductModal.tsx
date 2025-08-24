import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, size: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onBuyNow }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [showFront, setShowFront] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { dispatch } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, size: selectedSize } });
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    onBuyNow(product, selectedSize);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div 
                className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={showFront ? product.images.front : product.images.back}
                  alt={product.name}
                  className={`w-full rounded-lg transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                />
                <div className="absolute top-2 right-2">
                  {isZoomed ? <ZoomOut className="text-white" size={20} /> : <ZoomIn className="text-white" size={20} />}
                </div>
              </div>

              {/* Front/Back Toggle */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFront(true)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    showFront 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent text-white border-gray-600 hover:border-white'
                  }`}
                >
                  Front View
                </button>
                <button
                  onClick={() => setShowFront(false)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    !showFront 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent text-white border-gray-600 hover:border-white'
                  }`}
                >
                  Back View
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">
                  {product.edition} Edition
                </p>
                <p className="text-white text-3xl font-bold">₹{product.price}</p>
                {product.description && (
                  <p className="text-gray-300 mt-4">{product.description}</p>
                )}
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white text-lg font-semibold">Size</h3>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="text-gray-400 hover:text-white text-sm underline"
                  >
                    Size Chart
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded-lg border transition-colors ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-white border-gray-600 hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-600"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="bg-black border border-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">Size Chart</h3>
              <button
                onClick={() => setShowSizeChart(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 text-white font-semibold border-b border-gray-700 pb-2">
                <span>Size</span>
                <span>Chest</span>
                <span>Length</span>
              </div>
              {[
                { size: 'S', chest: '36"', length: '26"' },
                { size: 'M', chest: '38"', length: '27"' },
                { size: 'L', chest: '40"', length: '28"' },
                { size: 'XL', chest: '42"', length: '29"' },
                { size: 'XXL', chest: '44"', length: '30"' }
              ].map((item) => (
                <div key={item.size} className="grid grid-cols-3 gap-4 text-gray-300 py-1">
                  <span>{item.size}</span>
                  <span>{item.chest}</span>
                  <span>{item.length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModal;