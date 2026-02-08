"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnread?: boolean;
}

export function ChatTrigger({ isOpen, onClick, hasUnread }: ChatTriggerProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      aria-expanded={isOpen}
      className={cn(
        "fixed bottom-6 right-6 z-[9999] flex items-center justify-center",
        "h-14 w-14 rounded-full",
        "gradient-cyber shadow-cyber-lg",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        !isOpen && "animate-pulse-ring"
      )}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
    >
      {/* Outer glow ring */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full animate-ping gradient-cyber opacity-30" />
      )}

      {/* Icon container with animation */}
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="h-6 w-6 text-cyber-dark-blue" />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Sparkles className="h-6 w-6 text-cyber-dark-blue" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unread indicator */}
      {hasUnread && !isOpen && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-accent border-2 border-cyber-dark-blue" />
        </motion.span>
      )}

      {/* Tooltip on hover */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 px-3 py-1.5 rounded-lg glass-card border border-border/50 shadow-cyber text-sm font-medium whitespace-nowrap pointer-events-none hidden sm:block"
        >
          <span className="gradient-text-cyber">Ask AI</span>
        </motion.div>
      )}
    </motion.button>
  );
}
