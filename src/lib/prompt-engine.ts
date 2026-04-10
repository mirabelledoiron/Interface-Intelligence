/**
 * Prompt Engine
 *
 * Loads and renders .prompt files following Output.ai's format:
 * - YAML frontmatter (provider, model, temperature, etc.)
 * - Liquid template body with <system> and <user> tags
 *
 * This mirrors @outputai/llm's prompt loading pipeline.
 * In production, Output.ai handles this via its generateText() function.
 */

import { Liquid } from "liquidjs";
import fs from "fs";
import path from "path";

const liquid = new Liquid();

export interface PromptConfig {
  provider: string;
  model: string;
  temperature: number;
  max_tokens: number;
  description?: string;
  tags?: string[];
}

export interface RenderedPrompt {
  config: PromptConfig;
  system: string;
  user: string;
}

function parseFrontmatter(raw: string): { frontmatter: string; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: "", body: raw };
  }
  return { frontmatter: match[1], body: match[2] };
}

function parseYaml(yaml: string): PromptConfig {
  const config: Record<string, unknown> = {};
  let currentKey = "";
  let multilineValue = "";
  let inMultiline = false;

  for (const line of yaml.split("\n")) {
    if (inMultiline) {
      if (line.startsWith("  ")) {
        multilineValue += line.trim() + " ";
        continue;
      } else {
        config[currentKey] = multilineValue.trim();
        inMultiline = false;
      }
    }

    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (value === ">") {
        currentKey = key;
        multilineValue = "";
        inMultiline = true;
      } else if (value.startsWith("[") || value.startsWith("-")) {
        // Skip array parsing for simplicity
        config[key] = value;
      } else {
        const num = Number(value);
        config[key] = isNaN(num) ? value : num;
      }
    }
  }

  if (inMultiline) {
    config[currentKey] = multilineValue.trim();
  }

  return {
    provider: (config.provider as string) ?? "anthropic",
    model: (config.model as string) ?? "claude-sonnet-4-20250514",
    temperature: (config.temperature as number) ?? 0.3,
    max_tokens: (config.max_tokens as number) ?? 4096,
    description: config.description as string | undefined,
  };
}

function extractTag(body: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i");
  const match = body.match(regex);
  return match ? match[1].trim() : "";
}

export async function loadPrompt(
  workflowName: string,
  promptFile: string,
  variables: Record<string, unknown>
): Promise<RenderedPrompt> {
  const promptPath = path.join(
    process.cwd(),
    "workflows",
    workflowName,
    promptFile
  );

  const raw = fs.readFileSync(promptPath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const config = parseYaml(frontmatter);

  const rendered = await liquid.parseAndRender(body, variables);

  const system = extractTag(rendered, "system");
  const user = extractTag(rendered, "user");

  return { config, system, user };
}
