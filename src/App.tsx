import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Collections from './pages/Collections';
import NewArrivals from './pages/NewArrivals';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import { Product } from './types';

function AppInner() {
  // build stamp to verify fresh bundle is loaded
  useEffect(() => {
    console.log('App build stamp:', 'v3-OrderFlow-OK');
  }, []);

  const [orderForm, setOrderForm] = useState<{
    isOpen: boolean;
    product: Product | null;
    selectedSize: string;
    isCartCheckout: boolean;
  }>({
    isOpen: false,
    product: null,
    selectedSize: '',
    isCartCheckout: false,
  });

  const handleBuyNow = useCallback((product: Product, size: string) => {
    setOrderForm({
      isOpen: true,
      product,
      selectedSize: size,
      isCartCheckout: false,
    });
  }, []);

  const handleCartCheckout = useCallback(() => {
    setOrderForm({
      isOpen: true,
      product: null,
      selectedSize: '',
      isCartCheckout: true,
    });
  }, []);

  const closeOrderForm = useCallback(() => {
    setOrderForm({
      isOpen: false,
      product: null,
      selectedSize: '',
      isCartCheckout: false,
    });
  }, []);

  // Close modal on route change
  const location = useLocation();
  useEffect(() => {
    if (orderForm.isOpen) closeOrderForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll while modal is open (nice UX)
  useEffect(() => {
    if (orderForm.isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [orderForm.isOpen]);

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home onBuyNow={handleBuyNow} />} />
          <Route path="/collections/:edition" element={<Collections onBuyNow={handleBuyNow} />} />
          <Route path="/new-arrivals" element={<NewArrivals onBuyNow={handleBuyNow} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <Cart onCheckout={handleCartCheckout} />

      <OrderForm
        isOpen={orderForm.isOpen}
        onClose={closeOrderForm}
        product={orderForm.product ?? undefined}
        selectedSize={orderForm.selectedSize || undefined}
        isCartCheckout={orderForm.isCartCheckout}
      />

      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppInner />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
