"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/section-card";
import { CodeBlock } from "@/components/code-block";
import { GeneratingState } from "@/components/loading-states";
import { sampleSystem } from "@/lib/sample-system";
import { saveRun } from "@/lib/store";
import type { DocsInput, DocsResult, WorkflowRun } from "@/lib/types";
import {
  FileText,
  BookOpen,
  Code,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function DocsPage() {
  const [step, setStep] = useState<"select" | "generating" | "results">(
    "select"
  );
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [result, setResult] = useState<DocsResult | null>(null);

  async function handleGenerate() {
    if (!selectedComponent) return;
    setStep("generating");

    const input: DocsInput = { componentName: selectedComponent };

    try {
      const response = await fetch("/api/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = (await response.json()) as DocsResult;
      setResult(data);

      const run: WorkflowRun = {
        id: crypto.randomUUID(),
        workflowType: "docs",
        input,
        result: data,
        status: "complete",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      saveRun(run);

      setStep("results");
    } catch {
      setStep("select");
    }
  }

  function handleReset() {
    setStep("select");
    setResult(null);
    setSelectedComponent("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
            Generate Docs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create system-grounded component documentation
          </p>
        </div>
        {step === "results" && (
          <Button variant="outline" onClick={handleReset}>
            New Documentation
          </Button>
        )}
      </div>

      {step === "select" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select a Component</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                role="radiogroup"
                aria-label="Select component to document"
              >
                {sampleSystem.components.map((comp) => (
                  <button
                    key={comp.name}
                    type="button"
                    onClick={() => setSelectedComponent(comp.name)}
                    role="radio"
                    aria-checked={selectedComponent === comp.name}
                    className={`text-left rounded-lg border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      selectedComponent === comp.name
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {comp.name}
                      </span>
                      <Badge variant="secondary" className="text-sm">
                        {comp.variants.length} variants
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {comp.description}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={!selectedComponent}
            size="lg"
          >
            Generate Documentation
          </Button>
        </div>
      )}

      {step === "generating" && (
        <GeneratingState workflow="docs" />
      )}

      {step === "results" && result && (
        <div
          className="space-y-4"
          role="region"
          aria-label="Documentation results"
        >
          <Badge variant="secondary" className="text-sm">
            {selectedComponent}
          </Badge>

          <SectionCard
            title="Overview"
            icon={<BookOpen className="h-4 w-4" aria-hidden="true" />}
            reasoning={result.reasoning}
            copyContent={result.overview}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.overview}
            </p>
          </SectionCard>

          <SectionCard
            title="Usage"
            icon={<Code className="h-4 w-4" aria-hidden="true" />}
            copyContent={result.usage}
          >
            <CodeBlock code={result.usage} />
          </SectionCard>

          <SectionCard
            title="Do / Don't"
            icon={<CheckCircle className="h-4 w-4" aria-hidden="true" />}
            copyContent={result.dosAndDonts
              .map((d) => `${d.type === "do" ? "DO" : "DON'T"}: ${d.text}`)
              .join("\n")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.dosAndDonts.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 rounded-md p-3 text-sm ${
                    item.type === "do"
                      ? "bg-secondary/10"
                      : "bg-destructive/10"
                  }`}
                >
                  {item.type === "do" ? (
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                  )}
                  <span className="text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Accessibility"
            icon={<Shield className="h-4 w-4" aria-hidden="true" />}
            copyContent={result.accessibilityNotes.join("\n")}
          >
            <ul className="space-y-2">
              {result.accessibilityNotes.map((note, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Shield
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary"
                    aria-hidden="true"
                  />
                  {note}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Complete Example"
            icon={<Code className="h-4 w-4" aria-hidden="true" />}
            copyContent={result.codeExample}
          >
            <CodeBlock code={result.codeExample} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
