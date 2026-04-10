# Interface Intelligence

AI-powered design system co-pilot. Build components, validate consistency, and generate documentation -- all grounded in your actual design system.

Author: Mirabelle Doiron
Domain: interface-intelligence.ai

## The Problem

Design systems exist in Figma, in code, and in documentation -- but AI tools ignore all of it. When teams use AI to generate UI, the output uses generic colors, arbitrary spacing, and misses accessibility requirements. The result: inconsistency, redundant work, and broken compliance.

Interface Intelligence makes AI system-aware. Instead of "generate a modal," you get "generate a modal using our tokens, following our patterns, meeting our WCAG level." Every output references your actual token names, explains why it chose them, and flags accessibility requirements.

That's the exact gap GrowthX fills for their clients -- they build the experience layer around AI agents. This product demonstrates that job.

## Context

Portfolio piece for the GrowthX AI Design Engineer application. Demonstrates designing and building the experience layer around an AI agent -- the exact role. Uses Output.ai workflow patterns. Built and deployed in a single session.

## Concept

Teams connect their tokens and components, then use guided workflows to build components, validate consistency, and generate documentation -- all grounded in their actual system. The AI doesn't generate from scratch. It generates within a system.

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Claude API via @anthropic-ai/sdk
- Output.ai workflow patterns (LiquidJS prompt templates, Zod schemas)
- localStorage for persistence
- Mock fallback for no-API-key viewers
- Deployed to Vercel

## Architecture

```
[Browser] -> [Next.js Frontend] -> [API Routes] -> [Claude API]
                                        |
                              mirrors Output.ai workflow
                              patterns: .prompt structure,
                              structured Zod schemas,
                              per-step execution
```

## Screens

### 1. System Dashboard (/)
- Design tokens overview with color swatches
- List of connected components with variant counts
- System health stats (token count, component count, WCAG target)
- Quick-launch buttons for the 3 workflows

### 2. Build Flow (/build)
- Step-by-step guided input: component type, context, constraints
- System tokens visible as reference panel
- Output: component structure, recommended tokens, API design, a11y notes
- Each output section is a card with copy actions
- Explains WHY each decision was made (reasoning panel)

### 3. Validate Flow (/validate)
- Paste code snippet or describe a component
- Output: alignment score (0-100), violations, suggestions, alternative patterns
- Severity badges (error/warning/info)
- Actionable suggestions referencing system tokens

### 4. Docs Generator (/docs)
- Select a component from system
- Generate: usage docs, do/don't guidelines, a11y notes, code examples
- Copy entire doc or individual sections

## Built on Output.ai

This project is built on the workflow patterns from [Output.ai](https://github.com/growthxai/output), GrowthX's open-source AI workflow framework.

### What Output.ai provides

Output.ai organizes AI prompts as version-controlled files instead of hardcoding them in application code. Each workflow is a self-contained folder with a `.prompt` file (instructions for the AI) and a `workflow.ts` file (typed schemas for input and output validation). This is the same structure GrowthX uses in production when building AI agents for clients like Lovable, Airbyte, and Augment.

### How this project uses it

The `/workflows` directory follows Output.ai's convention:

```
workflows/
  component-builder/
    build.prompt        # YAML frontmatter + Liquid template
    workflow.ts         # Zod input/output schemas
  system-validator/
    validate.prompt
    workflow.ts
  docs-generator/
    docs.prompt
    workflow.ts
```

Each `.prompt` file has two parts:
- **YAML frontmatter** at the top: which model to use, temperature, max tokens
- **Liquid template** below: the actual AI instructions with `{{ placeholders }}` for variables

### What happens when you click "Generate Component Spec"

1. The app reads `build.prompt` from the workflows directory
2. The prompt engine parses the YAML config (model, temperature)
3. LiquidJS fills in `{{ system_name }}` with "Mirabelle Design System"
4. LiquidJS fills in `{{ token_groups }}` with all `mirabelle-ds-*` token values
5. LiquidJS fills in `{{ component_type }}` with "Button" or "Card" or whatever was selected
6. The rendered prompt is sent to Claude via the Anthropic SDK
7. Claude responds with code that references the actual design system tokens
8. The response is validated and returned to the browser

The prompt engine (`src/lib/prompt-engine.ts`) handles steps 1-5. It mirrors the same loading pipeline that `@outputai/llm` uses internally: read file, parse YAML, render Liquid, extract system/user prompt pairs.

### What would change in production

In a production Output.ai deployment, these same workflow folders would gain:
- **Temporal orchestration** for durable execution with retry and replay
- **Step caching** so completed LLM calls are not repeated on re-runs
- **Tracing** with token counts, costs, and latency per step
- **Evals** for automated output quality scoring

The workflow structure, prompt files, and schemas are identical. The orchestration layer changes.

See [Output.ai on GitHub](https://github.com/growthxai/output) for the full framework documentation.

## Key UX Decisions

- **Guided flows, not blank prompts** -- progressive disclosure, step-by-step
- **System-aware outputs** -- references actual tokens, not generic advice
- **Transparent reasoning** -- every output explains which rules applied
- **Accessible from day one** -- keyboard nav, focus management, aria-live for async
- **Meaningful loading states** -- "Analyzing token structure..." not "Loading..."
- **Reduced motion support** -- respects prefers-reduced-motion

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Testing the Workflows

### Build Component (/build)
- Select a component type (e.g. Button)
- Enter a usage context (e.g. "settings dashboard for SaaS")
- Optionally add constraints and select WCAG level
- Click **Generate Component Spec**
- Results show: component structure, recommended tokens, API design, accessibility notes
- Each section has a "Why" button showing the AI's reasoning

### Validate Code (/validate)
- Click **Load sample** to populate with example code, or paste your own
- Click **Validate Against System**
- Results show: alignment score (0-100), issues by severity, and suggestions

### Generate Docs (/docs)
- Select a component from the Mirabelle Design System
- Click **Generate Documentation**
- Results show: overview, usage examples, do/don't guidelines, accessibility notes, complete code example

### Run History (/history)
- All workflow runs are saved to localStorage
- View past results and delete old runs

## AI Configuration

The app works in two modes:

**Mock mode (default):** Without an API key, all workflows return high-quality mock data with a simulated 2-second delay. This is how portfolio reviewers will experience the app.

**Live mode:** Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Restart the dev server. Workflows will call Claude and generate results grounded in the Mirabelle Design System tokens.

## Implementation Order

### Phase 0: Scaffold
- create-next-app, shadcn init, install deps

### Phase 1: Foundation
- Types (tokens, components, workflow schemas)
- Mock design tokens + sample system data
- localStorage store
- Prompt templates (3 workflows)
- Utility functions

### Phase 2: API Routes
- /api/build, /api/validate, /api/docs
- Claude integration with mock fallback

### Phase 3: Shared Components
- App shell / nav
- Token display panel
- Section card (collapsible with copy + reasoning)
- Severity badge
- Loading states with contextual messages

### Phase 4: Pages
- Dashboard (system overview + workflow launchers)
- Build flow (guided wizard + results)
- Validate flow (input + report)
- Docs generator (select + output)

### Phase 5: Theme + Polish
- Mirabelle Design System tokens as app theme
- Focus rings, aria-live regions
- Responsive breakpoints

### Phase 6: Deploy
- Git repo, push to GitHub
- Vercel deploy

## Project Structure

```
src/
  app/
    page.tsx              # Dashboard -- system overview + workflow launchers
    build/page.tsx        # Build workflow -- guided component generation
    validate/page.tsx     # Validate workflow -- code analysis
    docs/page.tsx         # Docs workflow -- documentation generation
    history/page.tsx      # Run history
    api/build/route.ts    # Build API -- loads .prompt, calls Claude
    api/validate/route.ts # Validate API
    api/docs/route.ts     # Docs API
  components/
    app-shell.tsx         # Navigation shell
    section-card.tsx      # Collapsible result card with copy + reasoning
    token-panel.tsx       # Design token reference panel
    code-block.tsx        # Copyable code display
    severity-badge.tsx    # Error/warning/info badges
    loading-states.tsx    # Skeleton loading with contextual messages
  lib/
    types.ts              # TypeScript types for all workflows
    sample-system.ts      # Mirabelle Design System tokens + components
    store.ts              # localStorage persistence
    prompt-engine.ts      # .prompt file loader (YAML + Liquid)
    mock-results.ts       # Mock data for no-API-key mode
    hooks.ts              # useReducedMotion hook
workflows/
  component-builder/
    build.prompt          # YAML frontmatter + Liquid template
    workflow.ts           # Zod schemas
  system-validator/
    validate.prompt
    workflow.ts
  docs-generator/
    docs.prompt
    workflow.ts
```

## Verification

- Run `npm run dev`, test all 3 workflows with mock data
- Test with real Claude API key
- Test keyboard navigation through all flows
- Test responsive at mobile/tablet/desktop
- Deploy to Vercel, verify production build

## Deploy

```bash
npm run build
vercel --prod
```
