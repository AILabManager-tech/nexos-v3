import { getTranslations } from "next-intl/server";
import { LazyAboutContent } from "@/components/pages/LazyAboutContent";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://vertex-pmo.vercel.app/${locale}/a-propos`,
      languages: {
        fr: "https://vertex-pmo.vercel.app/fr/a-propos",
        en: "https://vertex-pmo.vercel.app/en/a-propos",
      },
    },
  };
}

export default function AboutPage() {
  return <LazyAboutContent />;
}
