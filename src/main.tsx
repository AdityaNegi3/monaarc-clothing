import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { CartProvider } from './context/CartContext';
import App from './App';
import './index.css';

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

if (!pk || !pk.startsWith('pk_')) {
  console.error('Bad or missing VITE_CLERK_PUBLISHABLE_KEY in .env');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Publishable Key method ONLY */}
    <ClerkProvider publishableKey={pk}>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </ClerkProvider>
  </StrictMode>
);
