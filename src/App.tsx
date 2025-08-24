import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [orderForm, setOrderForm] = useState({
    isOpen: false,
    product: null as Product | null,
    selectedSize: '',
    isCartCheckout: false
  });

  const handleBuyNow = (product: Product, size: string) => {
    setOrderForm({
      isOpen: true,
      product,
      selectedSize: size,
      isCartCheckout: false
    });
  };

  const handleCartCheckout = () => {
    setOrderForm({
      isOpen: true,
      product: null,
      selectedSize: '',
      isCartCheckout: true
    });
  };

  const closeOrderForm = () => {
    setOrderForm({
      isOpen: false,
      product: null,
      selectedSize: '',
      isCartCheckout: false
    });
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home onBuyNow={handleBuyNow} />} />
                <Route path="/collections/:edition" element={<Collections onBuyNow={handleBuyNow} />} />
                <Route path="/new-arrivals" element={<NewArrivals onBuyNow={handleBuyNow} />} />
                <Route path="/about" element={<About />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </main>
            
            <Cart onCheckout={handleCartCheckout} />
            
            <OrderForm
              isOpen={orderForm.isOpen}
              onClose={closeOrderForm}
              product={orderForm.product}
              selectedSize={orderForm.selectedSize}
              isCartCheckout={orderForm.isCartCheckout}
            />
            
            <CookieConsent />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;