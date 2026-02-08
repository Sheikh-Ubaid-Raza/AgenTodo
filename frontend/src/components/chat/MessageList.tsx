"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChatMessage, formatToolName } from "@/lib/chat";
import {
  Bot,
  User,
  Wrench,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  toolExecution: {
    isActive: boolean;
    toolName: string;
    status: string;
  };
}

function ToolCallBadge({
  toolName,
  status,
}: {
  toolName: string;
  status: string;
}) {
  const isExecuting = status === "pending" || status === "executing";

  const statusConfig = {
    pending: { icon: Loader2, className: "animate-spin text-primary" },
    executing: { icon: Loader2, className: "animate-spin text-primary" },
    completed: { icon: CheckCircle, className: "text-success" },
    failed: { icon: XCircle, className: "text-destructive" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    icon: Wrench,
    className: "text-muted-foreground",
  };
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        "border transition-all duration-200",
        isExecuting
          ? "bg-primary/10 border-primary/30 animate-mcp-shimmer"
          : status === "completed"
          ? "bg-success/10 border-success/30"
          : status === "failed"
          ? "bg-destructive/10 border-destructive/30"
          : "bg-muted border-border/50"
      )}
    >
      <Icon className={cn("h-3 w-3", config.className)} />
      <span className={isExecuting ? "text-primary" : "text-muted-foreground"}>
        {formatToolName(toolName)}
      </span>
    </motion.span>
  );
}

const messageVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95 },
};

export function MessageList({
  messages,
  isLoading,
  toolExecution,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, toolExecution.isActive]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-2xl gradient-cyber opacity-20 blur-xl scale-150" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl gradient-cyber shadow-cyber mx-auto">
              <Sparkles className="h-8 w-8 text-cyber-dark-blue animate-float" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              How can I help you today?
            </p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Try saying &quot;Add milk to my list&quot; or &quot;Show my tasks&quot;
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-xs bg-muted/50 border border-border/30 text-muted-foreground">
              &quot;Create a task&quot;
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-muted/50 border border-border/30 text-muted-foreground">
              &quot;List my todos&quot;
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {/* AI Avatar */}
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 mt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-cyber shadow-cyber">
                  <Sparkles className="h-4 w-4 text-cyber-dark-blue" />
                </div>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "gradient-cyber text-cyber-dark-blue rounded-br-md shadow-cyber"
                  : "bg-muted/70 text-foreground rounded-bl-md border border-border/30"
              )}
            >
              <p className="whitespace-pre-wrap break-words leading-relaxed">
                {msg.content}
              </p>

              {/* Tool call badges */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-3 pt-2 border-t border-border/30 flex flex-wrap gap-2">
                  {msg.toolCalls.map((tc, i) => (
                    <ToolCallBadge
                      key={`${tc.tool_name}-${i}`}
                      toolName={tc.tool_name}
                      status={tc.status ?? "completed"}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="flex-shrink-0 mt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary border border-border/50">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading / thinking indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 justify-start"
        >
          <div className="flex-shrink-0 mt-1">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl gradient-cyber shadow-cyber",
                toolExecution.isActive && "animate-tool-pulse"
              )}
            >
              <Sparkles className="h-4 w-4 text-cyber-dark-blue" />
            </div>
          </div>
          <div className="rounded-2xl rounded-bl-md bg-muted/70 border border-border/30 px-4 py-3">
            {toolExecution.isActive && toolExecution.toolName ? (
              <div className="flex items-center gap-2 text-sm">
                <div className="relative">
                  <Zap className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <span className="text-muted-foreground">
                  Executing{" "}
                  <span className="font-medium text-primary">
                    {formatToolName(toolExecution.toolName)}
                  </span>
                  ...
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-primary" />
                </div>
                <span className="text-xs text-muted-foreground ml-1">
                  Thinking...
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
