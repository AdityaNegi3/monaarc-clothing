// src/components/Header.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // handle scroll to toggle header background
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 20; // change threshold if you want
      setIsScrolled(scrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // dynamic styles depending on scroll state
  const headerBgClass = isScrolled ? "bg-white text-black border-b shadow-sm" : "bg-transparent text-white";
  const navLinkBase = "font-medium transition-colors duration-200";
  const navLinkColor = isScrolled ? "hover:text-gray-700 text-black/90" : "hover:text-gray-300 text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${headerBgClass}`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop / Tablet */}
        <div className="hidden md:grid grid-cols-3 items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              aria-label="MONAARC home"
              className={`text-lg md:text-xl font-bold tracking-wide ${isScrolled ? "text-black" : "text-white"}`}
            >
              MONAARC
            </Link>
          </div>

          {/* Center: Nav */}
          <nav className="flex items-center justify-center space-x-8" aria-label="Primary navigation">
            <Link to="/" className={`${navLinkBase} ${navLinkColor}`}>
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`${navLinkBase} ${navLinkColor} focus:outline-none`}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((v) => !v)}
              >
                Collections
              </button>

              {dropdownOpen && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 mt-3 w-48 rounded shadow-lg z-50 ${isScrolled ? "bg-white border" : "bg-black/90 border border-white/10"}`}
                  role="menu"
                >
                  <a
                    href="/#anime-edition"
                    className={`block px-4 py-2 text-sm ${isScrolled ? "text-black hover:bg-gray-100" : "text-white hover:bg-gray-800"}`}
                    role="menuitem"
                  >
                    Anime Edition
                  </a>

                  <button
                    onClick={handleSignatureClick}
                    className={`block w-full text-left px-4 py-2 text-sm ${isScrolled ? "text-black hover:bg-gray-100" : "text-white hover:bg-gray-800"}`}
                    role="menuitem"
                  >
                    MONAARC Edition
                  </button>
                </div>
              )}
            </div>

            <Link to="/about" className={`${navLinkBase} ${navLinkColor}`}>
              About
            </Link>
          </nav>

          {/* Right: Auth + Cart */}
          <div className="flex items-center justify-end space-x-3">
            <SignedOut>
              <SignInButton mode="modal" asChild afterSignInUrl="/" afterSignUpUrl="/">
                <button
                  type="button"
                  className={`${isScrolled ? "border border-black text-black hover:bg-black/5" : "border border-white text-white hover:bg-white hover:text-black"} px-3 py-1 rounded-md transition`}
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} afterSignOutUrl="/" />
            </SignedIn>

            <Link to="/cart" className={`relative ${isScrolled ? "text-black" : "text-white"} hover:opacity-80 transition`}>
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between h-16">
          {/* Left: Brand */}
          <Link to="/" aria-label="MONAARC home" className={`text-lg font-bold ${isScrolled ? "text-black" : "text-white"}`}>
            MONAARC
          </Link>

          {/* Right: cart + menu */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className={`relative ${isScrolled ? "text-black" : "text-white"} hover:opacity-80 transition`}>
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className={`${isScrolled ? "text-black" : "text-white"} focus:outline-none`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className={`md:hidden mt-2 rounded-b-lg ${isScrolled ? "bg-white border-t border-gray-200 text-black" : "bg-black/95 text-white border-t border-white/10"} shadow-lg`}
          >
            <div className="px-4 py-3 space-y-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-2 py-2">
                Home
              </Link>

              <a href="/#anime-edition" onClick={() => setIsMenuOpen(false)} className="block px-2 py-2">
                Anime Edition
              </a>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignatureClick();
                }}
                className="block w-full text-left px-2 py-2"
              >
                MONAARC Edition
              </button>

              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-2 py-2">
                About
              </Link>

              <div className="pt-2 border-t border-white/10">
                <SignedOut>
                  <SignInButton mode="modal" asChild afterSignInUrl="/" afterSignUpUrl="/">
                    <button className={`w-full text-left px-2 py-2 rounded-md ${isScrolled ? "border border-black text-black" : "border border-white text-white"}`}>
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <div className="px-2 py-2">
                    <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                  </div>
                </SignedIn>
              </div>
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
