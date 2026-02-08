/**
 * Chat utilities and type definitions for the floating chat widget.
 */

export interface ToolCallInfo {
  tool_name: string;
  arguments: Record<string, unknown>;
  result: string;
  /** Client-side status tracking. Backend returns completed tool calls. */
  status?: "pending" | "executing" | "completed" | "failed";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  toolCalls?: ToolCallInfo[];
}

export interface ChatApiResponse {
  conversation_id: number;
  response: string;
  tool_calls: ToolCallInfo[];
}

export interface ChatApiError {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
  retry_after?: number;
}

const CONVERSATION_STORAGE_KEY = "chat_conversation_id";
const MESSAGES_STORAGE_KEY = "chat_messages";

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getStoredConversationId(): number | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CONVERSATION_STORAGE_KEY);
  return stored ? parseInt(stored, 10) : null;
}

export function setStoredConversationId(id: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONVERSATION_STORAGE_KEY, String(id));
}

export function clearStoredConversation(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CONVERSATION_STORAGE_KEY);
  localStorage.removeItem(MESSAGES_STORAGE_KEY);
}

export function getStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function setStoredMessages(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  // Keep only the last 100 messages in storage
  const toStore = messages.slice(-100);
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(toStore));
}

export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 5000);
}

export function formatToolName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
