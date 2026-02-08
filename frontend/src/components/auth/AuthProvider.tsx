"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { apiClient } from "@/services/api-client";

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithToken: (token: string, user?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_STORAGE_KEY = "auth_token";
const USER_STORAGE_KEY = "auth_user";

interface AuthProviderProps {
  children: ReactNode;
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

function getUserFromToken(token: string): User | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return {
      id: payload.sub || "",
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    apiClient.setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const loginWithToken = useCallback((newToken: string, userData?: User) => {
    if (isTokenExpired(newToken)) {
      console.error("Cannot login with expired token");
      return;
    }

    const tokenUser = getUserFromToken(newToken);
    const finalUser = userData || tokenUser;

    if (!finalUser?.id) {
      console.error("Invalid token: missing user ID");
      return;
    }

    setToken(newToken);
    setUser(finalUser);
    apiClient.setToken(newToken);

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(finalUser));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const response = await apiClient.post<{ token: string; user: User }>("/auth/login", { email, password });

    if (response.error) {
      return { success: false, error: response.error.detail };
    }

    if (response.data) {
      loginWithToken(response.data.token, response.data.user);
      return { success: true };
    }

    return { success: false, error: "Unknown error" };
  }, [loginWithToken]);

  const register = useCallback(async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    const response = await apiClient.post<{ token: string; user: User }>("/auth/register", { email, password, name });

    if (response.error) {
      return { success: false, error: response.error.detail };
    }

    if (response.data) {
      loginWithToken(response.data.token, response.data.user);
      return { success: true };
    }

    return { success: false, error: "Unknown error" };
  }, [loginWithToken]);

  // Initialize auth state from stored token
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      } else {
        const userData = storedUser ? JSON.parse(storedUser) : getUserFromToken(storedToken);
        loginWithToken(storedToken, userData);
      }
    }
    setIsLoading(false);
  }, [loginWithToken]);

  // Set up unauthorized callback
  useEffect(() => {
    apiClient.setUnauthorizedCallback(() => {
      logout();
    });
  }, [logout]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    loginWithToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
