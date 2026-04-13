import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BuildPage from "@/app/build/page";
import ValidatePage from "@/app/validate/page";
import DocsPage from "@/app/docs/page";
import HistoryPage from "@/app/history/page";
import { SectionCard } from "@/components/section-card";
import { GeneratingState } from "@/components/loading-states";
import { SeverityBadge } from "@/components/severity-badge";

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

global.fetch = jest.fn();

describe("Screen Reader: Landmarks and Headings", () => {
  it("Build page has a main heading", () => {
    render(<BuildPage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Build Component/i);
  });

  it("Validate page has a main heading", () => {
    render(<ValidatePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Validate Code/i);
  });

  it("Docs page has a main heading", () => {
    render(<DocsPage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Generate Docs/i);
  });

  it("History page has a main heading", () => {
    render(<HistoryPage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Run History/i);
  });
});

describe("Screen Reader: Decorative Icons", () => {
  it("Build page icons are hidden from screen readers", () => {
    const { container } = render(<BuildPage />);
    const svgs = container.querySelectorAll("svg");
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("Validate page icons are hidden from screen readers", () => {
    const { container } = render(<ValidatePage />);
    const svgs = container.querySelectorAll("svg");
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("SeverityBadge icons are hidden from screen readers", () => {
    const { container } = render(<SeverityBadge severity="error" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Screen Reader: Form Associations", () => {
  it("Build page: labels are associated with form fields", () => {
    render(<BuildPage />);
    // Component Type label is associated with the custom input field
    expect(screen.getByLabelText(/Usage Context/i)).toBeInTheDocument();
    // The radiogroup has its own aria-label
    expect(screen.getByRole("radiogroup", { name: /Component type/i })).toBeInTheDocument();
  });

  it("Validate page: labels are associated with form fields", () => {
    render(<ValidatePage />);
    expect(screen.getByLabelText(/Paste your component code/i)).toBeInTheDocument();
  });

  it("Docs page: radiogroup has accessible name", () => {
    render(<DocsPage />);
    expect(
      screen.getByRole("radiogroup", { name: /Select component to document/i })
    ).toBeInTheDocument();
  });

  it("Build page: radiogroup has accessible name", () => {
    render(<BuildPage />);
    expect(
      screen.getByRole("radiogroup", { name: /Component type/i })
    ).toBeInTheDocument();
  });
});

describe("Screen Reader: Dynamic Content", () => {
  it("loading state announces to screen readers", () => {
    render(<GeneratingState workflow="build" />);
    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-label", "Generating results");
  });

  it("loading state has sr-only announcement text", () => {
    render(<GeneratingState workflow="build" />);
    expect(
      screen.getByText("Generating results. Please wait.")
    ).toBeInTheDocument();
  });

  it("SectionCard collapse announces state", () => {
    render(
      <SectionCard
        title="Test"
        icon={<span />}
      >
        <p>Content</p>
      </SectionCard>
    );
    const toggle = screen.getByRole("button", { name: /Test/i });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});

describe("Screen Reader: Meaningful Button Labels", () => {
  it("Build page: generate button is descriptive", () => {
    render(<BuildPage />);
    expect(
      screen.getByRole("button", { name: /Generate Component Spec/i })
    ).toBeInTheDocument();
  });

  it("Validate page: validate button is descriptive", () => {
    render(<ValidatePage />);
    expect(
      screen.getByRole("button", { name: /Validate Against System/i })
    ).toBeInTheDocument();
  });

  it("Docs page: generate button is descriptive", () => {
    render(<DocsPage />);
    expect(
      screen.getByRole("button", { name: /Generate Documentation/i })
    ).toBeInTheDocument();
  });

  it("no buttons with generic labels like 'click here' or 'submit'", () => {
    render(<BuildPage />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      const name = btn.textContent?.toLowerCase() || btn.getAttribute("aria-label")?.toLowerCase() || "";
      expect(name).not.toMatch(/^(click here|submit|click|go)$/);
    });
  });
});

describe("Screen Reader: Color Not Sole Indicator", () => {
  it("severity badges include text labels, not just color", () => {
    const { container } = render(
      <>
        <SeverityBadge severity="error" />
        <SeverityBadge severity="warning" />
        <SeverityBadge severity="info" />
      </>
    );

    expect(screen.getByText("error")).toBeInTheDocument();
    expect(screen.getByText("warning")).toBeInTheDocument();
    expect(screen.getByText("info")).toBeInTheDocument();
  });
});
