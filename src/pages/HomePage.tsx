import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // ✅ Added

const HomePage: React.FC = () => {
  const limitedProducts = products.filter((p) => p.category === 'limited');
  const darkProducts = products.filter((p) => p.category === 'dark');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="pt-16 overflow-x-hidden bg-black"> {/* ✅ Prevents horizontal scroll */}
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden hero-background">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-wider luxury-float">
            MONAARC
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light tracking-wide">
            Where Luxury Meets Legacy
          </p>
          <div className="h-px w-24 bg-yellow-400 mx-auto mb-8"></div>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed luxury-glow">
            Discover the epitome of luxury fashion. Each piece crafted with precision, 
            designed for those who understand that true elegance is timeless.
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-yellow-400 to-transparent"></div>
        </div>
      </section>

      {/* Chaos (Limited) Edition */}
      <section
        id="f1-edition"
        className="py-20 relative bg-black bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/file_0000000044c8622fb0caf79179595f70.png')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
              ANIME  Edition
            </h2>
            <div className="h-px w-32 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              No rules. No repeats. Just pure chaos.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 overflow-x-hidden"> {/* ✅ Fixed */}
            {limitedProducts.map((product, i) => {
              const col = i % 3; // detect column
              const fromX = col === 0 ? -100 : col === 2 ? 100 : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: fromX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="group bg-black rounded-lg overflow-hidden border border-white/10 hover:border-yellow-400/30 transition-all duration-500 md:hover:transform md:hover:scale-105" // ✅ Only on desktop
                  >
                    <div className="relative overflow-hidden">
                      {/* Front */}
                      <img
                        src={product.frontImage}
                        alt={product.name}
                        className="w-full object-contain transition-opacity duration-700 group-hover:opacity-0"
                      />
                      {/* Back */}
                      <img
                        src={product.backImage}
                        alt={`${product.name} back`}
                        className="w-full object-contain absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GYM Edition */}
      <section
        id="dark-edition"
        className="py-20 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/dark-bg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
              GYM Edition
            </h2>
            <div className="h-px w-32 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Embrace the shadows. Where mystery meets elegance in perfect harmony.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-x-hidden"> {/* ✅ Fixed */}
            {darkProducts.map((product, i) => {
              const col = i % 4;
              const fromX = col === 0 ? -100 : col === 3 ? 100 : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: fromX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="group bg-black rounded-lg overflow-hidden border border-white/10 hover:border-yellow-400/30 transition-all duration-500 md:hover:transform md:hover:scale-105" // ✅ Only on desktop
                  >
                    <div className="relative overflow-hidden">
                      {/* Front */}
                      <img
                        src={product.frontImage}
                        alt={product.name}
                        className="w-full object-contain transition-opacity duration-700 group-hover:opacity-0"
                      />
                      {/* Back */}
                      <img
                        src={product.backImage}
                        alt={`${product.name} back`}
                        className="w-full object-contain absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MONAARC Edition Modal Trigger */}
      <div className="text-center py-10">
        <button
          onClick={() => setModalOpen(true)}
          className="text-white bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg transition"
        >
          View MONAARC Edition
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-black text-xl"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">MONAARC Edition</h2>
            <p className="text-gray-700">
              The MONAARC Edition is coming soon. Stay tuned for the most exclusive drop of the year.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
