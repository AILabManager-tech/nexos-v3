interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a JSON-LD structured data script tag for SEO.
 *
 * @component
 * @param {JsonLdProps} props - The structured data object to serialize.
 * @example
 * <JsonLd data={localBusinessSchema} />
 */
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
  "@type": "LocalBusiness",
  name: "L'Usine RH",
  description:
    "Consultante RH pour PME de 15 à 50 employés au Québec. Diagnostic organisationnel, implantation de processus RH et coaching de gestionnaires.",
  url: "https://emiliepoirierrh.ca",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Québec",
    addressRegion: "QC",
    addressCountry: "CA",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Québec",
  },
  priceRange: "$$",
  serviceType: [
    "Diagnostic organisationnel",
    "Implantation de processus RH",
    "Coaching de gestionnaires",
  ],
  knowsLanguage: ["fr", "en"],
};

export function buildServiceSchema(locale: string) {
  const isFr = locale === "fr";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "LocalBusiness",
      name: isFr ? "L'Usine RH" : "HR Factory",
    },
    serviceType: isFr ? "Consultation RH" : "HR Consulting",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Québec, Canada",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isFr ? "Services RH" : "HR Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isFr ? "Diagnostic organisationnel" : "Organizational Diagnostic",
            description: isFr
              ? "Analyse complète de la situation RH : entretiens, audit des processus, rapport de recommandations."
              : "Complete HR situation analysis: interviews, process audit, recommendations report.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isFr ? "Implantation de processus RH" : "HR Process Implementation",
            description: isFr
              ? "Mise en place de processus durables : recrutement, évaluation, rétention, conformité."
              : "Implementation of lasting processes: recruitment, evaluation, retention, compliance.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isFr ? "Coaching de gestionnaires" : "Management Coaching",
            description: isFr
              ? "Formation des gestionnaires en conversations difficiles, délégation, leadership."
              : "Training managers in difficult conversations, delegation, leadership.",
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
