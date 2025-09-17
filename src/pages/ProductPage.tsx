import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const product = products.find((p) => p.id === id);
  if (!product) return <Navigate to="/" replace />;

  // Example size options
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Assume product.images is an array of images; fallback to front/back
  const images = product.images || [product.frontImage, product.backImage];

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    navigate('/cart');
  };

  // Close size guide on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSizeGuide(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = showSizeGuide ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSizeGuide]);

  return (
    <div className="bg-white min-h-screen text-black">
      {/* ✅ Added mt-20 so content starts below navbar */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
        {/* LEFT: Images Section */}
        <div className="flex flex-col lg:flex-row">
          {/* Main Image */}
          <div className="flex-1">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-[500px] lg:h-[600px] object-cover rounded"
            />
          </div>

          {/* Thumbnails (below on mobile, left on desktop) */}
          <div className="flex lg:flex-col mt-4 lg:mt-0 lg:ml-4 space-x-2 lg:space-x-0 lg:space-y-4 overflow-x-auto lg:overflow-visible">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-28 flex-shrink-0 border rounded overflow-hidden ${
                  selectedImage === idx ? 'border-black' : 'border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${idx}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Details */}
        <div className="flex flex-col space-y-6">
          {/* Title + Price */}
          <div>
            <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
            <p className="text-xl font-medium">Rs. {product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Shipping calculated at checkout.</p>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Size Dropdown + Guide */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-medium">SIZE</label>

              {/* Size guide trigger */}
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-sm underline underline-offset-2"
                aria-haspopup="dialog"
                aria-expanded={showSizeGuide}
              >
                Size guide
              </button>
            </div>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Quick visual: show chosen size and a small hint */}
            <p className="text-sm text-gray-500 mt-2">Selected: {selectedSize} — chest approx. {getChestApprox(selectedSize)} cm</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition"
            >
              Add to cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-3 border border-black font-medium rounded hover:bg-black hover:text-white transition"
            >
              Buy it now
            </button>
          </div>
        </div>
      </div>

      {/* Size Guide Modal - uses /size.jpg from public folder */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Size guide dialog"
          onClick={() => setShowSizeGuide(false)}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* modal content - stop propagation so clicks inside don't close */}
          <div
            className="relative max-w-3xl w-full bg-white rounded shadow-lg p-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Size guide</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                aria-label="Close size guide"
                className="text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Replace the src with the path where you put the image inside public/ */}
            <div className="overflow-auto max-h-[70vh]">
              <img src="/size.jpg" alt="Size guide" className="w-full h-auto rounded" />

              {/* Optional textual table fallback for quick reference */}
              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">Size</th>
                      <th className="text-left pb-2">Chest (cm)</th>
                      <th className="text-left pb-2">Waist (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>XS</td>
                      <td>78 - 82</td>
                      <td>64 - 68</td>
                    </tr>
                    <tr>
                      <td>S</td>
                      <td>86 - 90</td>
                      <td>70 - 74</td>
                    </tr>
                    <tr>
                      <td>M</td>
                      <td>94 - 98</td>
                      <td>78 - 82</td>
                    </tr>
                    <tr>
                      <td>L</td>
                      <td>102 - 106</td>
                      <td>86 - 90</td>
                    </tr>
                    <tr>
                      <td>XL</td>
                      <td>110 - 114</td>
                      <td>94 - 98</td>
                    </tr>
                    <tr>
                      <td>XXL</td>
                      <td>118 - 122</td>
                      <td>102 - 106</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// small helper to return an approximate chest measurement for the selected size
function getChestApprox(size: string) {
  switch (size) {
    case 'XS':
      return 80;
    case 'S':
      return 88;
    case 'M':
      return 96;
    case 'L':
      return 104;
    case 'XL':
      return 112;
    case 'XXL':
      return 120;
    default:
      return '-';
  }
}

export default ProductPage;
