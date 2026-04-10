/**
 * Component Builder Workflow
 *
 * Mirrors Output.ai's workflow pattern:
 * - Zod schema for input/output validation
 * - Self-contained folder with .prompt file
 * - Step-based execution
 *
 * In production with Output.ai, this would be orchestrated by Temporal
 * with automatic tracing, caching, and retry. This prototype uses the
 * same prompt and workflow structure.
 */

import { z } from "zod";

export const inputSchema = z.object({
  componentType: z.string().min(1),
  context: z.string().min(1),
  constraints: z.string().default(""),
  accessibilityLevel: z.enum(["AA", "AAA"]).default("AA"),
});

export const outputSchema = z.object({
  structure: z.string(),
  recommendedTokens: z.array(
    z.object({
      token: z.string(),
      value: z.string(),
      reason: z.string(),
    })
  ),
  apiDesign: z.string(),
  accessibilityNotes: z.array(z.string()),
  reasoning: z.string(),
});

export type BuildWorkflowInput = z.infer<typeof inputSchema>;
export type BuildWorkflowOutput = z.infer<typeof outputSchema>;

export const workflow = {
  name: "component-builder",
  promptFile: "build.prompt",
  inputSchema,
  outputSchema,
};
