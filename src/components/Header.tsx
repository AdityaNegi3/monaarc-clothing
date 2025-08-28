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
} from "@clerk/clerk-react";

const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const hoverTimer = useRef<number | null>(null);
  const openCollections = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setCollectionsOpen(true);
  };
  const closeCollections = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setCollectionsOpen(false), 120);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* === ROW 1: Centered Logo === */}
        <div className="flex justify-center items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="MONAARC Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="hidden md:block text-2xl font-serif font-bold text-white tracking-wide">
              MONAARC
            </span>
          </Link>
        </div>

        {/* === ROW 2: Cart | Nav | Auth === */}
        <div className="hidden md:grid grid-cols-3 items-center h-14">
          {/* Left: Cart */}
          <div className="flex items-center">
            <Link
              to="/cart"
              className="relative text-white hover:text-yellow-400 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Center: Nav */}
          <nav className="flex justify-center items-center gap-10">
            <Link to="/" className="text-white hover:text-yellow-400 font-medium">
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={openCollections}
              onMouseLeave={closeCollections}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 text-white hover:text-yellow-400 font-medium"
              >
                Collections <ChevronDown className="w-4 h-4" />
              </button>
              {collectionsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 rounded-xl bg-black/90 ring-1 ring-white/10 shadow-lg p-2">
                  <Link
                    to="/#anime"
                    className="block px-3 py-2 rounded-lg text-white/90 hover:bg-white/10"
                  >
                    Anime Edition
                  </Link>
                  <Link
                    to="/#gym"
                    className="block px-3 py-2 rounded-lg text-white/90 hover:bg-white/10"
                  >
                    Gym Edition
                  </Link>
                  <span className="block px-3 py-2 rounded-lg text-gray-500 select-none">
                    MONAARC Edition (Coming Soon)
                  </span>
                </div>
              )}
            </div>

            <Link
              to="/new-arrivals"
              className="text-white hover:text-yellow-400 font-medium"
            >
              New Arrivals
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-yellow-400 font-medium"
            >
              About
            </Link>
          </nav>

          {/* Right: Auth */}
          <div className="flex justify-end items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/sign-up">
                <button className="px-4 py-1 rounded-md border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-sm">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" afterSignUpUrl="/" signInUrl="/sign-in">
                <button className="px-4 py-1 rounded-md bg-yellow-400 text-black hover:opacity-90 text-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>

      {/* MOBILE: Single row with burger + cart */}
      <div className="md:hidden flex items-center justify-between px-6 py-3 border-t border-white/10">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-yellow-400"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link
          to="/cart"
          className="relative text-white hover:text-yellow-400"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
