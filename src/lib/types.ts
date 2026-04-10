export interface DesignToken {
  name: string;
  value: string;
  type: "color" | "spacing" | "typography" | "radius" | "shadow";
  description?: string;
}

export interface DesignTokenGroup {
  name: string;
  tokens: DesignToken[];
}

export interface SystemComponent {
  name: string;
  description: string;
  variants: string[];
  props: string[];
}

export interface DesignSystem {
  name: string;
  tokenGroups: DesignTokenGroup[];
  components: SystemComponent[];
}

// Build Flow types
export interface BuildInput {
  componentType: string;
  context: string;
  constraints: string;
  accessibilityLevel: "AA" | "AAA";
}

export interface BuildResult {
  structure: string;
  recommendedTokens: Array<{
    token: string;
    value: string;
    reason: string;
  }>;
  apiDesign: string;
  accessibilityNotes: string[];
  reasoning: string;
}

// Validate Flow types
export interface ValidateInput {
  code: string;
  description?: string;
}

export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  rule: string;
  message: string;
  suggestion: string;
}

export interface ValidateResult {
  score: number;
  issues: ValidationIssue[];
  summary: string;
  reasoning: string;
}

// Docs Flow types
export interface DocsInput {
  componentName: string;
}

export interface DocsResult {
  overview: string;
  usage: string;
  dosAndDonts: Array<{
    type: "do" | "dont";
    text: string;
  }>;
  accessibilityNotes: string[];
  codeExample: string;
  reasoning: string;
}

// Workflow run tracking
export type WorkflowType = "build" | "validate" | "docs";
export type RunStatus = "running" | "complete" | "error";

export interface WorkflowRun {
  id: string;
  workflowType: WorkflowType;
  input: BuildInput | ValidateInput | DocsInput;
  result: BuildResult | ValidateResult | DocsResult | null;
  status: RunStatus;
  createdAt: string;
  completedAt?: string;
}
