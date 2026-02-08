"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
};

const iconStyles = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
  warning: "text-yellow-500",
};

export function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => onClose(id), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${
        styles[type]
      } ${isLeaving ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${iconStyles[type]}`} />
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-black/5"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToasts() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; type: ToastType; message: string; duration?: number }>
  >([]);

  const addToast = (type: ToastType, message: string, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    success: (message: string, duration?: number) => addToast("success", message, duration),
    error: (message: string, duration?: number) => addToast("error", message, duration),
    info: (message: string, duration?: number) => addToast("info", message, duration),
    warning: (message: string, duration?: number) => addToast("warning", message, duration),
  };
}
