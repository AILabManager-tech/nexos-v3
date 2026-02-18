import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} data-testid="animated" {...rest}>
        {children}
      </div>
    ),
  },
  useReducedMotion: () => false,
}));

import { AnimatedSection } from "@/components/ui/AnimatedSection";

afterEach(cleanup);

describe("AnimatedSection", () => {
  it("renders children", () => {
    render(
      <AnimatedSection>
        <p>Hello world</p>
      </AnimatedSection>
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("applies className prop", () => {
    render(
      <AnimatedSection className="my-class">
        <p>Test</p>
      </AnimatedSection>
    );
    expect(screen.getByTestId("animated")).toHaveClass("my-class");
  });

  it("renders with direction=left", () => {
    render(
      <AnimatedSection direction="left">
        <span>Left</span>
      </AnimatedSection>
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
  });

  it("renders with direction=right", () => {
    render(
      <AnimatedSection direction="right">
        <span>Right</span>
      </AnimatedSection>
    );
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("renders with direction=none", () => {
    render(
      <AnimatedSection direction="none">
        <span>None</span>
      </AnimatedSection>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });
});
