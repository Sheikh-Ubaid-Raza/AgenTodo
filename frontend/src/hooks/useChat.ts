"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiClient } from "@/services/api-client";
import {
  ChatMessage,
  ChatApiResponse,
  ToolCallInfo,
  generateMessageId,
  getStoredConversationId,
  setStoredConversationId,
  clearStoredConversation,
  getStoredMessages,
  setStoredMessages,
  sanitizeInput,
} from "@/lib/chat";
import { emitTasksInvalidated } from "@/lib/task-events";

interface ToolExecution {
  isActive: boolean;
  toolName: string;
  status: string;
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  toolExecution: ToolExecution;
  conversationId: number | null;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
  startNewConversation: () => void;
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useChat(): UseChatReturn {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [toolExecution, setToolExecution] = useState<ToolExecution>({
    isActive: false,
    toolName: "",
    status: "",
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load stored conversation on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    const storedId = getStoredConversationId();
    if (storedId) {
      setConversationId(storedId);
    }
    const storedMessages = getStoredMessages();
    if (storedMessages.length > 0) {
      setMessages(storedMessages);
    }
  }, [isAuthenticated]);

  // Persist messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      setStoredMessages(messages);
    }
  }, [messages]);

  const clearError = useCallback(() => setError(null), []);

  const startNewConversation = useCallback(() => {
    clearStoredConversation();
    setMessages([]);
    setConversationId(null);
    setError(null);
    setToolExecution({ isActive: false, toolName: "", status: "" });
  }, []);

  const processToolCalls = useCallback((toolCalls: ToolCallInfo[]) => {
    if (!toolCalls || toolCalls.length === 0) {
      setToolExecution({ isActive: false, toolName: "", status: "" });
      return;
    }

    for (const tc of toolCalls) {
      setToolExecution({
        isActive: tc.status === "pending" || tc.status === "executing",
        toolName: tc.tool_name,
        status: tc.status || "",
      });
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!isAuthenticated || !user?.id) {
        setError("You must be logged in to send messages.");
        return;
      }

      const sanitized = sanitizeInput(content);
      if (!sanitized) return;

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setError(null);
      setIsLoading(true);

      // Add user message optimistically
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: "user",
        content: sanitized,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Set tool execution to show "thinking"
      setToolExecution({ isActive: true, toolName: "", status: "pending" });

      let retries = 0;
      let lastError: string | null = null;

      while (retries <= MAX_RETRIES) {
        try {
          const requestBody: { message: string; conversation_id?: number } = {
            message: sanitized,
          };
          if (conversationId) {
            requestBody.conversation_id = conversationId;
          }

          const response = await apiClient.post<ChatApiResponse>(
            `/${user.id}/chat`,
            requestBody
          );

          if (response.error) {
            const status = response.error.status;

            // 401 - handled by apiClient (triggers logout)
            if (status === 401) {
              setError("Session expired. Please log in again.");
              break;
            }

            // 403 - access denied
            if (status === 403) {
              setError("Access denied. You do not have permission for this action.");
              break;
            }

            // 400 - bad request, no retry
            if (status === 400) {
              setError(response.error.detail || "Invalid request. Please try again.");
              break;
            }

            // 429 - rate limited
            if (status === 429) {
              setError("Too many requests. Please wait a moment before sending another message.");
              break;
            }

            // 5xx - retry
            if (status >= 500 && retries < MAX_RETRIES) {
              retries++;
              lastError = response.error.detail || "Server error. Retrying...";
              await sleep(RETRY_DELAY_MS * retries);
              continue;
            }

            setError(response.error.detail || "An unexpected error occurred.");
            break;
          }

          if (response.data) {
            const data = response.data;

            // Update conversation ID
            if (data.conversation_id) {
              setConversationId(data.conversation_id);
              setStoredConversationId(data.conversation_id);
            }

            // Process tool calls
            processToolCalls(data.tool_calls);

            // Add assistant message
            const assistantMessage: ChatMessage = {
              id: generateMessageId(),
              role: "assistant",
              content: data.response,
              timestamp: new Date().toISOString(),
              toolCalls: data.tool_calls,
            };
            setMessages((prev) => [...prev, assistantMessage]);

            // Emit task invalidation for any task-mutating tool calls
            // so the todos page can auto-refresh
            if (data.tool_calls && data.tool_calls.length > 0) {
              const TASK_TOOLS = new Set([
                "add_task",
                "complete_task",
                "delete_task",
                "update_task",
              ]);
              for (const tc of data.tool_calls) {
                if (TASK_TOOLS.has(tc.tool_name)) {
                  emitTasksInvalidated({
                    toolName: tc.tool_name,
                    result: tc.result, // Include result details for better UX
                  });
                  break; // One invalidation event is enough
                }
              }
            }
          }

          break; // Success - exit retry loop
        } catch (err) {
          if (retries < MAX_RETRIES) {
            retries++;
            lastError =
              err instanceof Error ? err.message : "Network error. Retrying...";
            await sleep(RETRY_DELAY_MS * retries);
            continue;
          }
          setError(
            lastError || "Failed to send message. Please check your connection."
          );
          break;
        }
      }

      setIsLoading(false);
      setToolExecution((prev) =>
        prev.isActive ? { ...prev, isActive: false } : prev
      );
    },
    [isAuthenticated, user, conversationId, processToolCalls]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    error,
    toolExecution,
    conversationId,
    sendMessage,
    clearError,
    startNewConversation,
  };
}
