import React, {
  createContext, useContext, useEffect, useRef, useState, ReactNode,
} from "react";
import { useUser } from "@clerk/clerk-react";
import { Product } from "../types/Product";

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

/** ---- Config ---- **/
const GUEST_LS_KEY = "MONAARC.cart.guest.v1";
/** How to combine guest + account carts on first sign-in on a device:
 *  "server_wins"         -> use account cart; ignore guest items
 *  "merge_quantities"    -> merge by (id+size), add quantities (recommended)
 */
const MERGE_STRATEGY: "server_wins" | "merge_quantities" = "merge_quantities";

/** ---- Helpers ---- **/
const keyFor = (i: { id: string; size: string }) => `${i.id}__${i.size}`;
const safeParse = <T,>(raw: string | null, fallback: T): T => {
  try { return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
};
const mergeCarts = (a: CartItem[], b: CartItem[]) => {
  if (MERGE_STRATEGY === "server_wins") return a.slice();
  const map = new Map<string, CartItem>();
  [...a, ...b].forEach((it) => {
    const k = keyFor(it);
    const prev = map.get(k);
    map.set(k, prev ? { ...prev, quantity: prev.quantity + it.quantity } : { ...it });
  });
  return [...map.values()];
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const initRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 1) Initial: load guest cart so signed-out users keep items between refreshes */
  useEffect(() => {
    if (initRef.current) return;
    const guest = safeParse<CartItem[]>(localStorage.getItem(GUEST_LS_KEY), []);
    setCartItems(guest);
    initRef.current = true;
  }, []);

  /** 2) When auth state changes, sync with Clerk */
  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      // User just signed in OR switched account
      if (isSignedIn && user && lastUserIdRef.current !== user.id) {
        try {
          // Always fetch fresh metadata (avoids stale cache when coming from another device)
          await user.reload();
          const meta = (user.privateMetadata as any) || {};
          const serverCart: CartItem[] = Array.isArray(meta.cart) ? meta.cart : [];

          const guest = safeParse<CartItem[]>(localStorage.getItem(GUEST_LS_KEY), []);

          // Merge (or server wins) only once on this device after sign-in
          const merged = mergeCarts(serverCart, guest);

          // Set UI state
          setCartItems(merged);

          // Persist to Clerk (account)
          await user.update({
            privateMetadata: { ...(user.privateMetadata || {}), cart: merged },
          });

          // Clear guest cart after successful upload
          localStorage.removeItem(GUEST_LS_KEY);

          lastUserIdRef.current = user.id;
        } catch (e) {
          console.warn("[Cart] sign-in sync failed:", e);
        }
      }

      // User just signed out
      if (!isSignedIn && lastUserIdRef.current) {
        // Keep their last cart in guest storage so they still see items as a guest (optional)
        localStorage.setItem(GUEST_LS_KEY, JSON.stringify(cartItems));
        lastUserIdRef.current = null;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user?.id]);

  /** 3) Persist changes:
   * - Signed out -> write guest localStorage
   * - Signed in  -> debounce write to Clerk privateMetadata (account) + keep guest empty
   */
  useEffect(() => {
    if (!initRef.current) return;

    if (!isSignedIn) {
      localStorage.setItem(GUEST_LS_KEY, JSON.stringify(cartItems));
    } else if (user) {
      // Debounce Clerk writes to avoid spamming updates
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await user.update({
            privateMetadata: { ...(user.privateMetadata || {}), cart: cartItems },
          });
        } catch (e) {
          console.warn("[Cart] account save failed:", e);
        }
      }, 500);
    }
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [cartItems, isSignedIn, user]);

  /** ---- Cart operations ---- **/
  const addToCart = (product: Product, size: string) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id && i.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, size: string) =>
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));

  const updateQuantity = (id: string, size: string, quantity: number) =>
    setCartItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => !(i.id === id && i.size === size));
      return prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity } : i));
    });

  const clearCart = () => setCartItems([]);

  const getTotalPrice = () => cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const getTotalItems = () => cartItems.reduce((t, i) => t + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
