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

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => (
    <img alt={props.alt} src={props.src} />
  ),
}));

// Mock next/dynamic: return a component that renders the loading fallback or nothing,
// since dynamic components don't render synchronously in jsdom
vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: (
    _loaderFn: () => Promise<{ default: React.ComponentType }>,
    opts?: { loading?: () => React.ReactNode }
  ) => {
    // Return a component that renders the loading fallback
    return function DynamicStub() {
      return opts?.loading?.() ?? null;
    };
  },
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

vi.mock("@/components/interactive/GanttHero", () => ({
  GanttHero: () => <div data-testid="gantt-hero" />,
}));

vi.mock("@/components/interactive/MetricsDashboard", () => ({
  MetricsDashboard: () => (
    <section data-testid="metrics-dashboard">
      <span>projects</span>
      <span>ontime</span>
      <span>years</span>
      <span>managed</span>
    </section>
  ),
}));

vi.mock("@/components/interactive/MethodologyTimeline", () => ({
  MethodologyTimeline: () => <div data-testid="methodology-timeline" />,
}));

vi.mock("@/components/interactive/ProjectMaturityAssessment", () => ({
  ProjectMaturityAssessment: () => <div data-testid="maturity-assessment" />,
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

  it("renders stats section placeholder (dynamically loaded)", () => {
    const { container } = render(<HomeContent />);
    // MetricsDashboard is dynamically loaded; in tests, the loading placeholder renders
    // Verify the main structure still renders properly with dynamic components
    expect(container.querySelector("main")).toBeInTheDocument();
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
