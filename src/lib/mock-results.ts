import type { BuildResult, ValidateResult, DocsResult } from "./types";

const mockBuildResults: Record<string, BuildResult> = {
  Button: {
    structure: `// Web Component: <ds-button>
static observedAttributes = ["variant", "size", "disabled"];

// Variants: primary | secondary | ghost
// Sizes: sm (2.375rem) | md (2.75rem) | lg (3.25rem)

<ds-button variant="primary">Create Project</ds-button>
<ds-button variant="secondary" size="sm">Cancel</ds-button>
<ds-button variant="ghost">Learn more</ds-button>`,
    recommendedTokens: [
      { token: "mirabelle-ds-primary", value: "#5c756c", reason: "Primary variant background via shared-styles --_accent. Adapts to dark mode automatically." },
      { token: "mirabelle-ds-radius-pill", value: "999px", reason: "All buttons use pill radius. System-wide decision for interactive elements." },
      { token: "mirabelle-ds-space-4", value: "1rem", reason: "Horizontal padding for md size. Comfortable click target density." },
      { token: "mirabelle-ds-font-weight-semibold", value: "600", reason: "Button labels use semibold for clear hierarchy against body text." },
      { token: "mirabelle-ds-duration-fast", value: "120ms", reason: "Hover/active transition duration with ds-ease-standard curve." },
    ],
    apiDesign: `class DsButton extends BaseElement {
  static observedAttributes = ["variant", "size", "disabled"];

  protected render() {
    const variant = this.getAttribute("variant") ?? "primary";
    const size = this.getAttribute("size") ?? "md";
    const disabled = this.hasAttribute("disabled");

    // Inherits shared-styles for token mapping
    // button[data-variant="primary"] uses --_accent for bg
    // button:focus-visible uses color-mix(--_accent 60%, white)
    // button:hover applies translateY(-1px) lift
    // button[disabled] sets opacity 0.55
  }
}`,
    accessibilityNotes: [
      "Focus ring: 2px solid color-mix(accent 60%, white), 2px offset. Visible on all backgrounds.",
      "Disabled state: opacity 0.55, remains focusable for screen readers.",
      "Touch target: md (44px) meets WCAG 2.5.8. sm (38px) needs invisible padding.",
      "Uses <slot> for content. Icon-only buttons require aria-label.",
    ],
    reasoning: "Button follows Mirabelle DS patterns: BaseElement with Shadow DOM, shared-styles token mapping, data-attributes for variants, slot-based content projection.",
  },

  Card: {
    structure: `// Web Component: <ds-card>
static observedAttributes = ["elevated"];

// Slot-based composition:
// slot="eyebrow" - uppercase kicker, accent color
// slot="title" - heading, font-size-500
// default slot - body content
// slot="footer" - action buttons row

<ds-card>
  <span slot="eyebrow">Analytics</span>
  <span slot="title">Monthly Overview</span>
  <p>Revenue and engagement metrics for the current period.</p>
  <div slot="footer">
    <ds-button variant="secondary" size="sm">Export</ds-button>
    <ds-button variant="ghost" size="sm">Details</ds-button>
  </div>
</ds-card>`,
    recommendedTokens: [
      { token: "mirabelle-ds-surface", value: "#f7f9f8", reason: "Card background uses bg-surface at 92% opacity via color-mix for subtle transparency." },
      { token: "mirabelle-ds-border", value: "#c5d3cd", reason: "Uses border-subtle token for the 1px border. Lighter than default border." },
      { token: "mirabelle-ds-radius-lg", value: "1.25rem", reason: "Card rounding uses radius-lg + 0.125rem for slightly softer appearance than standard." },
      { token: "mirabelle-ds-space-6", value: "1.5rem", reason: "Internal padding. Consistent across all card variants." },
      { token: "mirabelle-ds-text-secondary", value: "#575958", reason: "Body text within cards uses text-secondary for visual hierarchy below the title." },
    ],
    apiDesign: `class DsCard extends BaseElement {
  static observedAttributes = ["elevated"];

  protected render() {
    const elevated = this.hasAttribute("elevated");

    // article element with:
    //   backdrop-filter: blur(16px)
    //   background: color-mix(in srgb, var(--_surface) 92%, transparent)
    //   border: 1px solid var(--_border-color)
    //   border-radius: calc(var(--ds-radius-lg) + 0.125rem)
    //
    // [data-elevated="true"] adds shadow-md
    //
    // Slots: eyebrow (p.eyebrow), title (h2.title),
    //        default (div.body), footer (flex row)
  }
}`,
    accessibilityNotes: [
      "Uses semantic <article> element for proper document outline.",
      "Eyebrow uses uppercase + letter-spacing for visual distinction, not semantic emphasis.",
      "Footer actions maintain keyboard focus order matching visual order.",
      "Elevated variant shadow provides visual-only depth. No semantic difference.",
    ],
    reasoning: "Card uses backdrop-filter blur and color-mix transparency for the glass-morphism effect consistent across the Mirabelle DS surface treatments. Slot composition keeps the API simple while supporting complex layouts.",
  },

  Input: {
    structure: `// Web Component: <ds-input>
static observedAttributes = ["label", "placeholder", "value", "helper", "type"];

// Emits: ds-input (on typing), ds-change (on blur)
// Both events include detail.value

<ds-input
  label="Email address"
  placeholder="you@company.com"
  helper="We will use this for account recovery"
  type="email">
</ds-input>`,
    recommendedTokens: [
      { token: "mirabelle-ds-surface", value: "#f7f9f8", reason: "Input background uses bg-elevated for subtle contrast against page background." },
      { token: "mirabelle-ds-border", value: "#c5d3cd", reason: "Default border uses border-subtle. Focus state transitions to accent mix." },
      { token: "mirabelle-ds-radius-base", value: "0.75rem", reason: "Inputs use radius-md (mapped from ds-radius-md) for consistency with other form elements." },
      { token: "mirabelle-ds-primary", value: "#5c756c", reason: "Focus ring uses color-mix(accent 48%, white) for border and color-mix(accent 18%, transparent) for shadow." },
      { token: "mirabelle-ds-font-size-sm", value: "0.875rem", reason: "Label and helper text use font-size-200. Input text uses font-size-300 (1rem)." },
    ],
    apiDesign: `class DsInput extends BaseElement {
  static observedAttributes = ["label", "placeholder", "value", "helper", "type"];
  private internalValue = "";

  get value() { return this.internalValue; }
  set value(v: string) {
    this.internalValue = v;
    if (this.getAttribute("value") !== v) this.setAttribute("value", v);
  }

  // Renders: label + input + helper in a .field grid
  // Focus: border accent-mix, 3px box-shadow accent-mix
  // Events: ds-input (input), ds-change (change)
}`,
    accessibilityNotes: [
      "Label is programmatically associated via DOM structure within Shadow DOM.",
      "Focus state: border color-mix(accent 48%, white) + box-shadow 0 0 0 3px color-mix(accent 18%, transparent).",
      "Min-height 3rem (48px) exceeds WCAG 2.5.8 touch target minimum.",
      "Helper text is visually present but should be linked via aria-describedby for screen readers.",
      "Placeholder uses text-secondary color. Not a substitute for a label.",
    ],
    reasoning: "Input follows the Mirabelle DS form pattern: min-height 3rem for touch targets, border-subtle default with accent-mix focus, and custom events (ds-input, ds-change) for framework-agnostic integration.",
  },

  Badge: {
    structure: `// Web Component: <ds-badge>
static observedAttributes = ["tone"];

// Tones: neutral | accent | success | warning
// Each tone uses color-mix for transparent backgrounds

<ds-badge tone="neutral">Draft</ds-badge>
<ds-badge tone="accent">Featured</ds-badge>
<ds-badge tone="success">Published</ds-badge>
<ds-badge tone="warning">Review Needed</ds-badge>`,
    recommendedTokens: [
      { token: "mirabelle-ds-radius-pill", value: "999px", reason: "Badges use pill radius matching buttons for consistent interactive element shaping." },
      { token: "mirabelle-ds-success", value: "#009183", reason: "Success tone: background at 14% mix, text at full value, border at 20% mix." },
      { token: "mirabelle-ds-warning", value: "#d36f6d", reason: "Warning tone: background at 12% mix, text at full value, border at 18% mix." },
      { token: "mirabelle-ds-font-weight-semibold", value: "600", reason: "Badge text uses semibold weight with 0.02em letter-spacing for compact readability." },
    ],
    apiDesign: `class DsBadge extends BaseElement {
  static observedAttributes = ["tone"];

  protected render() {
    const tone = this.getAttribute("tone") ?? "neutral";

    // span[data-tone] with:
    //   min-height: 1.75rem
    //   padding: 0 var(--ds-space-3)
    //   border-radius: var(--ds-radius-pill)
    //   font-size: var(--ds-font-size-100)
    //
    // Tones use color-mix:
    //   neutral: surface-subtle bg, text-secondary text
    //   accent: accent 12% bg, accent text
    //   success: success 14% bg, success text
    //   warning: warning 12% bg, warning text
  }
}`,
    accessibilityNotes: [
      "Badge content is read by screen readers as inline text. No special role needed.",
      "Color is not the only indicator: tone name should be inferrable from context or text content.",
      "Font size uses ds-font-size-100 (0.75rem/12px). This is below the 14px minimum for body text but acceptable for status labels per WCAG.",
      "Ensure sufficient contrast: all tone backgrounds maintain 4.5:1 ratio with their text color.",
    ],
    reasoning: "Badge uses color-mix for transparent, theme-adaptive tone backgrounds. This approach avoids maintaining separate light/dark color sets per tone since the mixing automatically adjusts.",
  },
};

const defaultMockBuild = mockBuildResults.Button;

export function getMockBuildResult(componentType: string): BuildResult {
  return mockBuildResults[componentType] ?? {
    ...defaultMockBuild,
    structure: defaultMockBuild.structure.replace(/button/gi, componentType.toLowerCase()).replace(/Button/g, componentType),
    reasoning: `Generated specification for ${componentType} using Mirabelle Design System patterns. Follows BaseElement with Shadow DOM, shared-styles token mapping, and slot-based composition.`,
  };
}

export const mockValidateResult: ValidateResult = {
  score: 62,
  issues: [
    {
      severity: "error",
      rule: "Token Usage",
      message: "Hard-coded color #3b82f6 does not match any mirabelle-ds token.",
      suggestion: "Replace with mirabelle-ds-primary (#5c756c). Use the shared-styles --_accent variable for theme-aware color that adapts to light/dark mode automatically.",
    },
    {
      severity: "error",
      rule: "Accessibility",
      message: "Button has no accessible name. Missing aria-label on icon-only variant.",
      suggestion: "Add aria-label describing the action. With Web Components using <slot>, ensure the slot content provides a text alternative or add an explicit aria-label attribute.",
    },
    {
      severity: "warning",
      rule: "Spacing Scale",
      message: "Padding uses 10px which is not on the ds-space scale (ds-space-2: 0.5rem or ds-space-3: 0.75rem).",
      suggestion: "Use mirabelle-ds-space-2 (0.5rem/8px) for tighter density or mirabelle-ds-space-3 (0.75rem/12px) for more breathing room.",
    },
    {
      severity: "warning",
      rule: "Component Pattern",
      message: "Custom focus styles override the system focus ring pattern.",
      suggestion: "Use the shared-styles focus pattern: outline 2px solid color-mix(in srgb, var(--_accent) 60%, white) with outline-offset 2px.",
    },
    {
      severity: "info",
      rule: "Border Radius",
      message: "Using border-radius: 6px instead of a system radius token.",
      suggestion: "Map to mirabelle-ds-radius-xs (0.375rem) or mirabelle-ds-radius-sm (0.5rem). Interactive elements use mirabelle-ds-radius-pill (999px).",
    },
  ],
  summary: "2 critical issues (hard-coded color, missing accessible name) and 2 warnings. Fixing color and accessibility would bring the score to approximately 85.",
  reasoning: "Validated against Mirabelle Design System tokens (mirabelle-ds-* namespace), spacing scale, shared-styles patterns, and WCAG 2.1 AA requirements.",
};

export const mockDocsResult: DocsResult = {
  overview: "ds-button is a Web Component extending BaseElement with Shadow DOM encapsulation. It serves as the primary interactive trigger in the Mirabelle Design System, supporting three variants (primary, secondary, ghost) and three sizes (sm, md, lg). All visual properties map through shared-styles token variables for automatic light/dark theme adaptation.",
  usage: `<!-- Primary action -->
<ds-button variant="primary">Save Changes</ds-button>

<!-- Secondary action -->
<ds-button variant="secondary">Cancel</ds-button>

<!-- Ghost action -->
<ds-button variant="ghost">Learn more</ds-button>

<!-- Small size -->
<ds-button variant="primary" size="sm">Export</ds-button>

<!-- Disabled state -->
<ds-button variant="primary" disabled>Unavailable</ds-button>

<!-- With icon via slot -->
<ds-button variant="secondary">
  <svg><!-- icon --></svg>
  Download Report
</ds-button>`,
  dosAndDonts: [
    { type: "do", text: "Use primary variant for the single most important action on a page." },
    { type: "dont", text: "Place two primary buttons side by side. Pair primary with secondary instead." },
    { type: "do", text: "Use ghost variant for tertiary actions that should not compete visually." },
    { type: "dont", text: "Use hard-coded colors. All variants pull from shared-styles token variables." },
    { type: "do", text: "Always provide text content or aria-label for accessible naming." },
    { type: "dont", text: "Override the pill radius. All interactive elements use ds-radius-pill." },
    { type: "do", text: "Use disabled attribute for unavailable states. Sets opacity and cursor automatically." },
    { type: "dont", text: "Use font sizes below mirabelle-ds-font-size-sm (14px) for button labels." },
  ],
  accessibilityNotes: [
    "Focus ring: 2px solid color-mix(accent 60%, white) with 2px offset.",
    "Disabled buttons remain in DOM at 0.55 opacity for screen reader discovery.",
    "Touch target: md (44px) meets WCAG 2.5.8. sm (38px) needs invisible padding.",
    "Hover animation respects prefers-reduced-motion via system motion tokens.",
    "Shadow DOM encapsulation: all accessibility styles are self-contained.",
  ],
  codeExample: `// Register the component
import { DsButton } from "./components/ds-button";
customElements.define("ds-button", DsButton);

// Usage in HTML
<div class="actions">
  <ds-button variant="secondary">Cancel</ds-button>
  <ds-button variant="primary">Save Changes</ds-button>
</div>

// Listen for events
document.querySelector("ds-button")
  ?.addEventListener("click", () => {
    console.log("Button clicked");
  });`,
  reasoning: "Documentation generated from Mirabelle Design System ds-button Web Component source. Do/don't guidelines address common misuse: multiple primary buttons, hard-coded values bypassing tokens, and accessibility requirements.",
};
