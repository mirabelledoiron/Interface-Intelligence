# Design Engineering at the AI Interface Layer

## Part A: My Story

I have spent the last eight years working at the seam between design and engineering. Not as a designer who hands off specs. Not as an engineer who receives them. As someone who owns both sides and ships the thing in between.

At Indeed, I owned the token architecture and component API for a React library serving 12 million monthly users. That meant defining how color, spacing, and typography scaled across job seeker and employer products without forking the codebase. It meant building a contribution model that let five product teams ship on-brand without routing every decision through my team. And it meant raising WCAG compliance from 78% to 96% through systematic automation, not one-off audits.

The part that changed how I work was AI tooling. I built custom MCP servers that cut component scaffolding from three days to four hours. I created a RAG-powered documentation assistant that indexed 500+ pages of component guidance and reduced support tickets by 40%. These were not side projects. They shipped to production, and teams adopted them because they solved real problems.

After Indeed, I worked with Osea Malibu building AI content agents that automated copy across 200+ product SKUs while preserving brand voice. That experience taught me something important: the AI output is only as good as the structure around it. Raw generation without constraints produces content that looks right and is wrong in ways that only surface after someone tries to use it. The fix is not better prompts. It is better systems.

That insight is what draws me to this role at GrowthX.

I think about design engineering as building the layer where systems meet users. A design token is useless until a component consumes it. A component is useless until someone interacts with it. An AI agent is useless until someone can review, edit, and act on its output. Every level needs an interface, and every interface needs someone who understands both the system underneath and the person on the other side.

The work at GrowthX sits exactly at this intersection. You build AI agents that produce structured output for B2B companies. Someone needs to turn that output into products that people actually use. Not by making it look nice. By making decisions about information hierarchy, progressive disclosure, interaction patterns, and accessibility that determine whether the output gets used or ignored.

That is the work I want to do. Not because it is trendy. Because it is the specific combination of skills I have been building for eight years, and I have not found another role that values all of them at once.

## Part B: A Product Built with Output.ai

### The Problem

Design systems exist in multiple places: Figma files, code repositories, documentation sites, Storybook instances. When teams use AI to generate UI, the AI ignores all of it. It produces components with hard-coded colors instead of tokens, arbitrary spacing instead of scale values, and no awareness of accessibility requirements. The result is inconsistency that compounds with every AI-assisted commit.

This is not a tooling problem. It is a context problem. The AI has no knowledge of your system.

### The Product: Interface Intelligence

Interface Intelligence is a design system co-pilot that makes AI generation system-aware. Instead of prompting freely and hoping the output aligns, teams interact with structured workflows that inject their actual design tokens, component patterns, and accessibility requirements into every AI call.

I built a working prototype to demonstrate the concept: [interface-intelligence.ai](https://interface-intelligence.ai)

### How It Works with Output.ai

The prototype is built on Output.ai's workflow patterns. Each of the three workflows follows Output.ai's convention:

**Workflow structure:** Each workflow lives in a self-contained folder with a `.prompt` file (YAML frontmatter for model configuration, Liquid templates for variable injection) and a `workflow.ts` file (Zod schemas for input/output validation). This is the same structure used in production Output.ai deployments.

**Token injection:** When a user runs a workflow, the prompt engine loads the `.prompt` file from disk, parses the YAML configuration, and renders the Liquid template with the team's actual design tokens. Claude receives a prompt that includes every token name, value, and description from the connected design system. The output references those specific tokens, not generic CSS values.

**Three workflows, three interfaces:**

The **Build** workflow takes a component type, usage context, and accessibility level as input. It generates a component specification with TypeScript interfaces, recommended tokens with explanations for each choice, implementation code using class-variance-authority, and specific accessibility notes citing WCAG success criteria. The token panel sits alongside the form so users can reference their system while defining constraints.

The **Validate** workflow accepts a code snippet and checks it against the design system. It returns a 0-100 alignment score, a list of issues sorted by severity (errors, warnings, suggestions), and actionable fixes that reference the specific tokens the code should use instead of hard-coded values. The severity badges make it immediately clear what needs attention.

The **Docs** workflow generates comprehensive component documentation from a system definition. It produces an overview, usage examples with real code, do/don't guidelines based on common misuse patterns, accessibility requirements, and a complete implementation example. Every recommendation is grounded in the connected system's tokens and patterns.

### Design Decisions

**Guided flows instead of a blank prompt box.** Most AI tools give you a text field and hope you know what to ask. Interface Intelligence uses structured inputs with clear fields, selectable options, and visible constraints. This produces better AI output because the prompt is constructed from specific, validated data rather than freeform text.

**Transparency over magic.** Every output section includes a "Why" button that reveals the AI's reasoning. Users can see which system rules informed the output and why specific tokens were recommended. This builds trust and helps teams learn their own system.

**Offline-first with graceful degradation.** The app works fully without an API key, serving high-quality mock data. This means portfolio reviewers, team members without API access, and offline users all get the full experience. When a key is configured, the same interface generates live results.

**Accessibility as a feature, not a checkbox.** The app includes a dedicated accessibility mode that increases base font size, strengthens contrast ratios, widens focus rings, and underlines all links. A low-carbon mode strips shadows, animations, and heavy rendering. These are not afterthoughts. They demonstrate that the system practices what it preaches about accessible, considered interfaces.

### What This Would Look Like in Production

The prototype mirrors Output.ai's patterns but runs as a standalone Next.js app. In a production deployment, the workflows would gain Temporal orchestration for durable execution with automatic retry, step caching to skip expensive LLM calls on re-runs, full tracing with token counts and cost tracking, and LLM-as-judge evaluations for output quality scoring.

The workflow structure, prompt files, and schemas would transfer directly. The orchestration layer changes; the product experience stays the same.

### Who This Is For

Design engineers and frontend teams who use AI to build UI but need it to respect their system. Teams scaling design systems across multiple products. Organizations where consistency and accessibility compliance are requirements, not aspirations.

The core insight is simple: AI should not generate UI from scratch. It should generate UI within a system. That requires structured knowledge, clear constraints, and intent-aware outputs. That is exactly what Output.ai enables, and Interface Intelligence is the experience layer that makes it usable.
