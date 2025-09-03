import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const limitedProducts = products.filter((p) => p.category === 'limited');
  const gymProducts = products.filter((p) => p.category === 'gym');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="pt-16 overflow-x-hidden bg-black">
      {/* Hero Section */}
      <section
        className="
          relative h-screen flex items-center justify-center overflow-hidden 
          bg-cover bg-center sm:bg-top
        "
        style={{
          backgroundImage: "url('/bg69.jpg')", // default mobile background
        }}
      >
        {/* Desktop override background */}
        <div
          className="hidden sm:block absolute inset-0 bg-cover bg-top"
          style={{
            backgroundImage: "url('/bgbg12.png')", // desktop background
            filter: "brightness(0.8)", // 👈 custom brightness
          }}
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 sm:from-black/40 sm:via-black/20 sm:to-black/40" />

        <div className="relative z-10 text-center px-4">
          <h1
            className="
              mb-4
              text-5xl sm:text-6xl md:text-8xl font-extrabold 
              uppercase
              bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600
              bg-clip-text text-transparent
              select-none
            "
            style={{
              fontFamily: `'Cinzel', serif`,
              textShadow:
                '0 4px 12px rgba(0,0,0,0.7), 0 2px 6px rgba(255,215,0,0.4)',
              letterSpacing: '0.12em',
            }}
            aria-label="MONAARC"
          >
            MONAARC
          </h1>

          <div className="mx-auto mb-5 h-[2px] w-24 sm:w-28 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />

          {/* Quote in Rich Metallic Gold */}
          <p
            className="text-lg sm:text-xl md:text-2xl mb-6 font-light tracking-wide bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent"
            style={{
              textShadow:
                '0 2px 6px rgba(0,0,0,0.6), 0 1px 3px rgba(255,215,0,0.3)',
            }}
          >
            Wear strength. Own presence.
          </p>

          <div className="h-px w-20 sm:w-24 bg-yellow-400 mx-auto mb-6" />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-10 sm:h-12 bg-gradient-to-b from-yellow-400 to-transparent" />
        </div>
      </section>

      {/* Anime Section */}
      <section
        id="anime-edition"
        className="py-20 relative bg-black bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/file_0000000044c8622fb0caf79179595f70.png')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
              ANIME Edition
            </h2>
            <div className="h-px w-32 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Worn like armor, carried like destiny — every stitch holds the spirit of a hero.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 overflow-x-hidden">
            {limitedProducts.map((product, i) => {
              const col = i % 3;
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
                    className="group bg-black rounded-lg overflow-hidden border border-white/10 hover:border-yellow-400/30 transition-all duration-500 md:hover:transform md:hover:scale-105"
                  >
                    <div className="relative overflow-hidden">
                      {/* Back image first */}
                      <img
                        src={product.backImage}
                        alt={`${product.name} back`}
                        className="w-full object-contain transition-opacity duration-700 group-hover:opacity-0"
                      />
                      <img
                        src={product.frontImage}
                        alt={product.name}
                        className="w-full object-contain absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* ✅ Discount price logic */}
                      {product.originalPrice ? (
                        <div className="text-xl font-bold">
                          <span className="text-gray-400 line-through mr-2">
                            ₹{product.originalPrice}
                          </span>
                          <span className="text-yellow-400">
                            ₹{product.price}
                          </span>
                        </div>
                      ) : (
                        <p className="text-yellow-400 font-bold text-xl">
                          ₹{product.price}
                        </p>
                      )}

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

      {/* Modal */}
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
              The MONAARC Edition is coming soon. Stay tuned for the most
              exclusive drop of the year.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
