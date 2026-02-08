"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Todo } from "@/services/todo-service";
import { TodoItem } from "./TodoItem";
import { Loader2, CheckCircle2, Clock, Inbox } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (todoId: number, isCompleted: boolean) => Promise<void>;
  onDelete: (todoId: number) => Promise<void>;
  onEdit: (todoId: number, title: string, description?: string) => Promise<void>;
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    x: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export function TodoList({ todos, isLoading, onToggle, onDelete, onEdit }: TodoListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full gradient-cyber opacity-20 blur-lg animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Loading your tasks...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 rounded-2xl gradient-cyber opacity-10 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 border border-border/50 mx-auto">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Create your first todo above to get started! You can also use the AI assistant to add tasks naturally.
        </p>
      </div>
    );
  }

  const completedTodos = todos.filter((todo) => todo.is_completed);
  const pendingTodos = todos.filter((todo) => !todo.is_completed);

  return (
    <div className="space-y-8">
      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-warning/10">
              <Clock className="h-3.5 w-3.5 text-warning" />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Pending
            </h3>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
              {pendingTodos.length}
            </span>
          </div>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {pendingTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  variants={itemVariants}
                  layout
                  exit="exit"
                >
                  <TodoItem
                    todo={todo}
                    isEditing={editingId === todo.id}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onStartEdit={() => setEditingId(todo.id)}
                    onCancelEdit={() => setEditingId(null)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-success/10">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Completed
            </h3>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
              {completedTodos.length}
            </span>
          </div>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {completedTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  variants={itemVariants}
                  layout
                  exit="exit"
                  className="opacity-70"
                >
                  <TodoItem
                    todo={todo}
                    isEditing={editingId === todo.id}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onStartEdit={() => setEditingId(todo.id)}
                    onCancelEdit={() => setEditingId(null)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}
