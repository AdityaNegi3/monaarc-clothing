// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// TEMP: log once to confirm it’s loaded (check the browser console)
console.log("VITE_CLERK_PUBLISHABLE_KEY present:", !!PUBLISHABLE_KEY);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      // Don’t throw—render a visible message so you don’t get an all-white screen
      <div style={{ padding: 20, color: "white", background: "black" }}>
        Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code>.  
        Create a file <code>.env</code> in your project root with:
        <pre>VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxx_or_pk_test_xxx</pre>
        Then restart <code>npm run dev</code>.
      </div>
    )}
  </React.StrictMode>
);
