/**
 * Authentication service for managing user sessions and tokens.
 *
 * Provides login, logout, registration, and session management
 * with secure token storage.
 */

import { apiClient } from "./api-client";

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const TOKEN_STORAGE_KEY = "auth_token";
const USER_STORAGE_KEY = "auth_user";

class AuthService {
  private user: User | null = null;
  private token: string | null = null;
  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor() {
    // Initialize from storage if available
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  /**
   * Get current auth state
   */
  getState(): AuthState {
    return {
      user: this.user,
      token: this.token,
      isAuthenticated: !!this.user && !!this.token,
      isLoading: false,
    };
  }

  /**
   * Load auth state from local storage
   */
  private loadFromStorage(): void {
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedToken && storedUser) {
        // Check if token is expired
        if (!this.isTokenExpired(storedToken)) {
          this.token = storedToken;
          this.user = JSON.parse(storedUser);
          apiClient.setToken(this.token);
        } else {
          this.clearStorage();
        }
      }
    } catch (error) {
      console.error("Error loading auth from storage:", error);
      this.clearStorage();
    }
  }

  /**
   * Save auth state to local storage
   */
  private saveToStorage(): void {
    if (typeof window === "undefined") return;

    if (this.token && this.user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, this.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.user));
    } else {
      this.clearStorage();
    }
  }

  /**
   * Clear auth storage
   */
  private clearStorage(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  /**
   * Check if JWT token is expired (client-side check)
   */
  private isTokenExpired(token: string): boolean {
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

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);

    if (response.error) {
      return { success: false, error: response.error.detail };
    }

    if (response.data) {
      this.setAuth(response.data.user, response.data.token);
      return { success: true };
    }

    return { success: false, error: "Unknown error" };
  }

  /**
   * Login user with credentials
   */
  async login(credentials: AuthCredentials): Promise<{ success: boolean; error?: string }> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);

    if (response.error) {
      return { success: false, error: response.error.detail };
    }

    if (response.data) {
      this.setAuth(response.data.user, response.data.token);
      return { success: true };
    }

    return { success: false, error: "Unknown error" };
  }

  /**
   * Set authentication state
   */
  private setAuth(user: User, token: string): void {
    this.user = user;
    this.token = token;
    apiClient.setToken(token);
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Logout user
   */
  logout(): void {
    this.user = null;
    this.token = null;
    apiClient.setToken(null);
    this.clearStorage();
    this.notifyListeners();
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.user;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.user && !!this.token && !this.isTokenExpired(this.token);
  }

  /**
   * Refresh token if needed
   */
  async refreshToken(): Promise<boolean> {
    if (!this.token) return false;

    const response = await apiClient.post<AuthResponse>("/auth/refresh");

    if (response.error) {
      this.logout();
      return false;
    }

    if (response.data) {
      this.setAuth(response.data.user, response.data.token);
      return true;
    }

    return false;
  }
}

// Singleton auth service instance
export const authService = new AuthService();
