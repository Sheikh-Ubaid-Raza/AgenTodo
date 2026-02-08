"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { X, RotateCcw, AlertCircle, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useAuth } from "@/components/auth/AuthProvider";
import type { ChatMessage } from "@/lib/chat";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  toolExecution: {
    isActive: boolean;
    toolName: string;
    status: string;
  };
  onSendMessage: (content: string) => Promise<void>;
  onClose: () => void;
  onClearError: () => void;
  onNewConversation: () => void;
}

export function ChatWindow({
  messages,
  isLoading,
  error,
  toolExecution,
  onSendMessage,
  onClose,
  onClearError,
  onNewConversation,
}: ChatWindowProps) {
  const { isAuthenticated } = useAuth();

  const handleSend = useCallback(
    (content: string) => {
      onSendMessage(content);
    },
    [onSendMessage]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "fixed z-[9998] flex flex-col",
        "glass-card border border-border/30 shadow-cyber-lg overflow-hidden",
        // Desktop: positioned above trigger button
        "bottom-24 right-6 w-[420px] h-[600px] rounded-2xl",
        // Mobile: full screen
        "max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:bottom-0 max-sm:right-0"
      )}
      role="dialog"
      aria-label="AI Assistant"
    >
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-border/30 px-4 py-3 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-cyber shadow-cyber">
              <Sparkles className="h-4 w-4 text-cyber-dark-blue" />
            </div>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
          </div>
          <div>
            <h2 className="text-sm font-semibold gradient-text-cyber">
              AgenTodo AI
            </h2>
            <p className="text-xs text-muted-foreground">
              {toolExecution.isActive ? (
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-primary animate-pulse" />
                  Processing...
                </span>
              ) : (
                "Ready to help"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onNewConversation}
            aria-label="New conversation"
            title="New conversation"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              "transition-colors duration-200"
            )}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              "transition-colors duration-200 sm:hidden"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex items-start gap-2 border-b border-destructive/20 bg-destructive/10 px-4 py-2"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-destructive" />
          <p className="flex-1 text-xs text-destructive">{error}</p>
          <button
            onClick={onClearError}
            aria-label="Dismiss error"
            className="text-destructive/70 hover:text-destructive transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}

      {/* Messages area */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        toolExecution={toolExecution}
      />

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        disabled={isLoading || !isAuthenticated}
        placeholder={
          !isAuthenticated
            ? "Log in to send messages..."
            : "Ask me to manage your tasks..."
        }
      />

      {/* Powered by badge */}
      <div className="px-4 py-2 border-t border-border/20 bg-muted/20">
        <p className="text-center text-[10px] text-muted-foreground">
          Powered by <span className="font-medium gradient-text-cyber">MCP Tools</span> for intelligent task automation
        </p>
      </div>
    </motion.div>
  );
}
