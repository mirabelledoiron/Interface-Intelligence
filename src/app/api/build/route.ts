import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadPrompt } from "@/lib/prompt-engine";
import { sampleSystem } from "@/lib/sample-system";
import { mockBuildResult } from "@/lib/mock-results";
import { inputSchema } from "../../../../workflows/component-builder/workflow";
import type { BuildResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const input = inputSchema.parse(raw);

    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json(mockBuildResult);
    }

    const prompt = await loadPrompt("component-builder", "build.prompt", {
      system_name: sampleSystem.name,
      token_groups: sampleSystem.tokenGroups,
      components: sampleSystem.components,
      component_type: input.componentType,
      context: input.context,
      constraints: input.constraints || "None specified",
      accessibility_level: input.accessibilityLevel,
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

    let result: BuildResult;
    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      result = JSON.parse(cleaned) as BuildResult;
    } catch {
      result = {
        ...mockBuildResult,
        reasoning: "Live AI response (parsed with fallback): " + text.slice(0, 500),
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Build API error:", error);
    return NextResponse.json(mockBuildResult);
  }
}
