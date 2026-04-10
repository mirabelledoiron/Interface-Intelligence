"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/section-card";
import { SeverityBadge } from "@/components/severity-badge";
import { GeneratingState } from "@/components/loading-states";
import { saveRun } from "@/lib/store";
import type { ValidateInput, ValidateResult, WorkflowRun } from "@/lib/types";
import { ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";

const sampleCode = `function IconButton({ icon, onClick }) {
  return (
    <button
      style={{
        backgroundColor: '#3b82f6',
        padding: '10px',
        borderRadius: '6px',
        fontWeight: 450,
      }}
      onClick={onClick}
      className="focus:outline-blue-500"
    >
      {icon}
    </button>
  );
}`;

export default function ValidatePage() {
  const [step, setStep] = useState<"input" | "generating" | "results">("input");
  const [input, setInput] = useState<ValidateInput>({
    code: "",
    description: "",
  });
  const [result, setResult] = useState<ValidateResult | null>(null);

  async function handleValidate() {
    setStep("generating");

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = (await response.json()) as ValidateResult;
      setResult(data);

      const run: WorkflowRun = {
        id: crypto.randomUUID(),
        workflowType: "validate",
        input,
        result: data,
        status: "complete",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      saveRun(run);

      setStep("results");
    } catch {
      setStep("input");
    }
  }

  function handleReset() {
    setStep("input");
    setResult(null);
    setInput({ code: "", description: "" });
  }

  function loadSample() {
    setInput({
      code: sampleCode,
      description: "Icon-only button component for a dashboard toolbar",
    });
  }

  const canSubmit = input.code.trim().length > 0;

  function getScoreColor(score: number): string {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-primary";
    return "text-destructive";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-secondary" aria-hidden="true" />
            Validate Code
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Check component code against your design system
          </p>
        </div>
        {step === "results" && (
          <Button variant="outline" onClick={handleReset}>
            New Validation
          </Button>
        )}
      </div>

      {step === "input" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Component Code</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadSample}
                  className="text-sm text-muted-foreground"
                >
                  Load sample
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Paste your component code
                </Label>
                <Textarea
                  id="code"
                  placeholder="Paste your React component code here..."
                  value={input.code}
                  onChange={(e) =>
                    setInput({ ...input, code: e.target.value })
                  }
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Context{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="What is this component for? (helps the validator understand intent)"
                  value={input.description}
                  onChange={(e) =>
                    setInput({ ...input, description: e.target.value })
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleValidate}
            disabled={!canSubmit}
            size="lg"
          >
            Validate Against System
          </Button>
        </div>
      )}

      {step === "generating" && (
        <GeneratingState workflow="validate" />
      )}

      {step === "results" && result && (
        <div
          className="space-y-4"
          role="region"
          aria-label="Validation results"
        >
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`text-4xl font-bold ${getScoreColor(result.score)}`}
                  >
                    {result.score}
                  </div>
                  <div>
                    <div className="font-medium">System Alignment Score</div>
                    <div className="text-sm text-muted-foreground">
                      {result.issues.filter((i) => i.severity === "error")
                        .length}{" "}
                      errors,{" "}
                      {result.issues.filter((i) => i.severity === "warning")
                        .length}{" "}
                      warnings,{" "}
                      {result.issues.filter((i) => i.severity === "info")
                        .length}{" "}
                      suggestions
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  {result.score >= 80 ? (
                    <CheckCircle className="h-8 w-8 text-secondary" aria-hidden="true" />
                  ) : (
                    <AlertCircle
                      className={`h-8 w-8 ${getScoreColor(result.score)}`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <SectionCard
            title="Summary"
            icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
            reasoning={result.reasoning}
          >
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </SectionCard>

          <SectionCard
            title={`Issues (${result.issues.length})`}
            icon={<AlertCircle className="h-4 w-4" aria-hidden="true" />}
            copyContent={result.issues
              .map(
                (i) =>
                  `[${i.severity.toUpperCase()}] ${i.rule}: ${i.message}\nSuggestion: ${i.suggestion}`
              )
              .join("\n\n")}
          >
            <div className="space-y-3">
              {result.issues.map((issue, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={issue.severity} />
                      <span className="text-sm font-medium text-muted-foreground">
                        {issue.rule}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">{issue.message}</p>
                  <div className="rounded bg-muted/50 p-2 text-sm text-muted-foreground">
                    <span className="font-medium">Suggestion:</span>{" "}
                    {issue.suggestion}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
