import type { BuildResult, ValidateResult, DocsResult } from "./types";

export const mockBuildResult: BuildResult = {
  structure: `interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
}

// Compound component pattern for flexibility
<Button variant="primary" size="md">
  <Button.Icon><PlusIcon /></Button.Icon>
  <Button.Label>Create Project</Button.Label>
</Button>`,
  recommendedTokens: [
    {
      token: "color-primary",
      value: "#2563eb",
      reason: "Primary variant background. Meets WCAG AA contrast ratio (4.7:1) against white foreground text.",
    },
    {
      token: "color-primary-hover",
      value: "#1d4ed8",
      reason: "Hover state for primary variant. Provides visible state change while maintaining contrast.",
    },
    {
      token: "space-2 / space-4",
      value: "8px / 16px",
      reason: "Horizontal padding uses space-4 (16px) for comfortable click targets. Vertical uses space-2 (8px) for compact density.",
    },
    {
      token: "radius-md",
      value: "8px",
      reason: "Consistent with system's default rounding. Matches Input and Card components for visual cohesion.",
    },
    {
      token: "font-size-sm / font-weight-medium",
      value: "14px / 500",
      reason: "Button labels use slightly smaller text with medium weight for clear hierarchy below headings.",
    },
    {
      token: "shadow-sm",
      value: "0 1px 2px rgba(0,0,0,0.05)",
      reason: "Subtle elevation on primary variant only. Gives affordance without competing with card shadows.",
    },
  ],
  apiDesign: `// Accessible by default - no extra work needed
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', disabled, loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size })}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled}
        {...props}
      >
        {loading && <Spinner aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

// Variant styles using class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
        secondary: 'bg-surface-elevated text-secondary border border-border hover:bg-muted',
        ghost: 'text-secondary hover:bg-muted',
        destructive: 'bg-error text-white hover:bg-error/90',
        outline: 'border border-border text-primary hover:bg-primary/5',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-sm',
        md: 'h-10 px-4 text-sm rounded-md',
        lg: 'h-12 px-6 text-base rounded-md',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);`,
  accessibilityNotes: [
    "Minimum touch target: 44x44px (WCAG 2.5.8). The 'sm' size (32px height) requires 6px invisible padding to meet this.",
    "Loading state uses aria-busy=\"true\" so screen readers announce the state change.",
    "Disabled buttons use aria-disabled instead of the disabled attribute to remain focusable for screen readers.",
    "Focus ring uses focus-visible to avoid showing on mouse clicks while remaining visible for keyboard users.",
    "Icon-only buttons require aria-label. The compound pattern enforces this at the type level.",
    "Color contrast: primary variant achieves 4.7:1 ratio (AA). Destructive achieves 4.5:1 (AA minimum).",
  ],
  reasoning:
    "This Button component follows your system's existing patterns: cva for variant management, forwardRef for composition, and token-based styling. The compound component pattern (Button.Icon, Button.Label) gives flexibility for icon placement without complex prop drilling, while keeping the simple case simple. Token choices prioritize contrast ratios and consistent spacing with your Input and Card components.",
};

export const mockValidateResult: ValidateResult = {
  score: 62,
  issues: [
    {
      severity: "error",
      rule: "Token Usage",
      message: "Hard-coded color value #3b82f6 does not match any system token.",
      suggestion: "Replace with color-primary (#2563eb) for brand consistency. The hex values are close but not identical, which creates subtle visual inconsistency.",
    },
    {
      severity: "error",
      rule: "Accessibility",
      message: "Button has no accessible name. Missing aria-label on icon-only variant.",
      suggestion: "Add aria-label describing the action (e.g., aria-label=\"Close dialog\"). Screen readers cannot infer meaning from an icon alone.",
    },
    {
      severity: "warning",
      rule: "Spacing Scale",
      message: "Padding uses 10px which is not on the spacing scale (8px or 12px).",
      suggestion: "Use space-2 (8px) for tighter density or space-3 (12px) for more breathing room. Off-scale values break vertical rhythm.",
    },
    {
      severity: "warning",
      rule: "Component Pattern",
      message: "Custom focus styles override system focus ring pattern.",
      suggestion: "Use the system's focus-visible:ring-2 focus-visible:ring-offset-2 pattern for consistency across all interactive elements.",
    },
    {
      severity: "info",
      rule: "Typography",
      message: "Font weight 450 is between system tokens (normal: 400, medium: 500).",
      suggestion: "Round to font-weight-normal (400) or font-weight-medium (500). Variable font weights outside the token scale reduce predictability.",
    },
  ],
  summary:
    "This component has 2 critical issues (hard-coded color, missing accessible name) and 2 warnings. The overall structure follows system patterns, but token adherence needs work. Fixing the color and accessibility issues would bring the score to approximately 85.",
  reasoning:
    "Validation checked against your Acme Design System's token definitions, spacing scale, component patterns, and WCAG 2.1 AA requirements. The hard-coded color is the most impactful issue because it introduces brand drift. The missing aria-label is a compliance blocker.",
};

export const mockDocsResult: DocsResult = {
  overview:
    "The Button component is the primary interactive trigger in the Acme Design System. It communicates available actions and guides users toward completing tasks. Buttons use system color tokens for variant styling, maintain WCAG AA contrast ratios across all variants, and support loading and disabled states with proper ARIA attributes.",
  usage: `import { Button } from '@acme/ui';

// Primary action
<Button variant="primary" onClick={handleSubmit}>
  Save Changes
</Button>

// Secondary action with icon
<Button variant="secondary" icon={<DownloadIcon />}>
  Export Report
</Button>

// Destructive action with confirmation
<Button variant="destructive" onClick={handleDelete}>
  Delete Account
</Button>

// Loading state
<Button variant="primary" loading>
  Saving...
</Button>

// Icon-only (requires aria-label)
<Button variant="ghost" icon={<CloseIcon />} aria-label="Close dialog" />`,
  dosAndDonts: [
    { type: "do", text: "Use primary variant for the single most important action on a page." },
    { type: "dont", text: "Place two primary buttons side by side. Use primary + secondary instead." },
    { type: "do", text: "Include loading state for async actions. Users need feedback that something is happening." },
    { type: "dont", text: "Disable buttons without explanation. Use a tooltip on the disabled button to explain why." },
    { type: "do", text: "Always provide aria-label for icon-only buttons." },
    { type: "dont", text: "Use color alone to communicate button variant. Icon + color ensures colorblind users understand the intent." },
    { type: "do", text: "Keep button labels to 1-3 words. 'Save' not 'Save all your changes now'." },
    { type: "dont", text: "Use the ghost variant for primary actions. Ghost buttons have low visual weight and can be missed." },
  ],
  accessibilityNotes: [
    "All button variants meet WCAG 2.1 AA contrast requirements (minimum 4.5:1 for text).",
    "Focus indicator uses a 2px ring with 2px offset, visible against all background colors.",
    "Loading state announces to screen readers via aria-busy. The spinner is hidden from AT with aria-hidden.",
    "Disabled buttons remain in the tab order (aria-disabled) so screen reader users know the button exists.",
    "Touch target minimum is 44x44px per WCAG 2.5.8. Small buttons add invisible padding to meet this.",
  ],
  codeExample: `// Full implementation example with all features
function SettingsForm() {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings();
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave}>
      {/* Form fields */}
      <div className="flex gap-space-3">
        <Button variant="secondary" type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}`,
  reasoning:
    "Documentation generated from your Acme Design System's Button component definition, token values, and WCAG requirements. The do/don't guidelines address the most common misuse patterns observed in design system adoption: multiple primary buttons, missing accessible names, and inappropriate variant selection.",
};
