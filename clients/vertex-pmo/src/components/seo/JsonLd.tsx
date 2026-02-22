interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Vertex PMO",
  description:
    "Firme de gestion de projet spécialisée en consultation PMO, gestion de portefeuille et transformation Agile. Gatineau-Ottawa.",
  url: "https://vertex-pmo.vercel.app",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gatineau",
    addressRegion: "QC",
    addressCountry: "CA",
  },
  areaServed: [
    {
      "@type": "AdministrativeArea",
      name: "Québec",
    },
    {
      "@type": "AdministrativeArea",
      name: "Ontario",
    },
  ],
  priceRange: "$$$",
  serviceType: [
    "Consultation PMO stratégique",
    "Gestion de portefeuille de projets",
    "Transformation Agile",
  ],
  knowsLanguage: ["fr", "en"],
};

export function buildServiceSchema(locale: string) {
  const isFr = locale === "fr";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "ProfessionalService",
      name: "Vertex PMO",
    },
    serviceType: isFr ? "Gestion de projet" : "Project Management",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Gatineau-Ottawa, Canada",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isFr ? "Services PMO" : "PMO Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isFr ? "Consultation PMO stratégique" : "Strategic PMO Consulting",
            description: isFr
              ? "Mise en place d'un bureau de projet adapté : évaluation de maturité, design du modèle PMO, processus et outils."
              : "Setting up a tailored project office: maturity assessment, PMO model design, processes and tools.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isFr ? "Gestion de portefeuille" : "Portfolio Management",
            description: isFr
              ? "Visibilité complète sur vos projets : priorisation, dashboard temps réel, allocation des ressources."
              : "Complete project visibility: prioritization, real-time dashboard, resource allocation.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isFr ? "Transformation Agile" : "Agile Transformation",
            description: isFr
              ? "Accompagnement du waterfall vers l'Agile : évaluation, framework, formation et coaching d'équipes."
              : "Guiding the shift from waterfall to Agile: assessment, framework, training and team coaching.",
          },
        },
      ],
    },
  };
}

export function buildFaqSchema(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
