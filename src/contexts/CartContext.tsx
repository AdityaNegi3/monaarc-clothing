import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.id === product.id && item.selectedSize === size
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        return {
          ...state,
          items: updatedItems,
          total: state.total + product.price
        };
      }

      const newItem: CartItem = {
        ...product,
        selectedSize: size,
        quantity: 1
      };

      return {
        ...state,
        items: [...state.items, newItem],
        total: state.total + product.price
      };
    }
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => 
        `${item.id}-${item.selectedSize}` === action.payload
      );
      if (!itemToRemove) return state;

      return {
        ...state,
        items: state.items.filter(item => 
          `${item.id}-${item.selectedSize}` !== action.payload
        ),
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      };
    }
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => `${item.id}-${item.selectedSize}` === id);
      if (!item || quantity <= 0) return state;

      const priceDiff = (quantity - item.quantity) * item.price;
      return {
        ...state,
        items: state.items.map(item =>
          `${item.id}-${item.selectedSize}` === id
            ? { ...item, quantity }
            : item
        ),
        total: state.total + priceDiff
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isOpen: false
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};