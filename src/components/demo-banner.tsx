"use client";

import { useState, useEffect } from "react";
import { X, FlaskConical } from "lucide-react";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        if (!data.hasApiKey) setIsDemo(true);
      })
      .catch(() => setIsDemo(true));
  }, []);

  if (dismissed || !isDemo) return null;

  return (
    <div
      className="border-b border-border bg-muted/50 px-4 py-2"
      role="status"
      aria-label="Demo mode active"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-medium">Demo Mode.</span> Showing sample
            results. Add an Anthropic API key to enable live generation with
            Claude.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Dismiss demo mode banner"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
