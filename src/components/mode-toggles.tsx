"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Leaf, Accessibility } from "lucide-react";

export function ModeToggles() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lowCarbon, setLowCarbon] = useState(false);
  const [a11y, setA11y] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (lowCarbon) {
      document.documentElement.classList.add("low-carbon");
    } else {
      document.documentElement.classList.remove("low-carbon");
    }
  }, [lowCarbon]);

  useEffect(() => {
    if (a11y) {
      document.documentElement.classList.add("a11y");
    } else {
      document.documentElement.classList.remove("a11y");
    }
  }, [a11y]);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="h-8 w-8 p-0"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLowCarbon(!lowCarbon)}
        className={`h-8 w-8 p-0 ${lowCarbon ? "text-primary bg-primary/10" : ""}`}
        aria-label={lowCarbon ? "Disable low carbon mode" : "Enable low carbon mode"}
        aria-pressed={lowCarbon}
      >
        <Leaf className="h-4 w-4" aria-hidden="true" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setA11y(!a11y)}
        className={`h-8 w-8 p-0 ${a11y ? "text-primary bg-primary/10" : ""}`}
        aria-label={a11y ? "Disable accessibility mode" : "Enable accessibility mode"}
        aria-pressed={a11y}
      >
        <Accessibility className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
