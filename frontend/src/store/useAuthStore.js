import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  user: null,
  isOnline: navigator.onLine,

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },

  setUser: (user) => set({ user }),

  setOnline: (isOnline) => set({ isOnline }),

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
