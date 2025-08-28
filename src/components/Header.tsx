// src/components/Header.tsx
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,               // ⬅️ fallback visibility while Clerk loads
} from "@clerk/clerk-react";

const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  // Hover-intent to prevent dropdown flicker
  const hoverTimer = useRef<number | null>(null);
  const openCollections = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setCollectionsOpen(true);
  };
  const closeCollections = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setCollectionsOpen(false), 150);
  };

  // Clerk loading state (for showing fallback links immediately)
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ROW 1: Centered logo only */}
        <div className="flex justify-center items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="MONAARC Logo" className="h-10 w-auto object-contain" />
            <span className="hidden md:block text-2xl font-serif font-bold text-white tracking-wide">
              MONAARC
            </span>
          </Link>
        </div>

        {/* ROW 2 (Desktop): Cart (left) | Nav (center) | Auth (right) */}
        <div className="hidden md:grid grid-cols-3 items-center h-12">
          {/* Left: Cart */}
          <div className="flex items-center">
            <Link
              to="/cart"
              className="relative text-white hover:text-yellow-400 transition-colors duration-300"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Center: Navigation with dropdown */}
          <nav className="flex justify-center items-center space-x-10">
            <Link to="/" className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium">
              Home
            </Link>

            {/* Collections */}
            <div
              className="relative"
              onMouseEnter={openCollections}
              onMouseLeave={closeCollections}
              onFocus={openCollections}
              onBlur={(e) => {
                const container = e.currentTarget as HTMLElement;
                const next = (e.relatedTarget as Node) || null;
                if (!next || !container.contains(next)) setCollectionsOpen(false);
              }}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
                aria-haspopup="menu"
                aria-expanded={collectionsOpen}
                aria-controls="collections-menu"
              >
                Collections <ChevronDown className="w-4 h-4" />
              </button>

              {collectionsOpen && (
                <div
                  id="collections-menu"
                  role="menu"
                  className="absolute left-1/2 -translate-x-1/2 top-full w-56 pt-3"
                >
                  {/* invisible padding bridge to prevent hover gap */}
                  <div className="absolute -top-2 left-0 right-0 h-2" />
                  <div className="rounded-2xl bg-black/95 backdrop-blur ring-1 ring-white/10 shadow-xl p-2 pointer-events-auto">
                    <Link
                      to="/#anime"
                      className="block px-3 py-2 rounded-lg text-white/90 hover:text-black hover:bg-yellow-400 transition"
                      role="menuitem"
                    >
                      Anime Edition
                    </Link>
                    <Link
                      to="/#gym"
                      className="block px-3 py-2 rounded-lg text-white/90 hover:text-black hover:bg-yellow-400 transition"
                      role="menuitem"
                    >
                      Gym Edition
                    </Link>
                    <span
                      className="block px-3 py-2 rounded-lg text-gray-500 cursor-not-allowed select-none"
                      role="menuitem"
                      aria-disabled="true"
                      title="Coming soon"
                    >
                      MONAARC Edition (Coming Soon)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Link to="/new-arrivals" className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium">
              New Arrivals
            </Link>
            <Link to="/about" className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium">
              About
            </Link>
          </nav>

          {/* Right: Auth (Clerk) with fallbacks */}
          <div className="flex justify-end gap-3">
            {!isLoaded ? (
              // Fallback links while Clerk bootstraps (prevents "options vanished")
              <>
                <Link
                  to="/sign-in"
                  className="px-4 py-2 rounded-full border border-white/20 text-white hover:text-black hover:bg-yellow-400 hover:border-yellow-400 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-4 py-2 rounded-full bg-white text-black hover:bg-yellow-400 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="redirect" signUpUrl="/sign-up">
                  <button className="px-4 py-2 rounded-full border border-white/20 text-white hover:text-black hover:bg-yellow-400 hover:border-yellow-400 transition">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect" signInUrl="/sign-in">
                  <button className="px-4 py-2 rounded-full bg-white text-black hover:bg-yellow-400 transition">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>

        {/* MOBILE: row with burger + cart */}
        <div className="md:hidden flex items-center justify-between py-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-yellow-400 transition-colors duration-300"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link
            to="/cart"
            className="relative text-white hover:text-yellow-400 transition-colors duration-300"
            aria-label="Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE: collapsible menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
            <div className="px-3 py-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-white hover:text-yellow-400 transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Collections */}
              <details className="px-3 py-2 border border-white/10 rounded-lg text-white">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span>Collections</span>
                  <ChevronDown className="w-4 h-4" />
                </summary>
                <div className="mt-2 space-y-1">
                  <Link
                    to="/#anime"
                    className="block px-2 py-2 text-white/90 hover:text-yellow-400 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Anime Edition
                  </Link>
                  <Link
                    to="/#gym"
                    className="block px-2 py-2 text-white/90 hover:text-yellow-400 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gym Edition
                  </Link>
                  <span className="block px-2 py-2 text-gray-500 cursor-not-allowed select-none" aria-disabled="true">
                    MONAARC Edition (Coming Soon)
                  </span>
                </div>
              </details>

              <Link
                to="/new-arrivals"
                className="block px-3 py-2 text-white hover:text-yellow-400 transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-white hover:text-yellow-400 transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile auth with fallback */}
              {!isLoaded ? (
                <>
                  <Link
                    to="/sign-in"
                    className="block mt-2 text-center px-4 py-2 rounded-full border border-white/20 text-white hover:text-black hover:bg-yellow-400 hover:border-yellow-400 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block mt-2 text-center px-4 py-2 rounded-full bg-white text-black hover:bg-yellow-400 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <SignedOut>
                    <SignInButton mode="redirect" signUpUrl="/sign-up">
                      <button
                        className="w-full mt-2 text-center px-4 py-2 rounded-full border border-white/20 text-white hover:text-black hover:bg-yellow-400 hover:border-yellow-400 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="redirect" signInUrl="/sign-in">
                      <button
                        className="w-full mt-2 text-center px-4 py-2 rounded-full bg-white text-black hover:bg-yellow-400 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="px-3">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
