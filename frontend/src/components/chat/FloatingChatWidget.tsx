"use client";

import { useState, useCallback, useEffect } from "react";
import { ChatTrigger } from "./ChatTrigger";
import { ChatWindow } from "./ChatWindow";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/components/auth/AuthProvider";

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const {
    messages,
    isLoading,
    error,
    toolExecution,
    sendMessage,
    clearError,
    startNewConversation,
  } = useChat();

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Don't render if not authenticated
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9997] bg-black/20 sm:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          toolExecution={toolExecution}
          onSendMessage={sendMessage}
          onClose={handleClose}
          onClearError={clearError}
          onNewConversation={startNewConversation}
        />
      )}

      <ChatTrigger isOpen={isOpen} onClick={handleToggle} />
    </>
  );
}
