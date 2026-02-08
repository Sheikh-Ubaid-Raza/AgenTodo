"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { todoService, Todo } from "@/services/todo-service";
import { TodoList } from "@/components/todos/TodoList";
import { TodoForm } from "@/components/todos/TodoForm";
import { onTasksInvalidated } from "@/lib/task-events";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Target,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function TodosPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    const response = await todoService.getTodos(user.id);

    if (response.error) {
      setError(response.error.detail);
    } else if (response.data) {
      setTodos(response.data);
    }

    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    if (isAuthenticated && user?.id) {
      fetchTodos();
    }
  }, [isAuthenticated, authLoading, router, user?.id, fetchTodos]);

  // Auto-refetch when the chatbot modifies tasks via MCP tools
  useEffect(() => {
    const unsubscribe = onTasksInvalidated(() => {
      fetchTodos();
    });
    return unsubscribe;
  }, [fetchTodos]);

  const handleCreateTodo = async (title: string, description?: string) => {
    if (!user?.id) return;

    // Optimistic update
    const tempId = Date.now();
    const optimisticTodo: Todo = {
      id: tempId,
      title,
      description: description || null,
      is_completed: false,
      created_at: new Date().toISOString(),
    };
    setTodos((prev) => [optimisticTodo, ...prev]);

    const response = await todoService.createTodo(user.id, {
      title,
      description,
    });

    if (response.error) {
      // Revert optimistic update
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
      setError(response.error.detail);
    } else if (response.data) {
      // Replace optimistic todo with real one
      setTodos((prev) =>
        prev.map((t) => (t.id === tempId ? response.data! : t))
      );
    }
  };

  const handleToggleTodo = async (todoId: number, isCompleted: boolean) => {
    if (!user?.id) return;

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, is_completed: isCompleted } : t))
    );

    const response = await todoService.toggleTodo(user.id, todoId, isCompleted);

    if (response.error) {
      // Revert optimistic update
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todoId ? { ...t, is_completed: !isCompleted } : t
        )
      );
      setError(response.error.detail);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!user?.id) return;

    // Store for rollback
    const deletedTodo = todos.find((t) => t.id === todoId);

    // Optimistic update
    setTodos((prev) => prev.filter((t) => t.id !== todoId));

    const response = await todoService.deleteTodo(user.id, todoId);

    if (response.error) {
      // Revert optimistic update
      if (deletedTodo) {
        setTodos((prev) => [...prev, deletedTodo]);
      }
      setError(response.error.detail);
    }
  };

  const handleEditTodo = async (
    todoId: number,
    title: string,
    description?: string
  ) => {
    if (!user?.id) return;

    // Store for rollback
    const originalTodo = todos.find((t) => t.id === todoId);

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todoId ? { ...t, title, description: description || null } : t
      )
    );

    const response = await todoService.updateTodo(user.id, todoId, {
      title,
      description,
    });

    if (response.error) {
      // Revert optimistic update
      if (originalTodo) {
        setTodos((prev) => prev.map((t) => (t.id === todoId ? originalTodo : t)));
      }
      setError(response.error.detail);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full gradient-cyber opacity-20 blur-xl animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const completedCount = todos.filter((t) => t.is_completed).length;
  const pendingCount = todos.filter((t) => !t.is_completed).length;

  return (
    <div className="min-h-screen py-8">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Breadcrumb */}
          <motion.div variants={fadeIn} className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="pl-0 text-muted-foreground hover:text-foreground"
            >
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeIn} className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              My <span className="gradient-text-cyber">Todos</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your tasks and stay organized
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeIn}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <Card className="glass-card border-border/30 shadow-elevated hover:shadow-elevated-xl transition-all duration-300 group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Total
                    </p>
                    <p className="text-2xl font-bold">{todos.length}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Target className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/30 shadow-elevated hover:shadow-elevated-xl transition-all duration-300 group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-warning">
                      {pendingCount}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning group-hover:bg-warning/20 transition-colors">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/30 shadow-elevated hover:shadow-elevated-xl transition-all duration-300 group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-success">
                      {completedCount}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success group-hover:bg-success/20 transition-colors">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert
                variant="destructive"
                className="border-destructive/50 bg-destructive/10"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Refresh Button */}
          <motion.div variants={fadeIn} className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTodos}
              disabled={isLoading}
              className="border-border/50 hover:border-primary/50 hover:shadow-cyber transition-all"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </motion.div>

          {/* Todo Form */}
          <motion.div variants={fadeIn}>
            <Card className="mb-6 glass-card border-border/30 shadow-elevated-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 pointer-events-none" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-cyber shadow-cyber">
                    <Plus className="h-4 w-4 text-cyber-dark-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Add New Todo</CardTitle>
                    <CardDescription>
                      Create a new task to stay organized
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <TodoForm onSubmit={handleCreateTodo} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Todo List */}
          <motion.div variants={fadeIn}>
            <Card className="glass-card border-border/30 shadow-elevated-xl">
              <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
                <CardDescription>
                  {todos.length > 0
                    ? `You have ${pendingCount} pending and ${completedCount} completed tasks`
                    : "No tasks yet. Add your first task above!"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TodoList
                  todos={todos}
                  isLoading={isLoading}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
