import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { SignedOut, SignUpButton } from '@clerk/clerk-react';

// ✅ Import your custom font
import '../index.css';

const HomePage: React.FC = () => {
  const limitedProducts = products.filter(p => p.category === 'limited');
  const darkProducts = products.filter(p => p.category === 'dark');

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section
        className="relative h-screen w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/backg.png')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* ✅ Centered MONAARC */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1
            className="text-6xl md:text-8xl font-bold text-white tracking-wider"
            style={{ fontFamily: 'MONAARC, serif' }}
          >
            MONAARC
          </h1>

          <SignedOut>
            <div className="mt-10 flex items-center justify-center">
              <SignUpButton mode="modal">
                <button className="px-6 py-2 rounded-full border border-white/20 text-white hover:text-black hover:bg-yellow-400 hover:border-yellow-400 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-yellow-400 to-transparent"></div>
        </div>
      </section>

      {/* ANIME Edition */}
      <section id="anime" className="py-20 relative bg-black scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
              ANIME EDITION
            </h2>
            <div className="h-px w-32 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Exclusive pieces for the discerning individual. Limited quantities, unlimited sophistication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {limitedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-gray-900/50 rounded-lg overflow-hidden border border-white/10 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105"
              >
                {/* ✅ Hover image swap */}
                <div className="relative w-full h-80 overflow-hidden">
                  {/* Front image */}
                  <img
                    src={product.frontImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                  />
                  {/* Back image */}
                  <img
                    src={product.backImage}
                    alt={`${product.name} back`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-yellow-400 font-bold text-xl">₹{product.price}</p>
                  <div className="flex items-center mt-4 text-gray-400 group-hover:text-white transition-colors duration-300">
                    <span className="text-sm">View Details</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GYM Edition */}
      <section id="gym" className="py-20 relative scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
              GYM EDITION
            </h2>
            <div className="h-px w-32 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Engineered for Strength
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {darkProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-gray-900/50 rounded-lg overflow-hidden border border-white/10 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105"
              >
                {/* ✅ Hover image swap */}
                <div className="relative w-full h-80 overflow-hidden">
                  {/* Front image */}
                  <img
                    src={product.frontImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
                  />
                  {/* Back image */}
                  <img
                    src={product.backImage}
                    alt={`${product.name} back`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-yellow-400 font-bold text-xl">₹{product.price}</p>
                  <div className="flex items-center mt-4 text-gray-400 group-hover:text-white transition-colors duration-300">
                    <span className="text-sm">View Details</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
