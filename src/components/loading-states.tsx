"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const messages: Record<string, string[]> = {
  build: [
    "Analyzing design tokens...",
    "Mapping component patterns...",
    "Checking accessibility requirements...",
    "Generating component structure...",
  ],
  validate: [
    "Parsing component code...",
    "Checking token adherence...",
    "Evaluating accessibility compliance...",
    "Generating validation report...",
  ],
  docs: [
    "Reading component definition...",
    "Analyzing usage patterns...",
    "Generating documentation...",
    "Writing code examples...",
  ],
};

export function GeneratingState({
  workflow,
}: {
  workflow: "build" | "validate" | "docs";
}) {
  const workflowMessages = messages[workflow];

  return (
    <div className="space-y-4" role="status" aria-label="Generating results">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span>
          {workflowMessages[Math.floor(Math.random() * workflowMessages.length)]}
        </span>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <span className="sr-only">
        Generating results. Please wait.
      </span>
    </div>
  );
}
