import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const [showBack, setShowBack] = useState(false);

  return (
    <div 
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
      onMouseEnter={() => setShowBack(true)}
      onMouseLeave={() => setShowBack(false)}
      onClick={() => onOpenModal(product)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={showBack ? product.images.back : product.images.front}
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300" />
      </div>
      
      <div className="p-4">
        <h3 className="text-white text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-white text-xl font-bold">₹{product.price}</span>
          <span className="text-gray-500 text-sm uppercase tracking-wide">
            {product.edition} Edition
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;