import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Manrope, Source_Sans_3 } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientWidgets } from "@/components/layout/ClientWidgets";
import { JsonLd, localBusinessSchema } from "@/components/seo/JsonLd";
import type { Metadata, Viewport } from "next";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL("https://vertex-pmo.vercel.app"),
    title: {
      default: t("title"),
      template: "%s | Vertex PMO",
    },
    description: t("description"),
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: locale === "fr" ? "en_CA" : "fr_CA",
      siteName: "Vertex PMO",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `https://vertex-pmo.vercel.app/${locale}`,
      languages: {
        fr: "https://vertex-pmo.vercel.app/fr",
        en: "https://vertex-pmo.vercel.app/en",
      },
    },
    icons: { icon: "/favicon.ico" },
  };
}

export async function generateViewport(): Promise<Viewport> {
  return {
    themeColor: "#2E5BBA",
  };
}

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${manrope.variable} ${sourceSans.variable}`}>
      <head>
        <title>Vertex PMO — Gestion de projet stratégique</title>
        <meta name="description" content={locale === 'fr' ? 'Firme de gestion de projet spécialisée en consultation PMO, gestion de portefeuille et transformation Agile. Livraisons à temps, dans le budget.' : 'Project management firm specializing in PMO consulting, portfolio management and Agile transformation. On time. On budget.'} />
      </head>
      <body className="font-body bg-slate-100 text-charcoal antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-cobalt-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <JsonLd data={localBusinessSchema} />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div id="main-content" className="min-h-screen">{children}</div>
          <Footer />
          <ClientWidgets />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
