import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "fr",
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...rest}>
        {children}
      </div>
    ),
    span: ({
      children,
      ...rest
    }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...rest}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => (
    <img alt={props.alt} src={props.src} />
  ),
}));

vi.mock("@/components/animations/TextReveal", () => ({
  TextReveal: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <h2>{children}</h2>,
}));

vi.mock("@/components/animations/AuroraBackground", () => ({
  AuroraBackground: () => <div data-testid="aurora" />,
}));

vi.mock("@/components/animations/LineReveal", () => ({
  LineReveal: () => <div data-testid="line-reveal" />,
}));

vi.mock("@/components/animations/CountUp", () => ({
  CountUp: ({ to, suffix }: { to: number; suffix: string }) => (
    <span>
      {to}
      {suffix}
    </span>
  ),
}));

vi.mock("@/components/ui/AnimatedSection", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { AboutContent } from "@/components/pages/AboutContent";

afterEach(cleanup);

describe("AboutContent", () => {
  it("renders the main element", () => {
    render(<AboutContent />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("renders hero title", () => {
    render(<AboutContent />);
    expect(screen.getByText("hero.title")).toBeInTheDocument();
  });

  it("renders story section", () => {
    render(<AboutContent />);
    expect(screen.getByText("story.title")).toBeInTheDocument();
    expect(screen.getByText("story.p1")).toBeInTheDocument();
  });

  it("renders philosophy section", () => {
    render(<AboutContent />);
    expect(screen.getByText("philosophy.title")).toBeInTheDocument();
  });

  it("renders value cards", () => {
    render(<AboutContent />);
    expect(screen.getByText("empathy.title")).toBeInTheDocument();
    expect(screen.getByText("transparency.title")).toBeInTheDocument();
    expect(screen.getByText("autonomy.title")).toBeInTheDocument();
  });

  it("renders stats section", () => {
    render(<AboutContent />);
    expect(screen.getByText("12 ans")).toBeInTheDocument();
    expect(screen.getByText("3 ans")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
