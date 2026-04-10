"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Hammer,
  ShieldCheck,
  FileText,
  ArrowRight,
  Layers,
  Palette,
  Type,
  Square,
  Workflow,
  Braces,
  FileCode,
  Zap,
} from "lucide-react";
import { sampleSystem } from "@/lib/sample-system";

const workflows = [
  {
    href: "/build",
    title: "Build Component",
    description:
      "Generate a component spec grounded in your tokens, patterns, and accessibility requirements.",
    icon: Hammer,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    href: "/validate",
    title: "Validate Code",
    description:
      "Check component code against your system for token adherence, consistency, and a11y compliance.",
    icon: ShieldCheck,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    href: "/docs",
    title: "Generate Docs",
    description:
      "Create comprehensive documentation with usage examples, do/don't guidelines, and a11y notes.",
    icon: FileText,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
];

const tokenIcons: Record<string, React.ElementType> = {
  Colors: Palette,
  "Dark Mode": Palette,
  Spacing: Layers,
  Typography: Type,
  Radius: Square,
  Shadows: Layers,
};

export default function DashboardPage() {
  const system = sampleSystem;
  const totalTokens = system.tokenGroups.reduce(
    (sum, g) => sum + g.tokens.length,
    0
  );

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Interface Intelligence
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
          AI-powered design system co-pilot. Build components, validate
          consistency, and generate documentation, all grounded in your actual
          design system. AI should not generate from scratch. It should generate within
          your system.
        </p>
      </div>

      {/* How it works */}
      <section aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-lg font-medium mb-2">
          Powered by Output.ai
        </h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          Interface Intelligence is built on Output.ai, an open-source AI
          workflow framework by GrowthX. Each workflow uses version-controlled
          .prompt files with Liquid templates, Zod-validated schemas, and
          structured step execution, the same patterns used in production
          Output.ai deployments.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">.prompt Files</span>
              </div>
              <p className="text-sm text-muted-foreground">
                YAML frontmatter for model config + Liquid templates for
                variable injection. Version-controlled and reviewable in PRs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 mb-2">
                <Braces className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Zod Schemas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Every workflow input and output is typed and validated.
                Structured data in, structured data out. No guessing.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Token Injection</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your design tokens are injected into every prompt at runtime.
                The AI references your actual values, not generic ones.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 mb-2">
                <Workflow className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Step Execution</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Each workflow runs as isolated steps. In production with
                Output.ai, these gain Temporal orchestration, tracing, and
                caching.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* System Overview */}
      <section aria-labelledby="system-heading">
        <h2 id="system-heading" className="text-lg font-medium mb-4">
          {system.name}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="text-2xl font-semibold">{totalTokens}</div>
              <div className="text-sm text-muted-foreground">Design Tokens</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="text-2xl font-semibold">
                {system.components.length}
              </div>
              <div className="text-sm text-muted-foreground">Components</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="text-2xl font-semibold">
                {system.tokenGroups.length}
              </div>
              <div className="text-sm text-muted-foreground">Token Groups</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="text-2xl font-semibold">AA</div>
              <div className="text-sm text-muted-foreground">WCAG Target</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Token Groups */}
      <section aria-labelledby="tokens-heading">
        <h2 id="tokens-heading" className="text-lg font-medium mb-4">
          Token Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {system.tokenGroups.map((group) => {
            const Icon = tokenIcons[group.name] ?? Layers;
            return (
              <Card key={group.name} className="overflow-hidden">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {group.name}
                    </span>
                    <Badge variant="secondary" className="text-sm">
                      {group.tokens.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {group.tokens.slice(0, 6).map((token) => (
                      <div
                        key={token.name}
                        className="flex items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5"
                      >
                        {token.type === "color" && (
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-sm border border-border"
                            style={{ backgroundColor: token.value }}
                            aria-hidden="true"
                          />
                        )}
                        <span className="text-sm font-mono text-muted-foreground">
                          {token.name}
                        </span>
                      </div>
                    ))}
                    {group.tokens.length > 6 && (
                      <span className="text-sm text-muted-foreground px-1.5 py-0.5">
                        +{group.tokens.length - 6} more
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Workflows */}
      <section aria-labelledby="workflows-heading">
        <h2 id="workflows-heading" className="text-lg font-medium mb-4">
          Workflows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflows.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group block">
                <Card className="h-full transition-colors hover:border-foreground/20">
                  <CardHeader className="pb-2">
                    <div
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${item.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium mb-1 flex items-center gap-1">
                      {item.title}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Components */}
      <section aria-labelledby="components-heading">
        <h2 id="components-heading" className="text-lg font-medium mb-4">
          Components
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {system.components.map((comp) => (
            <Card key={comp.name}>
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{comp.name}</span>
                  <Badge variant="secondary" className="text-sm">
                    {comp.variants.length} variants
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {comp.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
