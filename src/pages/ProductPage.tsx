import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find(p => p.id === id);
  if (!product) return <Navigate to="/" replace />;

  // Example size options
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Assume product.images is an array of 4 images [front, side, back, angle]
  const images = product.images || [product.frontImage, product.backImage];

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    navigate('/cart');
  };

  return (
    <div className="bg-white min-h-screen text-black">
      {/* ✅ Added mt-20 so content starts below navbar */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
        
        {/* LEFT: Thumbnails + Main Image */}
        <div className="flex">
          {/* Thumbnails */}
          <div className="flex flex-col space-y-4 mr-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-28 border rounded overflow-hidden ${
                  selectedImage === idx ? 'border-black' : 'border-gray-300'
                }`}
              >
                <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-[600px] object-cover rounded"
            />
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

          {/* Size Dropdown */}
          <div>
            <label className="block mb-2 font-medium">SIZE</label>
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

          {/* Share */}
          
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
