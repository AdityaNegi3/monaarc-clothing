import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { products } from '../data/products';
import { Product } from '../types';

interface CollectionsProps {
  onBuyNow: (product: Product, size: string) => void;
}

const Collections: React.FC<CollectionsProps> = ({ onBuyNow }) => {
  const { edition } = useParams<{ edition: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => p.edition === edition);
  const title = edition === 'anime' ? 'ANIME EDITION' : 'MONAARC EDITION';

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-16 tracking-wide">
          {title}
        </h1>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No products found in this collection.</p>
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={onBuyNow}
      />
    </div>
  );
};

export default Collections;