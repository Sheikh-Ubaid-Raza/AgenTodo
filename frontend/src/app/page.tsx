"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Shield,
  Zap,
  Smartphone,
  Bot,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Protected with JWT authentication and industry-standard encryption",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Optimistic UI updates for seamless, real-time task management",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Responsive design that adapts perfectly to any device or screen",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: Bot,
    title: "AI-Powered",
    description: "Intelligent assistant with MCP tools for automated task management",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
  },
];

const highlights = [
  "Natural language task creation",
  "Smart task categorization",
  "Automated reminders",
  "Cross-device sync",
  "Priority intelligence",
  "Bulk operations via chat",
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
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

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/30 mb-8"
            >
              <Cpu className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Powered by Agentic AI
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium gradient-cyber text-cyber-dark-blue">
                NEW
              </span>
            </motion.div>

            {/* Logo Icon */}
            <motion.div
              variants={fadeInUp}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl gradient-cyber opacity-30 blur-2xl scale-150 animate-pulse" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl gradient-cyber shadow-cyber-lg">
                  <Sparkles className="h-10 w-10 text-cyber-dark-blue animate-float" />
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
            >
              <span className="text-foreground">Task Management</span>
              <br />
              <span className="gradient-text-cyber">Reimagined with AI</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Stay organized and boost productivity with our intelligent task platform.
              Let AI handle the complexity while you focus on what matters.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 gradient-cyber hover:opacity-90 text-cyber-dark-blue font-semibold shadow-cyber-lg btn-cyber group"
                asChild
              >
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-border/50 hover:border-primary/50 hover:shadow-cyber transition-all"
                asChild
              >
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
            </motion.div>

            {/* Highlights */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
            >
              {highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground bg-muted/50 border border-border/30"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  {highlight}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text-cyber">stay productive</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks effortlessly
              with the help of AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden glass-card border-border/30 shadow-elevated hover:shadow-elevated-xl transition-all duration-300 group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <CardHeader className="relative">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 border border-border/50 mb-4 group-hover:border-primary/30 transition-colors`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden glass-card border-border/30 shadow-cyber-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-tertiary/5 to-accent/5" />
              <CardContent className="relative p-8 sm:p-12">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  {/* AI Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-3xl gradient-cyber opacity-20 blur-xl scale-125 animate-pulse" />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl gradient-cyber shadow-cyber-glow">
                        <Bot className="h-12 w-12 text-cyber-dark-blue" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                      Your AI-Powered{" "}
                      <span className="gradient-text-cyber">Task Assistant</span>
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
                      Talk to our intelligent assistant naturally. Create tasks,
                      set priorities, and manage your entire workflow using simple
                      conversations. Powered by advanced MCP tools for seamless automation.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                        Natural Language
                      </span>
                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-tertiary/10 text-tertiary border border-tertiary/20">
                        MCP Integration
                      </span>
                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20">
                        Smart Automation
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to transform your{" "}
              <span className="gradient-text-cyber">productivity</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of users who have revolutionized their task management
              with AgenTodo.
            </p>
            <Button
              size="lg"
              className="text-lg px-10 py-6 gradient-cyber hover:opacity-90 text-cyber-dark-blue font-semibold shadow-cyber-lg btn-cyber group"
              asChild
            >
              <Link href="/auth/sign-up">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
