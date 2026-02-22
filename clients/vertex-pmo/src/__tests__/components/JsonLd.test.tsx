import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  JsonLd,
  localBusinessSchema,
  buildServiceSchema,
  buildFaqSchema,
} from "@/components/seo/JsonLd";

describe("JsonLd", () => {
  it("renders a script tag with correct type", () => {
    const { container } = render(<JsonLd data={localBusinessSchema} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });

  it("renders valid JSON content", () => {
    const { container } = render(<JsonLd data={localBusinessSchema} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@type"]).toBe("ProfessionalService");
    expect(parsed.name).toBe("Vertex PMO");
  });
});

describe("localBusinessSchema", () => {
  it("has required LocalBusiness fields", () => {
    expect(localBusinessSchema["@type"]).toBe("ProfessionalService");
    expect(localBusinessSchema.name).toBeDefined();
    expect(localBusinessSchema.address).toBeDefined();
    expect(localBusinessSchema.areaServed).toHaveLength(2);
    expect(localBusinessSchema.serviceType).toHaveLength(3);
    expect(localBusinessSchema.knowsLanguage).toContain("fr");
    expect(localBusinessSchema.knowsLanguage).toContain("en");
  });
});

describe("buildServiceSchema", () => {
  it("builds French service schema", () => {
    const schema = buildServiceSchema("fr");
    expect(schema["@type"]).toBe("Service");
    expect(schema.serviceType).toBe("Gestion de projet");
    expect(schema.hasOfferCatalog.itemListElement).toHaveLength(3);
  });

  it("builds English service schema", () => {
    const schema = buildServiceSchema("en");
    expect(schema.serviceType).toBe("Project Management");
  });
});

describe("buildFaqSchema", () => {
  it("builds FAQPage schema from items", () => {
    const items = [
      { question: "Q1?", answer: "A1" },
      { question: "Q2?", answer: "A2" },
    ];
    const schema = buildFaqSchema(items);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]!["@type"]).toBe("Question");
    expect(schema.mainEntity[0]!.name).toBe("Q1?");
    expect(schema.mainEntity[0]!.acceptedAnswer.text).toBe("A1");
  });
});
