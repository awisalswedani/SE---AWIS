'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { addToCart, getCart, updateCartQuantity, removeFromCart, getOrCreateGuestId } from '@/utils/api';

// Cart item interface - Updated to match actual API response
export interface CartItem {
  id: number;
  customer_id: number;
  cart_group_id: string;
  product_id: number;
  product_type: string;
  digital_product_type: string | null;
  color: string | null;
  choices: any[];
  variations: any[];
  variant: string;
  quantity: number;
  price: number;
  tax: number;
  discount: number;
  tax_model: string;
  is_checked: number;
  slug: string;
  name: string;
  thumbnail: string;
  seller_id: number;
  seller_is: string;
  created_at: string;
  updated_at: string;
  shop_info: string;
  shipping_cost: number;
  shipping_type: string;
  is_guest: number;
  is_product_available: number;
  minimum_order_amount_info: number;
  free_delivery_order_amount: {
    amount: number;
    percentage: number;
    amount_need: number;
    shipping_cost_saved: number;
    cart_id: string;
    status: number;
    responsibility: string;
  };
  shop?: any;
  product?: any;
}

// Cart state interface
interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  subtotal: number;
  total: number;
}

// Cart action types
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_TOTALS' };

// Initial state
const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  subtotal: 0,
  total: 0,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: action.payload.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
        total: action.payload.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
      };
    
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product_id === action.payload.product_id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: updatedItems.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
          total: updatedItems.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
        };
      } else {
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: newItems.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
          total: newItems.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
        };
      }
    
    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: updatedItems.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
        total: updatedItems.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: filteredItems.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
        total: filteredItems.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        subtotal: 0,
        total: 0,
      };
    
    case 'UPDATE_TOTALS':
      return {
        ...state,
        totalItems: state.items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: state.items.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
        total: state.items.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0),
      };
    
    default:
      return state;
  }
}

// Cart context
interface CartContextType {
  state: CartState;
  addToCart: (productId: number, quantity?: number, selectedColor?: string, selectedOptions?: { [key: string]: string }, selectedVariant?: any) => Promise<void>;
  updateQuantity: (cartId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  clearCart: () => void;
  loadCart: () => Promise<void>;
  clearCartAndGuestId: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [errorToast, setErrorToast] = React.useState<string | null>(null);

  // Clear cart and guest_id if no guest_id is found (new session/private window)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const guestId = localStorage.getItem('guest_id');
      if (!guestId) {
        localStorage.removeItem('guest_id');
        dispatch({ type: 'CLEAR_CART' });
      }
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await getCart();
      console.log('Cart response structure:', response);
      
      // Handle different possible response structures
      let cartItems: CartItem[] = [];
      
      if (Array.isArray(response)) {
        // Direct array response (actual API structure)
        cartItems = response;
      } else if (response.cart && Array.isArray(response.cart)) {
        cartItems = response.cart;
      } else if (response.items && Array.isArray(response.items)) {
        cartItems = response.items;
      } else if (response.data && Array.isArray(response.data)) {
        cartItems = response.data;
      } else {
        console.warn('Unexpected cart response structure:', response);
        cartItems = [];
      }
      
      console.log('Processed cart items:', cartItems);
      dispatch({ type: 'SET_CART', payload: cartItems });
    } catch (error) {
      console.error('Failed to load cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCartHandler = async (productId: number, quantity: number = 1, selectedColor?: string, selectedOptions?: { [key: string]: string }, selectedVariant?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      console.log('Adding to cart:', { productId, quantity, selectedColor, selectedOptions, selectedVariant });
      const guest_id = await getOrCreateGuestId();
      await addToCart(productId, quantity, selectedColor, selectedOptions, selectedVariant);
      await loadCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to cart' });
      setErrorToast('Failed to add to cart');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantityHandler = async (cartId: number, quantity: number) => {
    // Find the item and store previous quantity
    const prevItem = state.items.find((item) => item.id === cartId);
    if (!prevItem) return;
    const prevQuantity = prevItem.quantity;
    // Optimistically update
    dispatch({ type: 'UPDATE_ITEM', payload: { id: cartId, quantity } });
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const guest_id = await getOrCreateGuestId();
      await updateCartQuantity(cartId, quantity);
    } catch (error) {
      // Revert on error
      dispatch({ type: 'UPDATE_ITEM', payload: { id: cartId, quantity: prevQuantity } });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update quantity' });
      setErrorToast('Failed to update quantity');
      throw error;
    }
  };

  const removeFromCartHandler = async (cartId: number) => {
    // Find the item and store previous state
    const prevItem = state.items.find((item) => item.id === cartId);
    if (!prevItem) return;
    // Optimistically remove
    dispatch({ type: 'REMOVE_ITEM', payload: cartId });
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const guest_id = await getOrCreateGuestId();
      await removeFromCart(cartId);
    } catch (error) {
      // Revert on error
      dispatch({ type: 'SET_CART', payload: [prevItem, ...state.items] });
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from cart' });
      setErrorToast('Failed to remove from cart');
      throw error;
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Add a function to clear cart and guest_id (for logout or new session)
  const clearCartAndGuestId = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_id');
    }
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    state,
    addToCart: addToCartHandler,
    updateQuantity: updateQuantityHandler,
    removeFromCart: removeFromCartHandler,
    clearCart,
    loadCart,
    // Expose clearCartAndGuestId for use in logout/session reset
    clearCartAndGuestId,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {errorToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow z-50">
          {errorToast}
          <button className="ml-2" onClick={() => setErrorToast(null)}>&times;</button>
        </div>
      )}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 