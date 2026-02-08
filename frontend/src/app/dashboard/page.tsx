"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  ListTodo,
  Loader2,
  Target,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
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

  return (
    <div className="min-h-screen py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Welcome Section */}
          <motion.div variants={fadeIn} className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full gradient-cyber opacity-30 blur-md" />
                <Avatar className="h-14 w-14 border-2 border-primary/30 shadow-cyber">
                  <AvatarFallback className="bg-gradient-cyber text-cyber-dark-blue text-lg font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back
                  {user?.name ? (
                    <span className="gradient-text-cyber">, {user.name}</span>
                  ) : (
                    ""
                  )}
                </h1>
                <p className="text-muted-foreground">
                  Ready to tackle your tasks? Let&apos;s make today productive.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={fadeIn}
            className="grid gap-4 md:grid-cols-3 mb-8"
          >
            <Card className="glass-card border-border/30 shadow-elevated hover:shadow-elevated-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Tasks
                    </p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Target className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/30 shadow-elevated hover:shadow-elevated-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-success">0</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success group-hover:bg-success/20 transition-colors">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/30 shadow-elevated hover:shadow-elevated-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Pending
                    </p>
                    <p className="text-3xl font-bold text-warning">0</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning group-hover:bg-warning/20 transition-colors">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quick Actions Card */}
            <motion.div variants={fadeIn}>
              <Card className="glass-card border-border/30 shadow-elevated-xl h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-cyber shadow-cyber">
                      <Sparkles className="h-5 w-5 text-cyber-dark-blue" />
                    </div>
                    <div>
                      <CardTitle>Your Todo Journey</CardTitle>
                      <CardDescription>
                        Start organizing your tasks efficiently
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Create, manage, and complete tasks with ease. Use our
                    AI-powered assistant to help you stay on track.
                  </p>
                  <Button
                    className="w-full gradient-cyber text-cyber-dark-blue font-semibold shadow-cyber btn-cyber group"
                    asChild
                  >
                    <Link href="/dashboard/todos">
                      <ListTodo className="mr-2 h-4 w-4" />
                      Go to My Todos
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Assistant Card */}
            <motion.div variants={fadeIn}>
              <Card className="relative overflow-hidden glass-card border-border/30 shadow-elevated-xl h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-xl gradient-cyber opacity-30 blur-md" />
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl gradient-cyber shadow-cyber">
                        <Bot className="h-5 w-5 text-cyber-dark-blue" />
                      </div>
                    </div>
                    <div>
                      <CardTitle>AI Assistant</CardTitle>
                      <CardDescription>
                        Your intelligent task companion
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Click the chat bubble in the bottom right corner to interact
                    with your AI assistant. Create tasks, get suggestions, and
                    manage your todos naturally.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      &quot;Add a task&quot;
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-tertiary/10 text-tertiary border border-tertiary/20">
                      &quot;Show my todos&quot;
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                      &quot;Complete task&quot;
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Card */}
            <motion.div variants={fadeIn} className="lg:col-span-2">
              <Card className="glass-card border-border/30 shadow-elevated">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/30 shadow-cyber">
                      <AvatarFallback className="bg-gradient-cyber text-cyber-dark-blue text-xl font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() ||
                          user?.email?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-lg font-semibold">
                        {user?.name || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          Active
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Member since today
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/">Back to Home</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
