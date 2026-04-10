/**
 * System Validator Workflow
 *
 * Mirrors Output.ai's workflow pattern.
 * In production: Temporal orchestration, tracing, cached steps.
 */

import { z } from "zod";

export const inputSchema = z.object({
  code: z.string().min(1),
  description: z.string().optional(),
});

export const outputSchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      severity: z.enum(["error", "warning", "info"]),
      rule: z.string(),
      message: z.string(),
      suggestion: z.string(),
    })
  ),
  summary: z.string(),
  reasoning: z.string(),
});

export type ValidateWorkflowInput = z.infer<typeof inputSchema>;
export type ValidateWorkflowOutput = z.infer<typeof outputSchema>;

export const workflow = {
  name: "system-validator",
  promptFile: "validate.prompt",
  inputSchema,
  outputSchema,
};
