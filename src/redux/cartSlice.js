// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const saved = (() => {
  try {
    const raw = localStorage.getItem("cart_items");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
})();

const initialState = { items: saved };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const p = action.payload;
      const ex = state.items.find(i => i.id === p.id);
      if (ex) ex.quantity = (ex.quantity || 1) + 1;
      else state.items.push({ id: p.id, title: p.title, price: p.price, image: p.image, quantity: 1 });
      try { localStorage.setItem("cart_items", JSON.stringify(state.items)); } catch {}
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
      try { localStorage.setItem("cart_items", JSON.stringify(state.items)); } catch {}
    },
    increaseQuantity(state, action) {
      const it = state.items.find(i => i.id === action.payload);
      if (it) it.quantity = (it.quantity || 1) + 1;
      try { localStorage.setItem("cart_items", JSON.stringify(state.items)); } catch {}
    },
    decreaseQuantity(state, action) {
      const it = state.items.find(i => i.id === action.payload);
      if (it && it.quantity > 1) it.quantity -= 1;
      try { localStorage.setItem("cart_items", JSON.stringify(state.items)); } catch {}
    },
    clearCart(state) {
      state.items = [];
      try { localStorage.removeItem("cart_items"); } catch {}
    }
  }
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
