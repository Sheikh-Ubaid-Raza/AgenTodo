"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface TodoFormProps {
  onSubmit: (title: string, description?: string) => Promise<void>;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onSubmit(title, description || undefined);
    setTitle("");
    setDescription("");
    setShowDescription(false);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm placeholder:text-muted-foreground/60 transition-all"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="px-5 py-3 gradient-cyber text-cyber-dark-blue font-semibold rounded-xl shadow-cyber hover:shadow-cyber-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all btn-cyber"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowDescription(!showDescription)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showDescription ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          {showDescription ? "Hide description" : "Add description"}
        </button>
      </div>

      <AnimatePresence>
        {showDescription && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none text-sm placeholder:text-muted-foreground/60 transition-all"
              rows={3}
              disabled={isSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
