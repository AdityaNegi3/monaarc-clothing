// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import "./index.css";

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

if (!pk || !pk.startsWith("pk_")) {
  console.error("❌ Missing or invalid VITE_CLERK_PUBLISHABLE_KEY in .env");
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ClerkProvider publishableKey={pk}>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </ClerkProvider>
  </StrictMode>
);
