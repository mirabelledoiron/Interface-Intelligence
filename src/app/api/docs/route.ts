import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadPrompt } from "@/lib/prompt-engine";
import { sampleSystem } from "@/lib/sample-system";
import { mockDocsResult } from "@/lib/mock-results";
import { inputSchema } from "../../../../workflows/docs-generator/workflow";
import type { DocsResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const input = inputSchema.parse(raw);

    const component = sampleSystem.components.find(
      (c) => c.name.toLowerCase() === input.componentName.toLowerCase()
    );

    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json(mockDocsResult);
    }

    const prompt = await loadPrompt("docs-generator", "docs.prompt", {
      system_name: sampleSystem.name,
      token_groups: sampleSystem.tokenGroups,
      components: sampleSystem.components,
      component_name: input.componentName,
      component_details: component ?? null,
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

    let result: DocsResult;
    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      result = JSON.parse(cleaned) as DocsResult;
    } catch {
      result = {
        ...mockDocsResult,
        reasoning: "Live AI response (parsed with fallback): " + text.slice(0, 500),
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Docs API error:", error);
    return NextResponse.json(mockDocsResult);
  }
}
