import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import BuildPage from "@/app/build/page";
import ValidatePage from "@/app/validate/page";
import DocsPage from "@/app/docs/page";
import HistoryPage from "@/app/history/page";

expect.extend(toHaveNoViolations);

// Mock sonner
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe("Build Page", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it("has no WCAG violations on input state", async () => {
    const { container } = render(<BuildPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders page heading", () => {
    render(<BuildPage />);
    expect(
      screen.getByRole("heading", { name: /Build Component/i })
    ).toBeInTheDocument();
  });

  it("component type selector uses radiogroup role", () => {
    render(<BuildPage />);
    expect(
      screen.getByRole("radiogroup", { name: /Component type/i })
    ).toBeInTheDocument();
  });

  it("each component type chip has radio role and aria-checked", () => {
    render(<BuildPage />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("aria-checked");
    });
  });

  it("selecting a component type updates aria-checked", async () => {
    const user = userEvent.setup();
    render(<BuildPage />);

    const buttonChip = screen.getByRole("radio", { name: "Button" });
    expect(buttonChip).toHaveAttribute("aria-checked", "false");

    await user.click(buttonChip);
    expect(buttonChip).toHaveAttribute("aria-checked", "true");
  });

  it("component chips are keyboard navigable", async () => {
    const user = userEvent.setup();
    render(<BuildPage />);

    const buttonChip = screen.getByRole("radio", { name: "Button" });
    buttonChip.focus();
    expect(document.activeElement).toBe(buttonChip);

    await user.keyboard("{Enter}");
    expect(buttonChip).toHaveAttribute("aria-checked", "true");
  });

  it("form labels are associated with inputs", () => {
    render(<BuildPage />);
    expect(screen.getByLabelText(/Usage Context/i)).toBeInTheDocument();
  });

  it("generate button is disabled when required fields are empty", () => {
    render(<BuildPage />);
    const btn = screen.getByRole("button", { name: /Generate Component Spec/i });
    expect(btn).toBeDisabled();
  });

  it("generate button enables when component type and context are filled", async () => {
    const user = userEvent.setup();
    render(<BuildPage />);

    await user.click(screen.getByRole("radio", { name: "Button" }));
    await user.type(screen.getByLabelText(/Usage Context/i), "dashboard");

    const btn = screen.getByRole("button", { name: /Generate Component Spec/i });
    expect(btn).toBeEnabled();
  });

  it("accessibility level buttons are keyboard activatable", async () => {
    const user = userEvent.setup();
    render(<BuildPage />);

    const aaaBtn = screen.getByRole("button", { name: /WCAG AAA/i });
    aaaBtn.focus();
    await user.keyboard("{Enter}");

    // AAA should now be selected (has primary styling)
    expect(aaaBtn.className).toContain("primary");
  });
});

describe("Validate Page", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it("has no WCAG violations on input state", async () => {
    const { container } = render(<ValidatePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders page heading", () => {
    render(<ValidatePage />);
    expect(
      screen.getByRole("heading", { name: /Validate Code/i })
    ).toBeInTheDocument();
  });

  it("code textarea has accessible label", () => {
    render(<ValidatePage />);
    expect(screen.getByLabelText(/Paste your component code/i)).toBeInTheDocument();
  });

  it("load sample button is accessible", () => {
    render(<ValidatePage />);
    expect(
      screen.getByRole("button", { name: /Load sample/i })
    ).toBeInTheDocument();
  });

  it("loads sample code on button click", async () => {
    const user = userEvent.setup();
    render(<ValidatePage />);

    await user.click(screen.getByRole("button", { name: /Load sample/i }));

    const textarea = screen.getByLabelText(/Paste your component code/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain("IconButton");
  });

  it("validate button is disabled when code is empty", () => {
    render(<ValidatePage />);
    const btn = screen.getByRole("button", { name: /Validate Against System/i });
    expect(btn).toBeDisabled();
  });

  it("validate button enables after entering code", async () => {
    const user = userEvent.setup();
    render(<ValidatePage />);

    await user.type(
      screen.getByLabelText(/Paste your component code/i),
      "const x = 1;"
    );

    const btn = screen.getByRole("button", { name: /Validate Against System/i });
    expect(btn).toBeEnabled();
  });
});

describe("Docs Page", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it("has no WCAG violations on select state", async () => {
    const { container } = render(<DocsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders page heading", () => {
    render(<DocsPage />);
    expect(
      screen.getByRole("heading", { name: /Generate Docs/i })
    ).toBeInTheDocument();
  });

  it("component selector uses radiogroup role", () => {
    render(<DocsPage />);
    expect(
      screen.getByRole("radiogroup", { name: /Select component to document/i })
    ).toBeInTheDocument();
  });

  it("each component card has radio role with aria-checked", () => {
    render(<DocsPage />);
    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("aria-checked", "false");
    });
  });

  it("selecting a component updates aria-checked", async () => {
    const user = userEvent.setup();
    render(<DocsPage />);

    const radios = screen.getAllByRole("radio");
    await user.click(radios[0]);
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
  });

  it("generate button is disabled until component is selected", () => {
    render(<DocsPage />);
    const btn = screen.getByRole("button", { name: /Generate Documentation/i });
    expect(btn).toBeDisabled();
  });

  it("generate button enables after selecting component", async () => {
    const user = userEvent.setup();
    render(<DocsPage />);

    await user.click(screen.getAllByRole("radio")[0]);

    const btn = screen.getByRole("button", { name: /Generate Documentation/i });
    expect(btn).toBeEnabled();
  });
});

describe("History Page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("has no WCAG violations", async () => {
    const { container } = render(<HistoryPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders page heading", () => {
    render(<HistoryPage />);
    expect(
      screen.getByRole("heading", { name: /Run History/i })
    ).toBeInTheDocument();
  });

  it("shows empty state when no runs exist", () => {
    render(<HistoryPage />);
    expect(screen.getByText(/No runs yet/i)).toBeInTheDocument();
  });

  it("empty state has navigation links", () => {
    render(<HistoryPage />);
    expect(screen.getByRole("button", { name: /Build/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Validate/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Docs/i })).toBeInTheDocument();
  });

  it("delete buttons have accessible labels", () => {
    localStorage.setItem(
      "interface-intelligence-runs",
      JSON.stringify([
        {
          id: "test-1",
          workflowType: "build",
          input: { componentType: "Button", context: "test", constraints: "", accessibilityLevel: "AA" },
          result: null,
          status: "complete",
          createdAt: new Date().toISOString(),
        },
      ])
    );

    render(<HistoryPage />);
    const deleteBtn = screen.getByRole("button", { name: /Delete/i });
    expect(deleteBtn).toHaveAttribute("aria-label");
  });
});
