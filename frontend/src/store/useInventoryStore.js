import { create } from "zustand";

const useInventoryStore = create((set) => ({
  items: [],
  loading: false,

  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),

  addItem: (item) => set((state) => ({ items: [...state.items, item] })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  decrementStock: (id, amount = 1) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? { ...item, stock: Math.max(0, item.stock - amount) }
          : item,
      ),
    })),
}));

export default useInventoryStore;
