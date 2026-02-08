"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { SendHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div className="border-t border-border/30 bg-card/30 p-3">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            aria-label="Chat message input"
            className={cn(
              "w-full resize-none rounded-xl border border-border/50 bg-muted/30 px-4 py-3 pr-12 text-sm",
              "placeholder:text-muted-foreground/50",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200",
              "max-h-[120px]"
            )}
          />
        </div>
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          whileHover={canSend ? { scale: 1.05 } : undefined}
          whileTap={canSend ? { scale: 0.95 } : undefined}
          className={cn(
            "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl",
            "transition-all duration-200",
            canSend
              ? "gradient-cyber text-cyber-dark-blue shadow-cyber hover:shadow-cyber-lg"
              : "bg-muted text-muted-foreground cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
        >
          {disabled && value.trim() ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className={cn("h-4 w-4", canSend && "animate-pulse")} />
          )}
        </motion.button>
      </div>
      <p className="mt-2 text-[10px] text-center text-muted-foreground/70">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
