import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadPrompt } from "@/lib/prompt-engine";
import { sampleSystem } from "@/lib/sample-system";
import { mockValidateResult } from "@/lib/mock-results";
import { inputSchema } from "../../../../workflows/system-validator/workflow";
import type { ValidateResult } from "@/lib/types";

export async function POST(request: Request) {
  const raw = await request.json();
  const input = inputSchema.parse(raw);

  if (!process.env.ANTHROPIC_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return NextResponse.json(mockValidateResult);
  }

  let prompt;
  try {
    prompt = await loadPrompt("system-validator", "validate.prompt", {
      system_name: sampleSystem.name,
      token_groups: sampleSystem.tokenGroups,
      components: sampleSystem.components,
      code: input.code,
      description: input.description ?? "",
    });
  } catch (err) {
    console.error("Prompt engine error:", err);
    return NextResponse.json(mockValidateResult);
  }

  let message;
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    message = await anthropic.messages.create({
      model: prompt.config.model,
      max_tokens: prompt.config.max_tokens,
      temperature: prompt.config.temperature,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }],
    });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json(mockValidateResult);
  }

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    const result = JSON.parse(cleaned) as ValidateResult;
    return NextResponse.json(result);
  } catch {
    console.error("JSON parse failed, raw response:", text.slice(0, 300));
    return NextResponse.json({
      ...mockValidateResult,
      reasoning: text.slice(0, 1000),
    });
  }
}
