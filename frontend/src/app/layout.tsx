import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingChatWidget } from "@/components/chat/FloatingChatWidget";

export const metadata: Metadata = {
  title: {
    default: "AgenTodo - AI-Powered Task Management",
    template: "%s | AgenTodo",
  },
  description:
    "The intelligent task management platform powered by AI. Stay organized, boost productivity, and let AI help you manage your todos effortlessly.",
  keywords: [
    "todo",
    "task management",
    "AI",
    "productivity",
    "agentic",
    "automation",
    "MCP",
    "artificial intelligence",
  ],
  authors: [{ name: "AgenTodo Team" }],
  creator: "AgenTodo",
  publisher: "AgenTodo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agentodo.dev",
    siteName: "AgenTodo",
    title: "AgenTodo - AI-Powered Task Management",
    description:
      "The intelligent task management platform powered by AI. Stay organized, boost productivity, and let AI help you manage your todos effortlessly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgenTodo - AI-Powered Task Management",
    description:
      "The intelligent task management platform powered by AI. Stay organized, boost productivity, and let AI help you manage your todos effortlessly.",
    creator: "@agentodo",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1e3e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background antialiased font-sans">
        <AuthProvider>
          <div className="relative flex flex-col min-h-screen">
            {/* Background gradient effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-tertiary/5 rounded-full blur-3xl" />
            </div>

            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <FloatingChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
