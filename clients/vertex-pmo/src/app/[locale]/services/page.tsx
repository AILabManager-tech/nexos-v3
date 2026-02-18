import { getTranslations } from "next-intl/server";
import { ServicesContent } from "@/components/pages/ServicesContent";
import { JsonLd, buildServiceSchema, buildFaqSchema } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://emiliepoirierrh.ca/${locale}/services`,
      languages: {
        fr: "https://emiliepoirierrh.ca/fr/services",
        en: "https://emiliepoirierrh.ca/en/services",
      },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.faq" });
  const faqItems = Array.from({ length: 6 }, (_, i) => ({
    question: t(`q${i + 1}`),
    answer: t(`a${i + 1}`),
  }));

  return (
    <>
      <JsonLd data={buildServiceSchema(locale)} />
      <JsonLd data={buildFaqSchema(faqItems)} />
      <ServicesContent />
    </>
  );
}
