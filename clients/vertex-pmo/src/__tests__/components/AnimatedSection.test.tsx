import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";

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
    const { container } = render(
      <AnimatedSection className="my-class">
        <p>Test</p>
      </AnimatedSection>
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("my-class");
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
