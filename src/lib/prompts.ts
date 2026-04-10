import type { DesignSystem, BuildInput, ValidateInput, DocsInput } from "./types";

function serializeTokens(system: DesignSystem): string {
  return system.tokenGroups
    .map(
      (group) =>
        `## ${group.name}\n${group.tokens.map((t) => `- ${t.name}: ${t.value} (${t.description ?? ""})`).join("\n")}`
    )
    .join("\n\n");
}

function serializeComponents(system: DesignSystem): string {
  return system.components
    .map(
      (c) =>
        `## ${c.name}\n${c.description}\nVariants: ${c.variants.join(", ")}\nProps: ${c.props.join(", ")}`
    )
    .join("\n\n");
}

export function buildComponentPrompt(
  input: BuildInput,
  system: DesignSystem
): { system: string; user: string } {
  return {
    system: `You are a design system expert helping teams build consistent, accessible components. You have deep knowledge of the following design system:

# ${system.name}

# Design Tokens
${serializeTokens(system)}

# Existing Components
${serializeComponents(system)}

You must respond with valid JSON matching this exact structure:
{
  "structure": "string - TypeScript interface and JSX usage example",
  "recommendedTokens": [{ "token": "string", "value": "string", "reason": "string" }],
  "apiDesign": "string - Full implementation code with cva variants",
  "accessibilityNotes": ["string - specific WCAG requirements and implementations"],
  "reasoning": "string - why these decisions were made, referencing system patterns"
}

Ground all recommendations in the actual token values and component patterns above. Reference specific token names and values. Do not suggest generic solutions.`,
    user: `Build a ${input.componentType} component for a ${input.context} context.

Constraints: ${input.constraints}
Accessibility level: WCAG 2.1 ${input.accessibilityLevel}

Use only tokens from the design system. Explain why each token was chosen. Reference existing components where patterns should be consistent.`,
  };
}

export function validateComponentPrompt(
  input: ValidateInput,
  system: DesignSystem
): { system: string; user: string } {
  return {
    system: `You are a design system validator. You check code and component descriptions against a specific design system for consistency, token adherence, and accessibility compliance.

# ${system.name}

# Design Tokens
${serializeTokens(system)}

# Existing Components
${serializeComponents(system)}

You must respond with valid JSON matching this exact structure:
{
  "score": number (0-100, where 100 is perfect system alignment),
  "issues": [{ "severity": "error" | "warning" | "info", "rule": "string", "message": "string", "suggestion": "string" }],
  "summary": "string - overall assessment with key action items",
  "reasoning": "string - how the validation was performed, which rules were checked"
}

Check for:
1. Token usage - are hard-coded values used instead of tokens?
2. Spacing scale adherence - do values match the spacing scale?
3. Typography scale adherence - do font sizes/weights match tokens?
4. Color usage - do colors match system tokens?
5. Accessibility - WCAG 2.1 AA compliance (contrast, labels, focus, touch targets)
6. Component patterns - does the code follow established patterns?`,
    user: `Validate this component against the design system:

\`\`\`
${input.code}
\`\`\`

${input.description ? `Additional context: ${input.description}` : ""}

Check for token adherence, accessibility issues, and pattern consistency. Be specific about which tokens should replace hard-coded values.`,
  };
}

export function generateDocsPrompt(
  input: DocsInput,
  system: DesignSystem
): { system: string; user: string } {
  const component = system.components.find(
    (c) => c.name.toLowerCase() === input.componentName.toLowerCase()
  );

  return {
    system: `You are a technical writer specializing in design system documentation. You write clear, actionable component documentation grounded in a specific design system.

# ${system.name}

# Design Tokens
${serializeTokens(system)}

# Existing Components
${serializeComponents(system)}

You must respond with valid JSON matching this exact structure:
{
  "overview": "string - what the component is and when to use it",
  "usage": "string - code examples showing common patterns",
  "dosAndDonts": [{ "type": "do" | "dont", "text": "string" }],
  "accessibilityNotes": ["string - specific WCAG requirements"],
  "codeExample": "string - complete implementation example",
  "reasoning": "string - why these guidelines were chosen, based on system patterns"
}

Ground documentation in actual token values. Reference specific accessibility requirements. Write practical do/don't guidelines based on common misuse patterns.`,
    user: `Generate comprehensive documentation for the ${input.componentName} component.

${
  component
    ? `Component details:
- Description: ${component.description}
- Variants: ${component.variants.join(", ")}
- Props: ${component.props.join(", ")}`
    : `This component is not yet defined in the system. Generate documentation based on standard patterns and the system's token architecture.`
}

Include usage examples, do/don't guidelines, and accessibility requirements. Reference system tokens by name.`,
  };
}
