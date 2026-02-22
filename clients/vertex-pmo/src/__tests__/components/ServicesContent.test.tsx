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

vi.mock("@/components/animations/StaggerGrid", () => ({
  StaggerGrid: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

vi.mock("@/components/ui/AnimatedSection", () => ({
  AnimatedSection: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/FaqAccordion", () => ({
  FaqAccordion: ({ items }: { items: { question: string; answer: string }[] }) => (
    <div data-testid="faq-accordion">
      {items.map((item, i) => (
        <div key={i}>{item.question}</div>
      ))}
    </div>
  ),
}));

import { ServicesContent } from "@/components/pages/ServicesContent";

afterEach(cleanup);

describe("ServicesContent", () => {
  it("renders the main element", () => {
    render(<ServicesContent />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("renders hero title", () => {
    render(<ServicesContent />);
    expect(screen.getByText("hero.title")).toBeInTheDocument();
  });

  it("renders service sections", () => {
    render(<ServicesContent />);
    expect(screen.getByText("consulting.title")).toBeInTheDocument();
    expect(screen.getByText("portfolio.title")).toBeInTheDocument();
    expect(screen.getByText("agile.title")).toBeInTheDocument();
  });

  it("renders FAQ section", () => {
    render(<ServicesContent />);
    expect(screen.getByText("faq.title")).toBeInTheDocument();
    expect(screen.getByTestId("faq-accordion")).toBeInTheDocument();
  });

  it("renders service include lists", () => {
    render(<ServicesContent />);
    expect(screen.getByText("consulting.item1")).toBeInTheDocument();
    expect(screen.getByText("portfolio.item1")).toBeInTheDocument();
    expect(screen.getByText("agile.item1")).toBeInTheDocument();
  });
});
