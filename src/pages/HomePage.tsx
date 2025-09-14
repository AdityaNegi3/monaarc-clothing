// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const limitedProducts = products.filter((p) => p.category === 'limited');
  const [modalOpen, setModalOpen] = useState(false);
  const [showCookies, setShowCookies] = useState(false);

  // Best sellers
  const bestSellerIds = new Set<string>([
    'toji-wrath-white-tee',
    'project-yeager-black-tee',
  ]);

  // Price font style (regular, clean, no bold)
  const priceFont: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400, // regular
    fontSize: '1.1rem',
    color: '#1a1a1a',
  };

  useEffect(() => {
    document.documentElement.style.margin = '0';
    document.body.style.margin = '0';

    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) setShowCookies(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookies(false);
  };

  return (
    <div className="overflow-x-hidden bg-white text-black">
      {/* HERO */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center sm:bg-top"
        style={{
          backgroundImage: "url('/phonebg.webp')",
          filter: 'brightness(0.9)',
        }}
        aria-label="Hero"
      >
        {/* Desktop override */}
        <div
          className="hidden sm:block absolute inset-0 bg-cover bg-top"
          style={{
            backgroundImage: "url('/testbg.webp')",
            filter: 'brightness(0.8)',
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 sm:from-black/40 sm:via-black/20 sm:to-black/40" />

        <div className="relative z-10 text-center px-4">
          <h1
            className="mb-4 text-5xl sm:text-6xl md:text-8xl font-extrabold uppercase text-white select-none"
            style={{
              fontFamily: `'Cinzel', serif`,
              textShadow: '0 4px 12px rgba(0,0,0,0.7), 0 2px 6px rgba(255,255,255,0.4)',
              letterSpacing: '0.12em',
            }}
            aria-label="MONAARC"
          >
            MONAARC
          </h1>
          <div className="mx-auto mb-5 h-[2px] w-24 sm:w-28 bg-white rounded-full" />
          <p
            className="text-lg sm:text-xl md:text-2xl mb-6 font-light tracking-wide text-white"
            style={{
              textShadow: '0 2px 6px rgba(0,0,0,0.6), 0 1px 3px rgba(255,255,255,0.3)',
            }}
          >
            Wear strength. Own presence.
          </p>
          <div className="h-px w-20 sm:w-24 bg-white mx-auto mb-6" />
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-10 sm:h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* MAIN */}
      <main className="pt-16">
        <section id="anime-edition" className="py-20 relative bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-wide">
                ANIME Edition
              </h2>
              <div className="h-px w-32 bg-gray-200 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Worn like armor, carried like destiny — every stitch holds the spirit of a hero.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 overflow-x-hidden">
              {limitedProducts.map((product, i) => {
                const col = i % 3;
                const fromX = col === 0 ? -100 : col === 2 ? 100 : 0;
                const isBestSeller =
                  bestSellerIds.has(product.id) || product.tags?.includes('best-seller');

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
                      className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-500 md:hover:scale-105"
                    >
                      <div className="relative overflow-hidden">
                        {isBestSeller && (
                          <div
                            className="absolute top-0 inset-x-0 h-7 flex items-center justify-center z-10
                                        bg-gradient-to-r from-black via-gray-900 to-black
                                        text-white font-extrabold tracking-wide text-xs sm:text-sm uppercase
                                        shadow-md"
                          >
                            <span className="mr-1">⭐</span> Best Seller
                          </div>
                        )}
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
                        <h3 className="text-black font-semibold text-lg mb-2 group-hover:text-gray-900 transition-colors duration-300">
                          {product.name}
                        </h3>

                        {product.originalPrice ? (
                          <div className="text-lg" style={priceFont}>
                            <span className="text-gray-400 line-through mr-2">
                              Rs. {product.originalPrice}
                            </span>
                            <span className="text-black">Rs. {product.price}</span>
                          </div>
                        ) : (
                          <p className="text-lg text-black" style={priceFont}>
                            Rs. {product.price}
                          </p>
                        )}

                        <div className="flex items-center mt-4 text-gray-500 group-hover:text-black transition-colors duration-300">
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

        {/* Modal trigger */}
        <div className="text-center py-10 bg-white border-t border-gray-100">
          <button
            onClick={() => setModalOpen(true)}
            className="text-white bg-black hover:bg-gray-900 px-6 py-2 rounded-lg transition"
          >
            View MONAARC Edition
          </button>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white text-black p-8 rounded-lg max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-black text-xl"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
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
      </main>

      {/* Cookie Banner */}
      {showCookies && (
        <div
          className="fixed bottom-0 left-0 w-full sm:bottom-4 sm:left-4 sm:max-w-sm 
          bg-white shadow-lg rounded-t-xl sm:rounded-xl 
          p-4 z-40 flex flex-col sm:flex-row items-center sm:items-start 
          justify-between gap-3 animate-slide-up"
        >
          <p className="text-sm text-gray-800 text-center sm:text-left">
            We use cookies to improve your experience.
          </p>
          <button
            onClick={acceptCookies}
            className="bg-black hover:bg-gray-900 text-white font-semibold 
            px-4 py-2 rounded-lg transition w-full sm:w-auto"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
