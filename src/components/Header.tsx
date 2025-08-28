// src/components/Header.tsx
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

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
      <div className="max-w-7xl mx-auto w-full">
        {/* Row 1: centered logo (desktop) */}
        <div className="hidden md:flex justify-center items-center h-16 px-6">
          <Link to="/" className="flex items-center gap-3" aria-label="Go to homepage">
            <img src="/logo.png" alt="MONAARC Logo" className="h-10 w-auto" />
            <span className="text-2xl font-serif font-extrabold tracking-wide">MONAARC</span>
          </Link>
        </div>

        {/* Row 2: left cart | center nav | right auth (desktop) */}
        <div className="hidden md:grid grid-cols-3 items-center h-14 px-6">
          {/* Left: Cart */}
          <div className="flex items-center">
            <Link to="/cart" className="relative hover:text-yellow-400 transition" aria-label="Cart">
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
            <Link to="/" className="hover:text-yellow-400 font-medium">Home</Link>

            <div
              className="relative"
              onMouseEnter={openCollections}
              onMouseLeave={closeCollections}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-yellow-400 font-medium px-1"
                aria-haspopup="menu"
                aria-expanded={collectionsOpen}
              >
                Collections <ChevronDown className="w-4 h-4" />
              </button>

              {collectionsOpen && (
                <div role="menu" className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 rounded-xl bg-black/90 ring-1 ring-white/10 shadow-lg p-2">
                  <Link to="/#anime" className="block px-3 py-2 rounded-lg text-white/90 hover:bg-white/10" role="menuitem">
                    Anime Edition
                  </Link>
                  <Link to="/#gym" className="block px-3 py-2 rounded-lg text-white/90 hover:bg-white/10" role="menuitem">
                    Gym Edition
                  </Link>
                  <span className="block px-3 py-2 rounded-lg text-gray-500 select-none" role="menuitem">
                    MONAARC Edition (Coming Soon)
                  </span>
                </div>
              )}
            </div>

            <Link to="/new-arrivals" className="hover:text-yellow-400 font-medium">New Arrivals</Link>
            <Link to="/about" className="hover:text-yellow-400 font-medium">About</Link>
          </nav>

          {/* Right: Auth */}
          <div className="flex justify-end items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal" signUpUrl="/sign-up" afterSignInUrl="/">
                <button className="px-4 py-1 rounded-md border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-sm">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {/* Shows avatar/profile pic with dropdown */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Mobile bar */}
        <div className="md:hidden flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setIsMenuOpen(v => !v)}
            className="hover:text-yellow-400 p-1"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2" aria-label="Go to homepage">
            <img src="/logo.png" alt="MONAARC Logo" className="h-7 w-auto" />
            <span className="text-lg font-serif font-extrabold tracking-wide">MONAARC</span>
          </Link>

          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal" signUpUrl="/sign-up" afterSignInUrl="/">
                <button className="px-2.5 py-1 rounded-md border border-yellow-400 text-[13px] text-yellow-400 hover:bg-yellow-400 hover:text-black">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Mobile drawer */}
        {isMenuOpen && (
          <div className="md:hidden px-4 pb-3 pt-2 bg-black/85 backdrop-blur border-t border-white/10">
            <nav className="space-y-1">
              <Link to="/" className="block px-2 py-2 hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <details className="px-2 py-2 border border-white/10 rounded-lg">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span>Collections</span>
                  <ChevronDown className="w-4 h-4" />
                </summary>
                <div className="mt-2 space-y-1">
                  <Link to="/#anime" className="block px-2 py-2 text-white/90 hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>
                    Anime Edition
                  </Link>
                  <Link to="/#gym" className="block px-2 py-2 text-white/90 hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>
                    Gym Edition
                  </Link>
                  <span className="block px-2 py-2 text-gray-500 select-none">MONAARC Edition (Coming Soon)</span>
                </div>
              </details>
              <Link to="/new-arrivals" className="block px-2 py-2 hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>
                New Arrivals
              </Link>
              <Link to="/about" className="block px-2 py-2 hover:text-yellow-400" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
