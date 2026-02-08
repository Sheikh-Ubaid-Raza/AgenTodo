/**
 * Authentication utilities and types for Better Auth integration.
 */

export interface User {
  id: string;
  email?: string;
  name?: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Parse JWT token to extract payload (for client-side use only).
 * Note: This does NOT verify the signature - verification happens on the backend.
 */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired (client-side check).
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Get user ID from JWT token.
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.sub !== "string") return null;
  return payload.sub;
}
