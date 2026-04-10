import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadPrompt } from "@/lib/prompt-engine";
import { sampleSystem } from "@/lib/sample-system";
import { mockValidateResult } from "@/lib/mock-results";
import { inputSchema } from "../../../../workflows/system-validator/workflow";
import type { ValidateResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const input = inputSchema.parse(raw);

    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json(mockValidateResult);
    }

    const prompt = await loadPrompt("system-validator", "validate.prompt", {
      system_name: sampleSystem.name,
      token_groups: sampleSystem.tokenGroups,
      components: sampleSystem.components,
      code: input.code,
      description: input.description ?? "",
    });

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: prompt.config.model,
      max_tokens: prompt.config.max_tokens,
      temperature: prompt.config.temperature,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    let result: ValidateResult;
    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      result = JSON.parse(cleaned) as ValidateResult;
    } catch {
      result = {
        ...mockValidateResult,
        reasoning: "Live AI response (parsed with fallback): " + text.slice(0, 500),
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Validate API error:", error);
    return NextResponse.json(mockValidateResult);
  }
}
