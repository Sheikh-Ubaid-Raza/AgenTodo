/**
 * Todo service for managing todo items via API.
 *
 * Provides CRUD operations for todos with user isolation.
 */

import { apiClient, ApiResponse } from "./api-client";

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  user_id?: number;
}

export interface TodoCreate {
  title: string;
  description?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  is_completed?: boolean;
}

class TodoService {
  /**
   * Get all todos for the current user.
   */
  async getTodos(userId: string): Promise<ApiResponse<Todo[]>> {
    return apiClient.get<Todo[]>(`/users/${userId}/tasks`);
  }

  /**
   * Get a single todo by ID.
   */
  async getTodo(userId: string, todoId: number): Promise<ApiResponse<Todo>> {
    return apiClient.get<Todo>(`/users/${userId}/tasks/${todoId}`);
  }

  /**
   * Create a new todo.
   */
  async createTodo(userId: string, data: TodoCreate): Promise<ApiResponse<Todo>> {
    return apiClient.post<Todo>(`/users/${userId}/tasks`, data);
  }

  /**
   * Update an existing todo.
   */
  async updateTodo(userId: string, todoId: number, data: TodoUpdate): Promise<ApiResponse<Todo>> {
    return apiClient.put<Todo>(`/users/${userId}/tasks/${todoId}`, data);
  }

  /**
   * Toggle todo completion status.
   */
  async toggleTodo(userId: string, todoId: number, isCompleted: boolean): Promise<ApiResponse<Todo>> {
    return this.updateTodo(userId, todoId, { is_completed: isCompleted });
  }

  /**
   * Delete a todo.
   */
  async deleteTodo(userId: string, todoId: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/users/${userId}/tasks/${todoId}`);
  }
}

// Singleton todo service instance
export const todoService = new TodoService();
