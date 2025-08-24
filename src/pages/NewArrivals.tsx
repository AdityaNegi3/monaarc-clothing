import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { products } from '../data/products';
import { Product } from '../types';

interface NewArrivalsProps {
  onBuyNow: (product: Product, size: string) => void;
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ onBuyNow }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Show the last 4 products as "new arrivals"
  const newProducts = products.slice(-4);

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 tracking-wide">
          NEW ARRIVALS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {newProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={setSelectedProduct}
            />
          ))}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={onBuyNow}
      />
    </div>
  );
};

export default NewArrivals;