"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { LogOut, User, LayoutDashboard, ListTodo, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-cyber shadow-cyber group-hover:shadow-cyber-lg transition-shadow duration-300">
              <Sparkles className="h-5 w-5 text-cyber-dark-blue" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text-cyber">
                AgenTodo
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">
                AI-Powered Tasks
              </span>
            </div>
          </Link>

          {/* Navigation */}
          {showNav && isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 text-sm font-medium transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/todos"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 text-sm font-medium transition-all duration-200"
              >
                <ListTodo className="h-4 w-4" />
                My Todos
              </Link>
            </nav>
          )}

          {/* User section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border border-border/50 hover:border-primary/50 hover:shadow-cyber transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-cyber text-cyber-dark-blue font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() ||
                          user?.email?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 glass-card border-border/50 shadow-cyber-lg"
                >
                  <div className="p-3 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-cyber text-cyber-dark-blue font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() ||
                            user?.email?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {user?.name || user?.email?.split("@")[0]}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile navigation items */}
                  <div className="md:hidden py-2">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/todos" className="flex items-center gap-2">
                        <ListTodo className="h-4 w-4" />
                        My Todos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>

                  <div className="py-2">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <Link href="/auth/sign-in">Sign in</Link>
                </Button>
                <Button
                  size="sm"
                  className="gradient-cyber hover:opacity-90 text-cyber-dark-blue font-semibold shadow-cyber btn-cyber"
                  asChild
                >
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
