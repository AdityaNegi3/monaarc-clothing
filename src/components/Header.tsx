// src/components/Header.tsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const totalItems = getTotalItems();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSignatureClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-lg border-b border-white/10 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo Centered */}
        <div className="flex justify-center">
          <Link
            to="/"
            aria-label="Go to home"
            className="group inline-flex items-center justify-center rounded-full px-4 py-2 ring-1 ring-white/10 bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition
                       hover:bg-white/5 hover:ring-white/40"
          >
            <img
              src="/logo123.png"
              alt="MONAARC logo"
              loading="eager"
              className="h-10 md:h-12 w-auto select-none pointer-events-none
                         drop-shadow-[0_0_16px_rgba(255,255,255,0.22)]
                         transition-transform duration-300
                         group-hover:scale-105 group-hover:drop-shadow-[0_0_28px_rgba(255,255,255,0.35)]"
              style={{
                imageRendering: "auto",
                filter: "saturate(1.05) contrast(1.02)",
              }}
            />
          </Link>
        </div>

        {/* Cart LEFT, Nav CENTER, Auth RIGHT */}
        <div className="hidden md:flex items-center justify-between mt-4 relative">
          {/* LEFT: Cart */}
          <div className="w-1/3 flex items-center">
            <Link to="/cart" className="relative text-white hover:text-gray-300 transition-colors duration-200">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* CENTER: Navigation */}
          <div className="flex justify-center space-x-8 w-1/3 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="text-white hover:text-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400/50 rounded transition-colors duration-200"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                Collections
              </button>
              {dropdownOpen && (
                <div
                  className="absolute mt-2 w-48 bg-black/90 border border-white/10 rounded shadow-lg z-50"
                  role="menu"
                >
                  <a
                    href="/#anime-edition"
                    className="block px-4 py-2 hover:bg-gray-800 text-white text-sm"
                    role="menuitem"
                  >
                    Anime Edition
                  </a>
                  
                  <button
                    onClick={handleSignatureClick}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-white text-sm"
                    role="menuitem"
                  >
                    MONAARC Edition
                  </button>
                </div>
              )}
            </div>

            <Link to="/about" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">
              About
            </Link>
          </div>

          {/* RIGHT: Auth */}
          <div className="w-1/3 flex justify-end items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal" asChild afterSignInUrl="/" afterSignUpUrl="/">
                <button
                  type="button"
                  className="px-3 py-1 rounded-md border border-white text-white hover:bg-white hover:text-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>
        </div>

        {/* Mobile: Cart + Menu */}
        <div className="md:hidden flex justify-between items-center mt-4">
          <Link to="/cart" className="relative text-white hover:text-gray-300 transition-colors duration-200">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400/50 rounded transition-colors duration-200"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden mt-2 bg-black/95 backdrop-blur-md border-b border-white/10 rounded-b-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:text-gray-300 transition-colors duration-200"
              >
                Home
              </Link>
              <a
                href="/#anime-edition"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:text-gray-300 transition-colors duration-200"
              >
                Anime Edition
              </a>
            
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignatureClick();
                }}
                className="block w-full text-left px-3 py-2 text-white hover:text-gray-300 transition-colors duration-200"
              >
                MONAARC Edition
              </button>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:text-gray-300 transition-colors duration-200"
              >
                About
              </Link>

              {/* Mobile Auth */}
              <SignedOut>
                <SignInButton mode="modal" asChild afterSignInUrl="/" afterSignUpUrl="/">
                  <button className="block w-full text-left px-3 py-2 text-white border border-white rounded-md hover:bg-white hover:text-black transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="px-3 py-2">
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                </div>
              </SignedIn>
            </div>
          </div>
        )}

        {/* Coming Soon Toast */}
        {showComingSoon && (
          <div className="fixed bottom-5 right-5 bg-white text-black px-4 py-2 rounded shadow-lg z-50">
            Coming Soon!
            <button
              onClick={() => setShowComingSoon(false)}
              className="ml-4 font-bold focus:outline-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
