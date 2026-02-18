import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

const mockItems = [
  { question: "Question 1?", answer: "Answer 1" },
  { question: "Question 2?", answer: "Answer 2" },
  { question: "Question 3?", answer: "Answer 3" },
];

afterEach(cleanup);

describe("FaqAccordion", () => {
  it("renders all questions", () => {
    render(<FaqAccordion items={mockItems} />);
    expect(screen.getByText("Question 1?")).toBeInTheDocument();
    expect(screen.getByText("Question 2?")).toBeInTheDocument();
    expect(screen.getByText("Question 3?")).toBeInTheDocument();
  });

  it("renders all answers in DOM", () => {
    render(<FaqAccordion items={mockItems} />);
    expect(screen.getByText("Answer 1")).toBeInTheDocument();
    expect(screen.getByText("Answer 2")).toBeInTheDocument();
  });

  it("all items start collapsed (aria-expanded=false)", () => {
    render(<FaqAccordion items={mockItems} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("expands an item on click", () => {
    render(<FaqAccordion items={mockItems} />);
    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]!);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
  });

  it("collapses an expanded item on second click", () => {
    render(<FaqAccordion items={mockItems} />);
    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]!);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(buttons[0]!);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("only one item can be open at a time", () => {
    render(<FaqAccordion items={mockItems} />);
    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]!);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(buttons[1]!);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "true");
  });
});
