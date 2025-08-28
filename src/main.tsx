// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={pk}
      // Force-load Clerk JS from the CDN (bypasses your custom domain)
      clerkJSUrl="https://cdn.clerk.com/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
      clerkJSVariant="headless"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
