import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state, dispatch } = useCart();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* First Row - Logo centered */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-3 select-none">
            <img
              src="/monaarc-logo.png"
              alt="MONAARC logo"
              className="h-8 w-auto"
              draggable={false}
            />
            <span
              className="hidden sm:inline bg-gradient-to-b from-[#f5ca5f] to-[#9f681f] bg-clip-text text-transparent text-2xl font-black tracking-widest"
              style={{ fontFamily: 'serif' }}
            >
              MONAARC
            </span>
          </Link>
        </div>

        {/* Second Row - Links centered (desktop) */}
        <div className="hidden md:flex justify-center items-center space-x-8 mt-4">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">
            Home
          </Link>

          <div className="relative group">
            <button
              className="text-white hover:text-gray-300 transition-colors"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Collections
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block pt-2">
              <div className="w-52 bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
                <Link
                  to="/collections/anime"
                  className="block px-4 py-3 text-white hover:bg-gray-900 transition-colors"
                >
                  Anime Edition
                </Link>
                <Link
                  to="/collections/MONAARC"
                  className="block px-4 py-3 text-white hover:bg-gray-900 transition-colors"
                >
                  MONAARC Edition
                </Link>
              </div>
            </div>
          </div>

          <Link to="/new-arrivals" className="text-white hover:text-gray-300 transition-colors">
            New Arrivals
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300 transition-colors">
            About
          </Link>

          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">Hello, {currentUser.email}</span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/signup" className="text-white hover:text-gray-300 transition-colors">
              Signup
            </Link>
          )}

          <button
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            className="relative text-white hover:text-gray-300 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={24} />
            {state.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {state.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex justify-center mt-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 text-center">
            <Link
              to="/"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/collections/anime"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Anime Edition
            </Link>
            <Link
              to="/collections/MONAARC"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              MONAARC Edition
            </Link>

            <Link
              to="/new-arrivals"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {currentUser ? (
              <button
                onClick={async () => {
                  await handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-center px-3 py-2 text-white hover:bg-gray-900 rounded-md transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signup"
                className="block px-3 py-2 text-white hover:bg-gray-900 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Signup
              </Link>
            )}

            <button
              onClick={() => {
                dispatch({ type: 'TOGGLE_CART' });
                setIsMenuOpen(false);
              }}
              className="relative text-white hover:text-gray-300 transition-colors mt-2"
              aria-label="Open cart"
            >
              <ShoppingCart size={24} />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
