/**
 * Docs Generator Workflow
 *
 * Mirrors Output.ai's workflow pattern.
 * In production: Temporal orchestration, tracing, cached steps.
 */

import { z } from "zod";

export const inputSchema = z.object({
  componentName: z.string().min(1),
});

export const outputSchema = z.object({
  overview: z.string(),
  usage: z.string(),
  dosAndDonts: z.array(
    z.object({
      type: z.enum(["do", "dont"]),
      text: z.string(),
    })
  ),
  accessibilityNotes: z.array(z.string()),
  codeExample: z.string(),
  reasoning: z.string(),
});

export type DocsWorkflowInput = z.infer<typeof inputSchema>;
export type DocsWorkflowOutput = z.infer<typeof outputSchema>;

export const workflow = {
  name: "docs-generator",
  promptFile: "docs.prompt",
  inputSchema,
  outputSchema,
};
