# Workflows

This directory follows Output.ai's workflow convention. Each workflow is a self-contained folder with:

- **workflow.ts** -- Zod schemas for input/output validation and workflow metadata
- **.prompt file** -- YAML frontmatter (provider, model, temperature) + Liquid template body

## How it works

1. API route receives a request and validates input against the workflow's Zod schema
2. The prompt engine loads the `.prompt` file, parses YAML config, and renders the Liquid template with input variables + design system context
3. The rendered prompt is sent to the configured LLM provider
4. The response is validated against the output schema

## Production with Output.ai

In a production Output.ai deployment, these workflows would gain:

- **Temporal orchestration** -- durable execution with automatic retry and replay
- **Step caching** -- completed steps are cached, so re-runs skip expensive LLM calls
- **Tracing** -- every prompt/response pair is logged with token counts, costs, and latency
- **Evals** -- LLM-as-judge evaluation for output quality scoring
- **Multi-step pipelines** -- workflows can chain multiple steps (e.g., generate then validate then refine)

The workflow structure, prompt files, and schemas are identical. The orchestration layer changes.
