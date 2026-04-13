import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { SectionCard } from "@/components/section-card";
import { CodeBlock } from "@/components/code-block";
import { SeverityBadge } from "@/components/severity-badge";
import { TokenPanel } from "@/components/token-panel";
import { GeneratingState } from "@/components/loading-states";
import { InspectPrompt } from "@/components/inspect-prompt";

expect.extend(toHaveNoViolations);

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: { success: jest.fn() },
}));

describe("SectionCard", () => {
  const defaultProps = {
    title: "Component Structure",
    icon: <span data-testid="icon" />,
    children: <p>Test content</p>,
  };

  it("has no WCAG violations", async () => {
    const { container } = render(<SectionCard {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders as expanded by default", () => {
    render(<SectionCard {...defaultProps} />);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("collapse button has aria-expanded attribute", () => {
    render(<SectionCard {...defaultProps} />);
    const toggle = screen.getByRole("button", { name: /Component Structure/i });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles content visibility on click", async () => {
    const user = userEvent.setup();
    render(<SectionCard {...defaultProps} />);

    const toggle = screen.getByRole("button", { name: /Component Structure/i });
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Test content")).not.toBeInTheDocument();
  });

  it("toggles content with Enter key", async () => {
    const user = userEvent.setup();
    render(<SectionCard {...defaultProps} />);

    const toggle = screen.getByRole("button", { name: /Component Structure/i });
    toggle.focus();
    await user.keyboard("{Enter}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles content with Space key", async () => {
    const user = userEvent.setup();
    render(<SectionCard {...defaultProps} />);

    const toggle = screen.getByRole("button", { name: /Component Structure/i });
    toggle.focus();
    await user.keyboard(" ");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("copy button has accessible label", () => {
    render(<SectionCard {...defaultProps} copyContent="test" />);
    expect(
      screen.getByRole("button", { name: /Copy Component Structure content/i })
    ).toBeInTheDocument();
  });

  it("reasoning button has aria-expanded", () => {
    render(
      <SectionCard {...defaultProps} reasoning="Because tokens matter" />
    );
    const btn = screen.getByRole("button", { name: /Show reasoning/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("shows reasoning panel when toggled", async () => {
    const user = userEvent.setup();
    render(
      <SectionCard {...defaultProps} reasoning="Because tokens matter" />
    );

    await user.click(screen.getByRole("button", { name: /Show reasoning/i }));
    expect(screen.getByText("Because tokens matter")).toBeInTheDocument();
  });
});

describe("CodeBlock", () => {
  it("has no WCAG violations", async () => {
    const { container } = render(
      <CodeBlock code="const x = 1;" language="tsx" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders code content", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("copy button has accessible label", () => {
    render(<CodeBlock code="test" />);
    expect(screen.getByRole("button", { name: /Copy code/i })).toBeInTheDocument();
  });
});

describe("SeverityBadge", () => {
  it("has no WCAG violations for error", async () => {
    const { container } = render(<SeverityBadge severity="error" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no WCAG violations for warning", async () => {
    const { container } = render(<SeverityBadge severity="warning" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no WCAG violations for info", async () => {
    const { container } = render(<SeverityBadge severity="info" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("displays severity text", () => {
    render(<SeverityBadge severity="error" />);
    expect(screen.getByText("error")).toBeInTheDocument();
  });

  it("hides decorative icon from screen readers", () => {
    const { container } = render(<SeverityBadge severity="error" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});

describe("TokenPanel", () => {
  const tokenGroups = [
    {
      name: "Colors",
      tokens: [
        { name: "primary", value: "#5c756c", type: "color" as const, description: "Brand" },
        { name: "surface", value: "#f7f9f8", type: "color" as const },
      ],
    },
    {
      name: "Spacing",
      tokens: [
        { name: "space-4", value: "1rem", type: "spacing" as const, description: "Default" },
      ],
    },
  ];

  it("has no WCAG violations", async () => {
    const { container } = render(<TokenPanel tokenGroups={tokenGroups} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders group names", () => {
    render(<TokenPanel tokenGroups={tokenGroups} />);
    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.getByText("Spacing")).toBeInTheDocument();
  });

  it("expand buttons have aria-expanded", () => {
    render(<TokenPanel tokenGroups={tokenGroups} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded");
    });
  });

  it("expands group on click to show tokens", async () => {
    const user = userEvent.setup();
    render(<TokenPanel tokenGroups={tokenGroups} />);

    await user.click(screen.getByText("Colors"));
    expect(screen.getByText("primary")).toBeInTheDocument();
  });

  it("renders color swatches with aria-hidden", async () => {
    const user = userEvent.setup();
    const { container } = render(<TokenPanel tokenGroups={tokenGroups} />);

    await user.click(screen.getByText("Colors"));
    const swatches = container.querySelectorAll("[aria-hidden='true']");
    expect(swatches.length).toBeGreaterThan(0);
  });
});

describe("GeneratingState", () => {
  it("has no WCAG violations", async () => {
    const { container } = render(<GeneratingState workflow="build" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has status role for screen readers", () => {
    render(<GeneratingState workflow="build" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has accessible label", () => {
    render(<GeneratingState workflow="build" />);
    expect(
      screen.getByRole("status", { name: /Generating results/i })
    ).toBeInTheDocument();
  });

  it("includes sr-only text for screen readers", () => {
    render(<GeneratingState workflow="build" />);
    expect(screen.getByText("Generating results. Please wait.")).toBeInTheDocument();
  });
});

describe("InspectPrompt", () => {
  const prompt = {
    system: "You are a design system expert.",
    user: "Build a Button component.",
  };

  it("has no WCAG violations", async () => {
    const { container } = render(<InspectPrompt renderedPrompt={prompt} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders nothing when no prompt provided", () => {
    const { container } = render(<InspectPrompt />);
    expect(container.firstChild).toBeNull();
  });

  it("expand button has aria-expanded", () => {
    render(<InspectPrompt renderedPrompt={prompt} />);
    const toggle = screen.getByRole("button", { name: /Inspect Prompt/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("shows prompt content when expanded", async () => {
    const user = userEvent.setup();
    render(<InspectPrompt renderedPrompt={prompt} />);

    await user.click(screen.getByRole("button", { name: /Inspect Prompt/i }));
    expect(screen.getByText("You are a design system expert.")).toBeInTheDocument();
  });

  it("supports keyboard expansion", async () => {
    const user = userEvent.setup();
    render(<InspectPrompt renderedPrompt={prompt} />);

    const toggle = screen.getByRole("button", { name: /Inspect Prompt/i });
    toggle.focus();
    await user.keyboard("{Enter}");

    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
