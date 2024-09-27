import { create } from "zustand";

const API_URI = "http://localhost:3001/api/auth";
export const useAuthStore = create((set) => ({
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  message: null,
  user: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const options = {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      };

      const response = await fetch(`${API_URI}/signup`, options);
      const data = await response.json();
      if (data.message) {
        throw new Error(data.message);
      }

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return data;
    } catch (error) {
      set({
        error: error.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const options = {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      };

      const response = await fetch(`${API_URI}/verify-email`, options);
      const data = await response.json();
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return data;
    } catch (error) {
      set({ error: error.message || "Error Verify", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const options = {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch(`${API_URI}/check-auth`, options);
      const data = await response.json();
      set({
        user: data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const options = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      };

      const response = await fetch(`${API_URI}/login`, options);
      const data = await response.json();
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return data;
    } catch (error) {
      set({
        error: error.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ error: null, isLoading: true });
    try {
      const options = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      };
      await fetch(`${API_URI}/logout`, options);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const options = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      };
      const resposnse = await fetch(`${API_URI}/forgot-password`, options);
      const data = await resposnse.json();
      console.log(data);
      set({ message: data.message, isLoading: false, error: data?.message });
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });

    try {
      const options = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      };

      const response = await fetch(
        `${API_URI}/reset-password/${token}`,
        options
      );
      const data = await response.json();
      set({ user: data.user, isLoading: false, message: data.message });
    } catch (error) {
      set({ error: error.message, isLoading: false });

      throw error;
    }
  },
}));
