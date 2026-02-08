/**
 * API client for communicating with FastAPI backend.
 *
 * Handles JWT token injection into Authorization headers for protected endpoints.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ApiError {
  detail: string;
  status: number;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
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
   * Build headers for API requests, including Authorization if token is set.
   */
  private buildHeaders(additionalHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...additionalHeaders,
    });

    if (this.token) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }

    return headers;
  }

  /**
   * Make a fetch request with proper error handling.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(options.headers);

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

      const error: ApiError = {
        detail,
        status: response.status,
      };
      throw error;
    }

    // Handle empty responses
    const contentLength = response.headers.get("content-length");
    if (contentLength === "0" || response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * GET request.
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * POST request.
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request.
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request.
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// Helper to create API client with token
export function createAuthenticatedClient(token: string): ApiClient {
  const client = new ApiClient();
  client.setToken(token);
  return client;
}
