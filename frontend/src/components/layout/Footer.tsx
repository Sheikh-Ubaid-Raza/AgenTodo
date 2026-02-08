"use client";

import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin, ExternalLink, Cpu, Zap } from "lucide-react";

const productLinks = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Roadmap", href: "#roadmap" },
  { name: "Changelog", href: "#changelog" },
];

const resourceLinks = [
  { name: "Documentation", href: "#docs" },
  { name: "API Reference", href: "#api" },
  { name: "Integrations", href: "#integrations" },
  { name: "Status", href: "#status" },
];

const companyLinks = [
  { name: "About", href: "#about" },
  { name: "Blog", href: "#blog" },
  { name: "Careers", href: "#careers" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/40 bg-card/50">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-cyber opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-cyber shadow-cyber">
                <Sparkles className="h-5 w-5 text-cyber-dark-blue" />
              </div>
              <span className="text-xl font-bold gradient-text-cyber">
                AgenTodo
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              The AI-powered task management platform that helps you stay organized and productive with intelligent automation.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:shadow-cyber transition-all duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              {currentYear} AgenTodo. All rights reserved.
            </p>

            {/* Built with badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/30">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Built with</span>
              </div>
              <span className="text-xs font-medium gradient-text-cyber">
                Agentic Dev Stack
              </span>
              <Zap className="h-3.5 w-3.5 text-accent" />
            </div>

            {/* Legal links */}
            <div className="flex items-center gap-4">
              <Link
                href="#privacy"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#terms"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#cookies"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
