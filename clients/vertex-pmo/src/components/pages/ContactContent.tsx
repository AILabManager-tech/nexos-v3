"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Mail, MapPin, Phone } from "lucide-react";

const AuroraBackground = dynamic(
  () =>
    import("@/components/animations/AuroraBackground").then((m) => ({
      default: m.AuroraBackground,
    })),
  { ssr: false, loading: () => null }
);

export function ContactContent() {
  const t = useTranslations("contact");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(t("form.success") || "Message envoyé avec succès !");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error(t("form.error") || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80&auto=format"
          alt="Salle de réunion moderne pour consultation en gestion de projet"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-image-overlay" />
        <AuroraBackground />
        <div className="container-narrow text-center relative z-10 section-padding">
          <AnimatedSection direction="none">
            <h1 className="mb-4 !text-white">{t("hero.title")}</h1>
            <p className="text-lg text-slate-300/90 md:text-xl">
              {t("hero.subtitle")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-bg" />
        <div className="container-wide relative z-10">
          <div className="grid gap-12 md:grid-cols-5">
            {/* Form */}
            <AnimatedSection direction="left" className="md:col-span-3">
              <form className="card-elevated space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-charcoal">
                      {t("form.name")}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-charcoal transition-all focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
                      {t("form.email")}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-charcoal transition-all focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500/20 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-charcoal">
                      {t("form.company")}
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-charcoal transition-all focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="project-type" className="mb-1.5 block text-sm font-medium text-charcoal">
                      {t("form.project_type")}
                    </label>
                    <input
                      id="project-type"
                      name="project-type"
                      type="text"
                      className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-charcoal transition-all focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500/20 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="challenge" className="mb-1.5 block text-sm font-medium text-charcoal">
                    {t("form.challenge")}
                  </label>
                  <textarea
                    id="challenge"
                    name="challenge"
                    rows={5}
                    required
                    placeholder={t("form.challenge_placeholder")}
                    className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-charcoal transition-all focus:border-cobalt-500 focus:outline-none focus:ring-2 focus:ring-cobalt-500/20 focus:bg-white"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-cobalt-500 focus:ring-cobalt-500/20"
                  />
                  <span className="text-sm text-slate-700">
                    {t("form.consent_notice")}
                  </span>
                </label>

                <Button type="submit" size="lg" disabled={sending}>
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t("form.sending") || "Envoi..."}
                    </span>
                  ) : (
                    t("form.submit")
                  )}
                </Button>

                <p className="text-sm text-slate-700">{t("form.response_time")}</p>
              </form>
            </AnimatedSection>

            {/* Info sidebar */}
            <AnimatedSection direction="right" delay={0.2} className="md:col-span-2">
              <div className="card-elevated !bg-cobalt-600 !border-cobalt-700 text-white">
                <h2 className="mb-6 text-cobalt-100 text-xl font-heading font-bold">
                  {t("info.title")}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-cobalt-100 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-cobalt-100">{t("info.email_label")}</p>
                      <a href="mailto:info@vertex-pmo.ca" className="text-cobalt-100 transition-colors hover:text-white">
                        info@vertex-pmo.ca
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-cobalt-100 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-cobalt-100">{t("info.phone_label")}</p>
                      <a href="tel:+18195551234" className="text-cobalt-100 transition-colors hover:text-white">
                        (819) 555-1234
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-cobalt-100 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-cobalt-100">{t("info.location_label")}</p>
                      <p className="text-cobalt-100">{t("info.location")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-cobalt-100 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-cobalt-100">{t("info.linkedin")}</p>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cobalt-100 transition-colors hover:text-white"
                      >
                        Vertex PMO
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
}
