/**
 * Authentication type definitions.
 */

export interface Task {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  is_completed?: boolean;
}

export interface ApiErrorResponse {
  detail: string;
}

export interface JWTPayload {
  sub: string;
  iat: number;
  exp: number;
  jti?: string;
  role?: string;
  email?: string;
}
