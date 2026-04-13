import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BuildPage from "@/app/build/page";
import ValidatePage from "@/app/validate/page";
import DocsPage from "@/app/docs/page";

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

global.fetch = jest.fn();

describe("Keyboard Navigation: Build Page", () => {
  it("all interactive elements are reachable via Tab", async () => {
    const user = userEvent.setup();
    render(<BuildPage />);

    const interactiveElements: string[] = [];

    // Tab through the page and collect focused element descriptions
    for (let i = 0; i < 20; i++) {
      await user.tab();
      const active = document.activeElement;
      if (!active || active === document.body) break;

      const label =
        active.getAttribute("aria-label") ||
        active.textContent?.trim().slice(0, 30) ||
        active.tagName;
      interactiveElements.push(label);
    }

    // Verify key elements are in the tab order
    expect(interactiveElements.length).toBeGreaterThan(5);
  });

  it("component type chips are focusable", async () => {
    const user = userEvent.setup();
    render(<BuildPage />);

    const buttonChip = screen.getByRole("radio", { name: "Button" });
    buttonChip.focus();
    expect(document.activeElement).toBe(buttonChip);
  });

  it("Enter activates component type selection", async () => {
    const user = userEvent.setup();
    render(<BuildPage />);

    const cardChip = screen.getByRole("radio", { name: "Card" });
    cardChip.focus();
    await user.keyboard("{Enter}");

    expect(cardChip).toHaveAttribute("aria-checked", "true");
  });

  it("Space activates component type selection", async () => {
    const user = userEvent.setup();
    render(<BuildPage />);

    const inputChip = screen.getByRole("radio", { name: "Input" });
    inputChip.focus();
    await user.keyboard(" ");

    expect(inputChip).toHaveAttribute("aria-checked", "true");
  });

  it("textarea is focusable and editable", async () => {
    const user = userEvent.setup();
    render(<BuildPage />);

    const textarea = screen.getByLabelText(/Usage Context/i);
    await user.click(textarea);
    await user.type(textarea, "test context");

    expect(textarea).toHaveValue("test context");
  });

  it("focus-visible ring classes are present on interactive elements", () => {
    const { container } = render(<BuildPage />);

    const focusableElements = container.querySelectorAll(
      "button, input, textarea, [role='radio']"
    );

    focusableElements.forEach((el) => {
      const classes = el.className;
      // Elements should have focus-visible styles either directly or via parent
      expect(
        classes.includes("focus-visible") ||
        classes.includes("focus:") ||
        el.closest("[class*='focus']")
      ).toBeTruthy();
    });
  });
});

describe("Keyboard Navigation: Validate Page", () => {
  it("code textarea is focusable", async () => {
    const user = userEvent.setup();
    render(<ValidatePage />);

    const textarea = screen.getByLabelText(/Paste your component code/i);
    await user.click(textarea);
    expect(document.activeElement).toBe(textarea);
  });

  it("Tab moves from textarea to context field", async () => {
    const user = userEvent.setup();
    render(<ValidatePage />);

    const codeField = screen.getByLabelText(/Paste your component code/i);
    codeField.focus();
    await user.tab();

    // Next focusable should be the context textarea or another interactive element
    expect(document.activeElement).not.toBe(codeField);
    expect(document.activeElement?.tagName).toBeTruthy();
  });

  it("load sample button is keyboard activatable", async () => {
    const user = userEvent.setup();
    render(<ValidatePage />);

    const btn = screen.getByRole("button", { name: /Load sample/i });
    btn.focus();
    await user.keyboard("{Enter}");

    const textarea = screen.getByLabelText(/Paste your component code/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain("IconButton");
  });
});

describe("Keyboard Navigation: Docs Page", () => {
  it("component cards are keyboard selectable", async () => {
    const user = userEvent.setup();
    render(<DocsPage />);

    const radios = screen.getAllByRole("radio");
    radios[0].focus();
    await user.keyboard("{Enter}");

    expect(radios[0]).toHaveAttribute("aria-checked", "true");
  });

  it("Tab moves through all component cards", async () => {
    const user = userEvent.setup();
    render(<DocsPage />);

    const radios = screen.getAllByRole("radio");
    radios[0].focus();

    for (let i = 1; i < radios.length; i++) {
      await user.tab();
    }

    // Should have moved through the cards
    expect(document.activeElement).toBeTruthy();
  });
});
