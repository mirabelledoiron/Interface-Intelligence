"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/section-card";
import { TokenPanel } from "@/components/token-panel";
import { CodeBlock } from "@/components/code-block";
import { GeneratingState } from "@/components/loading-states";
import { sampleSystem } from "@/lib/sample-system";
import { saveRun } from "@/lib/store";
import type { BuildInput, BuildResult, WorkflowRun } from "@/lib/types";
import {
  Hammer,
  Layers,
  Code,
  Shield,
  Palette,
} from "lucide-react";

const componentTypes = [
  "Button",
  "Card",
  "Input",
  "Badge",
  "Modal",
  "Select",
  "Tabs",
  "Toast",
  "Tooltip",
  "Table",
];

export default function BuildPage() {
  const [step, setStep] = useState<"input" | "generating" | "results">("input");
  const [input, setInput] = useState<BuildInput>({
    componentType: "",
    context: "",
    constraints: "",
    accessibilityLevel: "AA",
  });
  const [result, setResult] = useState<BuildResult | null>(null);

  async function handleGenerate() {
    setStep("generating");

    try {
      const response = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = (await response.json()) as BuildResult;
      setResult(data);

      const run: WorkflowRun = {
        id: crypto.randomUUID(),
        workflowType: "build",
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
    setInput({
      componentType: "",
      context: "",
      constraints: "",
      accessibilityLevel: "AA",
    });
  }

  const canSubmit = input.componentType && input.context;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Hammer className="h-6 w-6 text-primary" aria-hidden="true" />
            Build Component
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a system-grounded component specification
          </p>
        </div>
        {step === "results" && (
          <Button variant="outline" onClick={handleReset}>
            New Build
          </Button>
        )}
      </div>

      {step === "input" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Component Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="component-type">Component Type</Label>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Component type">
                    {componentTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setInput({ ...input, componentType: type })
                        }
                        className={`rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          input.componentType === type
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-accent"
                        }`}
                        role="radio"
                        aria-checked={input.componentType === type}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <Input
                    id="component-type"
                    placeholder="Or type a custom component name..."
                    value={
                      componentTypes.includes(input.componentType)
                        ? ""
                        : input.componentType
                    }
                    onChange={(e) =>
                      setInput({ ...input, componentType: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Usage Context</Label>
                  <Textarea
                    id="context"
                    placeholder="Where will this component be used? (e.g., 'settings dashboard for enterprise SaaS', 'checkout flow for e-commerce')"
                    value={input.context}
                    onChange={(e) =>
                      setInput({ ...input, context: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="constraints">
                    Constraints{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="constraints"
                    placeholder="Any specific requirements? (e.g., 'must support keyboard navigation', 'needs to work in a data table', 'must handle 100+ items')"
                    value={input.constraints}
                    onChange={(e) =>
                      setInput({ ...input, constraints: e.target.value })
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Accessibility Level</Label>
                  <div className="flex gap-2">
                    {(["AA", "AAA"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          setInput({ ...input, accessibilityLevel: level })
                        }
                        className={`rounded-md border px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          input.accessibilityLevel === level
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        WCAG {level}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleGenerate}
              disabled={!canSubmit}
              size="lg"
            >
              Generate Component Spec
            </Button>
          </div>

          <div className="lg:block">
            <div className="lg:sticky lg:top-20">
              <TokenPanel tokenGroups={sampleSystem.tokenGroups} />
            </div>
          </div>
        </div>
      )}

      {step === "generating" && (
        <GeneratingState workflow="build" />
      )}

      {step === "results" && result && (
        <div
          className="space-y-4"
          role="region"
          aria-label="Build results"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{input.componentType}</Badge>
            <span>in {input.context}</span>
            <Badge variant="outline" className="text-sm">
              WCAG {input.accessibilityLevel}
            </Badge>
          </div>

          <SectionCard
            title="Component Structure"
            icon={<Layers className="h-4 w-4" aria-hidden="true" />}
            reasoning={result.reasoning}
            copyContent={result.structure}
          >
            <CodeBlock code={result.structure} />
          </SectionCard>

          <SectionCard
            title="Recommended Tokens"
            icon={<Palette className="h-4 w-4" aria-hidden="true" />}
            copyContent={result.recommendedTokens
              .map((t) => `${t.token}: ${t.value}`)
              .join("\n")}
          >
            <div className="space-y-3">
              {result.recommendedTokens.map((token) => (
                <div
                  key={token.token}
                  className="flex items-start gap-3 rounded-md border border-border p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-medium">
                        {token.token}
                      </code>
                      <span className="text-sm text-muted-foreground">
                        {token.value}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {token.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="API Design"
            icon={<Code className="h-4 w-4" aria-hidden="true" />}
            copyContent={result.apiDesign}
          >
            <CodeBlock code={result.apiDesign} />
          </SectionCard>

          <SectionCard
            title="Accessibility Notes"
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
        </div>
      )}
    </div>
  );
}
