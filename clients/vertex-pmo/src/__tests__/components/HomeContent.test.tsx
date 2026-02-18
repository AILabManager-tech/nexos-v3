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
    button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
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
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <h1 className={className}>{children}</h1>,
}));

vi.mock("@/components/animations/MagneticButton", () => ({
  MagneticButton: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/animations/AuroraBackground", () => ({
  AuroraBackground: () => <div data-testid="aurora" />,
}));

vi.mock("@/components/animations/CountUp", () => ({
  CountUp: ({ to, suffix }: { to: number; suffix: string }) => (
    <span>
      {to}
      {suffix}
    </span>
  ),
}));

vi.mock("@/components/animations/LineReveal", () => ({
  LineReveal: () => <div data-testid="line-reveal" />,
}));

vi.mock("@/components/animations/FloatingElement", () => ({
  FloatingElement: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/AnimatedSection", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/interactive/ScrollTimeline", () => ({
  ScrollTimeline: () => <div data-testid="scroll-timeline" />,
}));

vi.mock("@/components/interactive/DiagnosticQuiz", () => ({
  DiagnosticQuiz: () => <div data-testid="diagnostic-quiz" />,
}));

vi.mock("@/components/interactive/CostCalculator", () => ({
  CostCalculator: () => <div data-testid="cost-calculator" />,
}));

vi.mock("@/components/interactive/FlipCards", () => ({
  FlipCards: () => <div data-testid="flip-cards" />,
}));

vi.mock("@/components/interactive/TestimonialsCarousel", () => ({
  TestimonialsCarousel: () => <div data-testid="testimonials" />,
}));

vi.mock("@/components/animations/StaggerGrid", () => ({
  StaggerGrid: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

import { HomeContent } from "@/components/pages/HomeContent";

afterEach(cleanup);

describe("HomeContent", () => {
  it("renders the main element", () => {
    render(<HomeContent />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("renders hero section with title", () => {
    render(<HomeContent />);
    expect(screen.getByText("hero.title")).toBeInTheDocument();
  });

  it("renders hero subtitle", () => {
    render(<HomeContent />);
    expect(screen.getByText("hero.subtitle")).toBeInTheDocument();
  });

  it("renders hero CTA buttons", () => {
    render(<HomeContent />);
    expect(screen.getByText("hero.cta")).toBeInTheDocument();
    expect(screen.getByText("hero.cta_secondary")).toBeInTheDocument();
  });

  it("renders stats section", () => {
    render(<HomeContent />);
    expect(screen.getByText("stats.experience")).toBeInTheDocument();
    expect(screen.getByText("stats.clients")).toBeInTheDocument();
    expect(screen.getByText("stats.employees")).toBeInTheDocument();
  });

  it("renders pain points section", () => {
    render(<HomeContent />);
    expect(screen.getByText("pain.title")).toBeInTheDocument();
  });

  it("renders multiple content sections", () => {
    render(<HomeContent />);
    const sections = document.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(3);
  });

  it("renders final CTA", () => {
    render(<HomeContent />);
    expect(screen.getByText("cta_final.title")).toBeInTheDocument();
    expect(screen.getByText("cta_final.button")).toBeInTheDocument();
  });
});
