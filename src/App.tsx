// src/App.tsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ThankYou from "./pages/ThankYou";

function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);
  return null;
}

// Example protected wrapper (use for pages like /checkout if needed)
function CheckoutGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <main className="flex-1 pt-16">
          <ScrollToHash />
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/thank-you" element={<ThankYou />} />

            {/* CLERK AUTH ROUTES (must include /* and routing="path") */}
            <Route
              path="/sign-in/*"
              element={
                <SignIn
                  routing="path"
                  afterSignInUrl="/"
                  signUpUrl="/sign-up"
                />
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <SignUp
                  routing="path"
                  afterSignUpUrl="/"
                  signInUrl="/sign-in"
                />
              }
            />

            {/* OPTIONAL: PROTECTED ROUTE EXAMPLE */}
            <Route
              path="/checkout"
              element={
                <CheckoutGuard>
                  <div className="p-8">Checkout (protected)</div>
                </CheckoutGuard>
              }
            />

            {/* 404 → home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
