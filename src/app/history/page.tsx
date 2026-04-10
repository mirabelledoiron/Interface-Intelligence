"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllRuns, deleteRun } from "@/lib/store";
import type { WorkflowRun, BuildInput, ValidateInput, DocsInput } from "@/lib/types";
import { History, Hammer, ShieldCheck, FileText, Trash2 } from "lucide-react";

const workflowConfig = {
  build: {
    icon: Hammer,
    label: "Build",
    color: "bg-primary/10 text-primary",
    href: "/build",
  },
  validate: {
    icon: ShieldCheck,
    label: "Validate",
    color: "bg-secondary/10 text-secondary",
    href: "/validate",
  },
  docs: {
    icon: FileText,
    label: "Docs",
    color: "bg-muted text-muted-foreground",
    href: "/docs",
  },
};

function getRunLabel(run: WorkflowRun): string {
  switch (run.workflowType) {
    case "build":
      return (run.input as BuildInput).componentType || "Component";
    case "validate":
      return (
        (run.input as ValidateInput).description || "Code validation"
      );
    case "docs":
      return (run.input as DocsInput).componentName || "Documentation";
    default:
      return "Workflow";
  }
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export default function HistoryPage() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);

  useEffect(() => {
    setRuns(getAllRuns());
  }, []);

  function handleDelete(id: string) {
    deleteRun(id);
    setRuns(getAllRuns());
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <History className="h-6 w-6" aria-hidden="true" />
          Run History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Past workflow runs and their results
        </p>
      </div>

      {runs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <History
              className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground mb-4">
              No runs yet. Launch a workflow to get started.
            </p>
            <div className="flex justify-center gap-2">
              <Link href="/build">
                <Button variant="outline" size="sm">
                  Build
                </Button>
              </Link>
              <Link href="/validate">
                <Button variant="outline" size="sm">
                  Validate
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="sm">
                  Docs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {runs.map((run) => {
            const config = workflowConfig[run.workflowType];
            const Icon = config.icon;
            return (
              <Card key={run.id} className="group">
                <CardContent className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge
                      variant="secondary"
                      className={`gap-1 text-sm shrink-0 ${config.color}`}
                    >
                      <Icon className="h-3 w-3" aria-hidden="true" />
                      {config.label}
                    </Badge>
                    <span className="text-sm font-medium truncate">
                      {getRunLabel(run)}
                    </span>
                    <span className="text-sm text-muted-foreground shrink-0">
                      {formatTime(run.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={
                        run.status === "complete" ? "secondary" : "destructive"
                      }
                      className="text-sm"
                    >
                      {run.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(run.id)}
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      aria-label={`Delete ${getRunLabel(run)} run`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
