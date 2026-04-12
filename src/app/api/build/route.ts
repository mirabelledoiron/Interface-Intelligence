import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadPrompt } from "@/lib/prompt-engine";
import { sampleSystem } from "@/lib/sample-system";
import { getMockBuildResult } from "@/lib/mock-results";
import { inputSchema } from "../../../../workflows/component-builder/workflow";
import type { BuildResult } from "@/lib/types";

export async function POST(request: Request) {
  const raw = await request.json();
  const input = inputSchema.parse(raw);

  const promptVariables = {
    system_name: sampleSystem.name,
    token_groups: sampleSystem.tokenGroups,
    components: sampleSystem.components,
    component_type: input.componentType,
    context: input.context,
    constraints: input.constraints || "None specified",
    accessibility_level: input.accessibilityLevel,
  };

  let prompt;
  try {
    prompt = await loadPrompt(
      "component-builder",
      "build.prompt",
      promptVariables
    );
  } catch (err) {
    console.error("Prompt engine error:", err);
    return NextResponse.json(getMockBuildResult(input.componentType));
  }

  const renderedPrompt = { system: prompt.system, user: prompt.user };

  if (!process.env.ANTHROPIC_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return NextResponse.json({
      ...getMockBuildResult(input.componentType),
      renderedPrompt,
    });
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
    return NextResponse.json({
      ...getMockBuildResult(input.componentType),
      renderedPrompt,
    });
  }

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    const result = JSON.parse(cleaned) as BuildResult;
    return NextResponse.json({ ...result, renderedPrompt });
  } catch {
    console.error("JSON parse failed, raw response:", text.slice(0, 300));
    return NextResponse.json({
      ...getMockBuildResult(input.componentType),
      reasoning: text.slice(0, 1000),
      renderedPrompt,
    });
  }
}
