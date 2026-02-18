import { getTranslations } from "next-intl/server";
import { ContactContent } from "@/components/pages/ContactContent";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://emiliepoirierrh.ca/${locale}/contact`,
      languages: {
        fr: "https://emiliepoirierrh.ca/fr/contact",
        en: "https://emiliepoirierrh.ca/en/contact",
      },
    },
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
