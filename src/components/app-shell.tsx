"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Hammer,
  ShieldCheck,
  FileText,
  History,
} from "lucide-react";
import { ModeToggles } from "@/components/mode-toggles";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/build", label: "Build", icon: Hammer },
  { href: "/validate", label: "Validate", icon: ShieldCheck },
  { href: "/docs", label: "Docs", icon: FileText },
  { href: "/history", label: "History", icon: History },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              href="/"
              className="mr-8 flex items-center gap-2 font-semibold tracking-tight"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background text-xs font-bold">
                II
              </div>
              <span className="hidden sm:inline">Interface Intelligence</span>
            </Link>
            <nav className="flex items-center gap-1" role="navigation" aria-label="Main">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              );
            })}
            </nav>
          </div>
          <ModeToggles />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            Built by{" "}
            <a
              href="https://github.com/mirabelledoiron"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Mirabelle Doiron
            </a>
          </p>
          <p>
            Powered by{" "}
            <a
              href="https://github.com/growthxai/output"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Output.ai
            </a>

            , an open-source AI workflow framework by GrowthX
          </p>
        </div>
      </footer>
    </div>
  );
}
