/**
 * API client service for communicating with FastAPI backend.
 *
 * Provides centralized API communication with JWT token handling,
 * error management, and optimistic UI support.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ApiError {
  detail: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

class ApiClientService {
  private baseUrl: string;
  private token: string | null = null;
  private onUnauthorized: (() => void) | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set callback for unauthorized (401) responses
   */
  setUnauthorizedCallback(callback: () => void): void {
    this.onUnauthorized = callback;
  }

  /**
   * Set the JWT token for authenticated requests.
   */
  setToken(token: string | null): void {
    this.token = token;
  }

  /**
   * Get the current JWT token.
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Build headers for API requests.
   */
  private buildHeaders(additionalHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    if (additionalHeaders) {
      const additional = new Headers(additionalHeaders);
      additional.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    return headers;
  }

  /**
   * Handle API errors with proper typing and callbacks.
   */
  private handleError(status: number, detail: string): ApiError {
    const error: ApiError = { detail, status };

    if (status === 401 && this.onUnauthorized) {
      this.onUnauthorized();
    }

    return error;
  }

  /**
   * Make a fetch request with proper error handling.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let detail = "An error occurred";
        try {
          const errorData = await response.json();
          detail = errorData.detail || detail;
        } catch {
          detail = response.statusText || detail;
        }

        return {
          data: null,
          error: this.handleError(response.status, detail),
        };
      }

      // Handle empty responses
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0" || response.status === 204) {
        return { data: {} as T, error: null };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          detail: err instanceof Error ? err.message : "Network error",
          status: 0,
        },
      };
    }
  }

  /**
   * GET request.
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * POST request.
   */
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request.
   */
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request.
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request.
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Singleton API client instance
export const apiClient = new ApiClientService();

// Helper to create API client with token
export function createAuthenticatedClient(token: string): ApiClientService {
  const client = new ApiClientService();
  client.setToken(token);
  return client;
}
