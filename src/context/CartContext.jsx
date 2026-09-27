import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("adepa-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("adepa-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: Number(item.quantity || 1) + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name || "Product"} added to cart`, { duration: 1800 });
  };

  const increaseQuantity = (id) => setCartItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Number(item.quantity || 1) + 1 } : item));

  const decreaseQuantity = (id) => setCartItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Number(item.quantity || 1) - 1 } : item).filter((item) => item.quantity > 0));

  const removeItem = (id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
    toast("Item removed from cart");
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
