"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Todo } from "@/services/todo-service";
import { Check, X, Pencil, Trash2, Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onToggle: (todoId: number, isCompleted: boolean) => Promise<void>;
  onDelete: (todoId: number) => Promise<void>;
  onEdit: (todoId: number, title: string, description?: string) => Promise<void>;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export function TodoItem({
  todo,
  isEditing,
  onToggle,
  onDelete,
  onEdit,
  onStartEdit,
  onCancelEdit,
}: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");

  const handleToggle = async () => {
    setIsUpdating(true);
    await onToggle(todo.id, !todo.is_completed);
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      setIsUpdating(true);
      await onDelete(todo.id);
      setIsUpdating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    setIsUpdating(true);
    await onEdit(todo.id, editTitle, editDescription || undefined);
    setIsUpdating(false);
    onCancelEdit();
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    onCancelEdit();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        className="rounded-xl border-2 border-primary/30 bg-card p-4 shadow-cyber"
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 mb-3 text-sm"
          placeholder="Todo title"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 mb-4 resize-none text-sm"
          placeholder="Description (optional)"
          rows={2}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancelEdit}
            disabled={isUpdating}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={isUpdating || !editTitle.trim()}
            className="px-4 py-1.5 text-sm gradient-cyber text-cyber-dark-blue font-medium rounded-lg shadow-cyber hover:shadow-cyber-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Save
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "group rounded-xl border border-border/50 bg-card/80 p-4 shadow-elevated hover:shadow-elevated-xl transition-all duration-300",
        "hover:border-primary/20",
        todo.is_completed && "bg-card/40"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className={cn(
            "flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            todo.is_completed
              ? "gradient-cyber border-transparent shadow-cyber"
              : "border-border/70 hover:border-primary/50 hover:shadow-cyber",
            isUpdating && "opacity-50"
          )}
        >
          {isUpdating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          ) : todo.is_completed ? (
            <Check className="h-3.5 w-3.5 text-cyber-dark-blue" />
          ) : null}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "text-base font-medium transition-colors",
              todo.is_completed
                ? "text-muted-foreground line-through"
                : "text-foreground"
            )}
          >
            {todo.title}
          </h4>
          {todo.description && (
            <p
              className={cn(
                "mt-1 text-sm",
                todo.is_completed ? "text-muted-foreground/60" : "text-muted-foreground"
              )}
            >
              {todo.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs",
                todo.is_completed ? "text-muted-foreground/50" : "text-muted-foreground"
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(todo.created_at)}
            </span>
            {todo.is_completed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                <Check className="h-2.5 w-2.5" />
                Done
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onStartEdit}
            disabled={isUpdating}
            className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 disabled:opacity-50 transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isUpdating}
            className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 disabled:opacity-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
