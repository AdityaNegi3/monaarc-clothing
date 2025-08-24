import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { products } from '../data/products';
import { Product } from '../types';

interface HomeProps {
  onBuyNow: (product: Product, size: string) => void;
}

const Home: React.FC<HomeProps> = ({ onBuyNow }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const animeProducts = products.filter(p => p.edition === 'anime');
  const MONAARCProducts = products.filter(p => p.edition === 'MONAARC');

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with bg.png */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative text-center">
          <h1
            className="text-6xl md:text-8xl font-black text-white mb-6 tracking-widest"
            style={{ fontFamily: 'serif' }}
          >
            MONAARC
          </h1>
          <p className="text-2xl md:text-3xl text-white font-light tracking-wide">
            Where Power Meets Elegance
          </p>
        </div>
      </section>

      {/* Anime Edition */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6 tracking-wide">
            ANIME EDITION
          </h2>
          <p className="text-lg text-gray-400 text-center mb-16 font-light italic">
            "Embrace the darkness within, channel your inner warrior"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {animeProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MONAARC Edition */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6 tracking-wide">
            MONAARC EDITION
          </h2>
          <p className="text-lg text-gray-400 text-center mb-16 font-light italic">
            "Rule with quiet confidence, command with silent strength"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MONAARCProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <a
              href="mailto:contact@MONAARC.com"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              contact@MONAARC.com
            </a>
            <a
              href="https://instagram.com/MONAARC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              @MONAARC
            </a>
          </div>
          <p className="text-gray-600 text-xs">
            © 2025 MONAARC. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={onBuyNow}
      />
    </div>
  );
};

export default Home;
