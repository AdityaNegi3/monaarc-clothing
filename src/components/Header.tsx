// src/components/Header.tsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
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
        {/* Line 1: Logo Centered */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors duration-300"
          >
            OSIRIS
          </Link>
        </div>

        {/* Line 2: Cart LEFT, Nav CENTER, Auth RIGHT */}
        <div className="hidden md:flex items-center justify-between mt-4 relative">
          {/* LEFT: Cart */}
          <div className="w-1/3 flex items-center">
            <Link to="/cart" className="relative text-white hover:text-yellow-400">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* CENTER: Navigation */}
          <div className="flex justify-center space-x-8 w-1/3 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-white hover:text-yellow-400 font-medium">
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="text-white hover:text-yellow-400 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded"
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
                    href="/#f1-edition"
                    className="block px-4 py-2 hover:bg-gray-800 text-white text-sm"
                    role="menuitem"
                  >
                    Chaos Edition
                  </a>
                  <a
                    href="/#dark-edition"
                    className="block px-4 py-2 hover:bg-gray-800 text-white text-sm"
                    role="menuitem"
                  >
                    Dark Edition
                  </a>
                  <button
                    onClick={handleSignatureClick}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-white text-sm"
                    role="menuitem"
                  >
                    Signature Edition
                  </button>
                </div>
              )}
            </div>

            <Link to="/about" className="text-white hover:text-yellow-400 font-medium">
              About
            </Link>
          </div>

          {/* RIGHT: Auth (Clerk) */}
          <div className="w-1/3 flex justify-end items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal" asChild afterSignInUrl="/" afterSignUpUrl="/">
                <button
                  type="button"
                  className="px-3 py-1 rounded-md border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
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

        {/* Mobile: Cart (left) + Menu (right) */}
        <div className="md:hidden flex justify-between items-center mt-4">
          <Link to="/cart" className="relative text-white hover:text-yellow-400">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded"
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
                className="block px-3 py-2 text-white hover:text-yellow-400"
              >
                Home
              </Link>
              <a
                href="/#f1-edition"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:text-yellow-400"
              >
                Chaos Edition
              </a>
              <a
                href="/#dark-edition"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:text-yellow-400"
              >
                Dark Edition
              </a>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignatureClick();
                }}
                className="block w-full text-left px-3 py-2 text-white hover:text-yellow-400"
              >
                Signature Edition
              </button>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-white hover:text-yellow-400"
              >
                About
              </Link>

              {/* Mobile Auth (Clerk) */}
              <SignedOut>
                <SignInButton mode="modal" asChild afterSignInUrl="/" afterSignUpUrl="/">
                  <button className="block w-full text-left px-3 py-2 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-md">
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
          <div className="fixed bottom-5 right-5 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg z-50">
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
