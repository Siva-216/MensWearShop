import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  size: string;
  color?: string;
  sku?: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color?: string, sku?: string, price?: number) => void;
  removeFromCart: (productId: string, size: string, color?: string) => void;
  updateQuantity: (productId: string, size: string, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, size: string, color?: string, sku?: string, price?: number) => {
    setItems((prev) => {
      const itemPrice = price || product.price;
      const existing = prev.find((i) => 
        i.product.id === product.id && 
        i.size === size && 
        i.color === color
      );
      
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, size, color, sku, price: itemPrice, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, color?: string) => {
    setItems((prev) => prev.filter((i) => 
      !(i.product.id === productId && i.size === size && i.color === color)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => 
        !(i.product.id === productId && i.size === size && i.color === color)
      ));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId && i.size === size && i.color === color 
            ? { ...i, quantity } 
            : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
