// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

// Pin a recent Clerk JS (works with current @clerk/clerk-react)
const CLERK_JS_FALLBACK = "https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={pk}
      // Force-load Clerk JS from jsDelivr (bypasses cdn.clerk.com)
      clerkJSUrl={CLERK_JS_FALLBACK}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
