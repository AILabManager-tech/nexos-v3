import { render, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "fr",
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />,
}));

afterEach(cleanup);

import { AuroraBackground } from "@/components/animations/AuroraBackground";
import { CountUp } from "@/components/animations/CountUp";
import { FloatingElement } from "@/components/animations/FloatingElement";
import { LineReveal } from "@/components/animations/LineReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ParallaxSection } from "@/components/animations/ParallaxSection";
import { StaggerGrid } from "@/components/animations/StaggerGrid";
import { TextReveal } from "@/components/animations/TextReveal";

describe("Animation components smoke tests", () => {
  it("AuroraBackground renders", () => {
    const { container } = render(<AuroraBackground />);
    expect(container.firstChild).toBeTruthy();
  });

  it("CountUp renders with props", () => {
    const { container } = render(<CountUp to={100} suffix="+" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("FloatingElement renders with children", () => {
    const { getByText } = render(
      <FloatingElement><span>child</span></FloatingElement>
    );
    expect(getByText("child")).toBeInTheDocument();
  });

  it("LineReveal renders", () => {
    const { container } = render(<LineReveal />);
    expect(container.firstChild).toBeTruthy();
  });

  it("MagneticButton renders with children", () => {
    const { getByText } = render(
      <MagneticButton href="/test">Click</MagneticButton>
    );
    expect(getByText("Click")).toBeInTheDocument();
  });

  it("ParallaxSection renders with children", () => {
    const { getByText } = render(
      <ParallaxSection><p>parallax</p></ParallaxSection>
    );
    expect(getByText("parallax")).toBeInTheDocument();
  });

  it("StaggerGrid renders with children", () => {
    const { getByText } = render(
      <StaggerGrid>{[<div key="a">item1</div>, <div key="b">item2</div>]}</StaggerGrid>
    );
    expect(getByText("item1")).toBeInTheDocument();
  });

  it("TextReveal renders with children", () => {
    const { getByText } = render(
      <TextReveal>Revealed text</TextReveal>
    );
    expect(getByText("Revealed")).toBeInTheDocument();
  });
});
