"use client";

import { AlertCircle, X } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorDisplay({ message, onDismiss }: ErrorDisplayProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-full hover:bg-red-100 text-red-500"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface AuthErrorProps {
  code?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function AuthError({ code, message, onDismiss, onRetry }: AuthErrorProps) {
  // Map common error codes to user-friendly messages
  const getUserFriendlyMessage = () => {
    switch (code) {
      case "TOKEN_EXPIRED":
        return "Your session has expired. Please sign in again.";
      case "INVALID_TOKEN":
        return "Invalid authentication. Please sign in again.";
      case "UNAUTHORIZED":
        return "You need to sign in to access this page.";
      case "NETWORK_ERROR":
        return "Unable to connect. Please check your internet connection.";
      default:
        return message;
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800">Authentication Error</h4>
          <p className="mt-1 text-sm text-red-700">{getUserFriendlyMessage()}</p>
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
