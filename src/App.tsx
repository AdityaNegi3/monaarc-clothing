// src/App.tsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

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

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />

        {/* keep padding-top to clear sticky 2-row desktop header */}
        <main className="flex-1 pt-14 md:pt-[7.5rem]">
          <ScrollToHash />

          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/thank-you" element={<ThankYou />} />

            {/* OPTIONAL: public checkout (no protection) */}
            <Route path="/checkout" element={<div className="p-8">Checkout (public)</div>} />

            {/* CLERK AUTH ROUTES (React Router v6) */}
            <Route
              path="/sign-in/*"
              element={
                <SignIn
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  afterSignInUrl="/"
                />
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  afterSignUpUrl="/"
                />
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
