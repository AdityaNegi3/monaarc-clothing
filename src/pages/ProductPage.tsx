import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { Check, Info } from 'lucide-react';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative aspect-w-3 aspect-h-4 bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={currentView === 'front' ? product.frontImage : product.backImage}
                alt={`${product.name} ${currentView} view`}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('front')}
                className={`flex-1 py-3 px-6 rounded-lg border transition-all duration-300 ${
                  currentView === 'front'
                    ? 'bg-yellow-400 text-black border-yellow-400 font-semibold'
                    : 'bg-transparent text-white border-white/20 hover:border-yellow-400/50'
                }`}
              >
                Front View
              </button>
              <button
                onClick={() => setCurrentView('back')}
                className={`flex-1 py-3 px-6 rounded-lg border transition-all duration-300 ${
                  currentView === 'back'
                    ? 'bg-yellow-400 text-black border-yellow-400 font-semibold'
                    : 'bg-transparent text-white border-white/20 hover:border-yellow-400/50'
                }`}
              >
                Back View
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 rounded-full mb-4">
                {product.category.toUpperCase()} EDITION
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {product.description}
              </p>
              <div className="text-3xl font-bold text-yellow-400">
                ₹{product.price}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Size</h3>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 flex items-center text-sm"
                >
                  <Info className="w-4 h-4 mr-1" />
                  Size Chart
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border rounded-lg transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-yellow-400 text-black border-yellow-400 font-semibold'
                        : 'bg-transparent text-white border-white/20 hover:border-yellow-400/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-300 ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-yellow-400 text-black hover:bg-yellow-300'
              } flex items-center justify-center`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Added to Cart!
                </>
              ) : (
                'Add to Cart'
              )}
            </button>

            {/* Product Features */}
            <div className="border-t border-white/10 pt-8">
              <h4 className="text-white font-semibold mb-4">Product Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Premium cotton blend fabric</li>
                <li>• Luxury finishing and attention to detail</li>
                <li>• Comfortable fit for all-day wear</li>
                <li>• Exclusive design elements</li>
                <li>• Machine washable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Size Chart</h3>
              <button
                onClick={() => setShowSizeChart(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                ✕
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <img
                src="https://images.pexels.com/photos/5625120/pexels-photo-5625120.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                alt="Size Chart"
                className="w-full rounded"
              />
            </div>
            <p className="text-gray-400 text-sm mt-4 text-center">
              Measurements are in inches. For best fit, refer to the size chart above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;