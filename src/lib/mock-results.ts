import type { BuildResult, ValidateResult, DocsResult } from "./types";

export const mockBuildResult: BuildResult = {
  structure: `// Web Component: <ds-button>
// Extends BaseElement with Shadow DOM encapsulation

static observedAttributes = ["variant", "size", "disabled"];

// Variants: primary | secondary | ghost
// Sizes: sm (2.375rem) | md (2.75rem) | lg (3.25rem)

// Usage
<ds-button variant="primary">Create Project</ds-button>
<ds-button variant="secondary" size="sm">Cancel</ds-button>
<ds-button variant="ghost">Learn more</ds-button>
<ds-button variant="primary" disabled>Unavailable</ds-button>`,
  recommendedTokens: [
    {
      token: "mirabelle-ds-primary",
      value: "#5c756c",
      reason: "Primary variant background via accent color. Used through shared-styles --_accent variable for consistent theming across components.",
    },
    {
      token: "mirabelle-ds-primary-text",
      value: "#ffffff",
      reason: "Text on primary variant. Mapped through --ds-color-text-inverse for automatic dark mode adaptation.",
    },
    {
      token: "mirabelle-ds-radius-pill",
      value: "999px",
      reason: "All button variants use pill radius (ds-radius-pill). This is a system-wide decision for interactive elements.",
    },
    {
      token: "mirabelle-ds-space-4",
      value: "1rem",
      reason: "Horizontal padding for md size. Provides comfortable click targets while maintaining compact density.",
    },
    {
      token: "mirabelle-ds-font-weight-semibold",
      value: "600",
      reason: "Button labels use semibold weight (ds-font-weight-semibold) for clear hierarchy against body text.",
    },
    {
      token: "mirabelle-ds-duration-fast",
      value: "120ms",
      reason: "Transition duration for hover/active states. Uses ds-ease-standard cubic-bezier for the easing curve.",
    },
  ],
  apiDesign: `// Shadow DOM encapsulated Web Component
class DsButton extends BaseElement {
  static observedAttributes = ["variant", "size", "disabled"];

  protected render() {
    const variant = this.getAttribute("variant") ?? "primary";
    const size = this.getAttribute("size") ?? "md";
    const disabled = this.hasAttribute("disabled");

    this.root.innerHTML = \`
      <style>
        /* Inherits shared-styles for token mapping */
        button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ds-space-2);
          min-height: 2.75rem;
          padding: 0 var(--ds-space-4);
          border: 1px solid transparent;
          border-radius: var(--ds-radius-pill);
          font-size: var(--ds-font-size-300);
          font-weight: var(--ds-font-weight-semibold);
          cursor: pointer;
          transition: transform 140ms ease,
                      background-color 140ms ease;
        }

        button:focus-visible {
          outline: 2px solid color-mix(
            in srgb, var(--_accent) 60%, white
          );
          outline-offset: 2px;
        }

        button:hover { transform: translateY(-1px); }
        button:active { transform: translateY(0); }
        button[disabled] { opacity: 0.55; cursor: not-allowed; }
      </style>
      <button
        data-variant="\${variant}"
        data-size="\${size}"
        \${disabled ? "disabled" : ""}>
        <slot></slot>
      </button>
    \`;
  }
}`,
  accessibilityNotes: [
    "Focus ring uses color-mix(in srgb, accent 60%, white) with 2px solid outline and 2px offset, visible against all background tokens.",
    "Disabled state uses opacity 0.55 and cursor: not-allowed. Button remains in DOM and focusable for screen readers.",
    "Minimum touch target: md size is 2.75rem (44px), sm size is 2.375rem (38px). Consider invisible padding on sm to meet WCAG 2.5.8.",
    "Uses <slot> for content projection, allowing icon + text combinations without complex prop APIs.",
    "Hover lift (translateY -1px) provides visual affordance. Respects prefers-reduced-motion via system transition tokens.",
  ],
  reasoning:
    "This ds-button follows the Mirabelle Design System patterns: BaseElement with Shadow DOM, shared-styles for token mapping, data-attributes for variant/size styling, and slot-based content. Token choices reference the actual system variables (--ds-radius-pill, --ds-space-4, --ds-font-weight-semibold) rather than arbitrary values.",
};

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
      suggestion: "Use mirabelle-ds-space-2 (0.5rem/8px) for tighter density or mirabelle-ds-space-3 (0.75rem/12px) for more breathing room. Off-scale values break vertical rhythm.",
    },
    {
      severity: "warning",
      rule: "Component Pattern",
      message: "Custom focus styles override the system focus ring pattern.",
      suggestion: "Use the shared-styles focus pattern: outline 2px solid color-mix(in srgb, var(--_accent) 60%, white) with outline-offset 2px. This ensures consistency across all ds-* components.",
    },
    {
      severity: "info",
      rule: "Border Radius",
      message: "Using border-radius: 6px instead of a system radius token.",
      suggestion: "Map to mirabelle-ds-radius-xs (0.375rem) or mirabelle-ds-radius-sm (0.5rem). Interactive elements in this system use mirabelle-ds-radius-pill (999px) for full rounding.",
    },
  ],
  summary:
    "This component has 2 critical issues (hard-coded color, missing accessible name) and 2 warnings. The structure follows Web Component patterns but token adherence needs work. Fixing the color and accessibility issues would bring the score to approximately 85.",
  reasoning:
    "Validation checked against the Mirabelle Design System token definitions (mirabelle-ds-* namespace), spacing scale, shared-styles patterns, and WCAG 2.1 AA requirements. The hard-coded color is the highest impact issue because it breaks theme switching between light and dark modes.",
};

export const mockDocsResult: DocsResult = {
  overview:
    "ds-button is a Web Component that extends BaseElement with Shadow DOM encapsulation. It serves as the primary interactive trigger in the Mirabelle Design System. The component uses slot-based content projection for flexible label and icon composition, supports three variants (primary, secondary, ghost) and three sizes (sm, md, lg), and maps all visual properties through shared-styles token variables for automatic light/dark theme adaptation.",
  usage: `<!-- Primary action -->
<ds-button variant="primary">Save Changes</ds-button>

<!-- Secondary action -->
<ds-button variant="secondary">Cancel</ds-button>

<!-- Ghost action -->
<ds-button variant="ghost">Learn more</ds-button>

<!-- Small size -->
<ds-button variant="primary" size="sm">Export</ds-button>

<!-- Large size -->
<ds-button variant="primary" size="lg">Get Started</ds-button>

<!-- Disabled state -->
<ds-button variant="primary" disabled>Unavailable</ds-button>

<!-- With icon (via slot) -->
<ds-button variant="secondary">
  <svg><!-- icon --></svg>
  Download Report
</ds-button>`,
  dosAndDonts: [
    { type: "do", text: "Use primary variant for the single most important action on a page." },
    { type: "dont", text: "Place two primary buttons side by side. Pair primary with secondary instead." },
    { type: "do", text: "Use the ghost variant for tertiary actions that should not compete visually." },
    { type: "dont", text: "Use hard-coded colors. All variants pull from shared-styles token variables." },
    { type: "do", text: "Always provide text content or aria-label. The slot must contain an accessible name." },
    { type: "dont", text: "Override the pill radius. All interactive elements in this system use ds-radius-pill." },
    { type: "do", text: "Use the disabled attribute for unavailable states. It sets opacity and cursor automatically." },
    { type: "dont", text: "Use font sizes below mirabelle-ds-font-size-sm (0.875rem/14px) for button labels. ADA minimum." },
  ],
  accessibilityNotes: [
    "Focus ring: 2px solid color-mix(in srgb, accent 60%, white) with 2px offset. Visible against all system backgrounds.",
    "Disabled buttons remain in the DOM at 0.55 opacity. Screen readers can still discover and announce them.",
    "Touch target: md size meets 44px minimum (WCAG 2.5.8). sm size (38px) needs additional invisible padding.",
    "Hover animation (translateY -1px) is driven by system motion tokens. Respects prefers-reduced-motion.",
    "Shadow DOM encapsulation prevents external style leaks. All accessibility styles are self-contained.",
  ],
  codeExample: `// Registering the component
import { DsButton } from "./components/ds-button";
customElements.define("ds-button", DsButton);

// In HTML
<div class="actions">
  <ds-button variant="secondary">Cancel</ds-button>
  <ds-button variant="primary">Save Changes</ds-button>
</div>

// Listening for events
document.querySelector("ds-button")
  ?.addEventListener("click", () => {
    console.log("Button clicked");
  });

// Dynamic attribute changes
const btn = document.querySelector("ds-button");
btn?.setAttribute("disabled", "");
btn?.setAttribute("variant", "ghost");`,
  reasoning:
    "Documentation generated from the Mirabelle Design System ds-button Web Component source. The component extends BaseElement, uses Shadow DOM for style encapsulation, and maps all visual properties through shared-styles token variables (--_accent, --_text-primary, etc.). Do/don't guidelines address the most common misuse patterns: multiple primary buttons, hard-coded values bypassing the token system, and accessibility requirements.",
};
