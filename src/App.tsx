// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ThankYou from './pages/ThankYou';

function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);
  return null;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Header />
          <ScrollToHash />
          <ScrollToTop />
          <main>
            <Routes>
              {/* Site pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/thank-you" element={<ThankYou />} />

              {/* Clerk full-page auth */}
              <Route
                path="/sign-in"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-black">
                    <SignIn afterSignInUrl="/" signUpUrl="/sign-up" />
                  </div>
                }
              />
              <Route
                path="/sign-up"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-black">
                    <SignUp afterSignUpUrl="/" signInUrl="/sign-in" />
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
