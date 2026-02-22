"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { TextReveal } from "@/components/animations/TextReveal";
import { LineReveal } from "@/components/animations/LineReveal";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Compass, BarChart3, Zap, CheckCircle } from "lucide-react";

const services = [
  {
    key: "consulting",
    Icon: Compass,
    accent: "cobalt",
    gradient: "from-cobalt-500 to-cobalt-700",
    iconBg: "bg-cobalt-100 text-cobalt-600",
    badgeBg: "bg-cobalt-50 text-cobalt-700 border-cobalt-200",
  },
  {
    key: "portfolio",
    Icon: BarChart3,
    accent: "orange",
    gradient: "from-orange-400 to-orange-600",
    iconBg: "bg-orange-100 text-orange-600",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    key: "agile",
    Icon: Zap,
    accent: "success",
    gradient: "from-success-400 to-success-600",
    iconBg: "bg-success-100 text-success-600",
    badgeBg: "bg-success-50 text-success-700 border-success-200",
  },
] as const;

/**
 * Services page content for Vertex PMO.
 * Displays three core service offerings with details, includes lists,
 * duration/result badges, and a FAQ accordion section.
 *
 * @component
 * @example
 * <ServicesContent />
 */
export function ServicesContent() {
  const t = useTranslations("services");

  const faqItems = Array.from({ length: 6 }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`),
  }));

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative flex items-center overflow-hidden bg-cobalt-900 py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt-900 via-cobalt-800 to-cobalt-900 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
        <div className="container-narrow relative z-10 text-center">
          <TextReveal as="h1" className="mb-6 font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </TextReveal>
          <AnimatedSection delay={0.4} direction="none">
            <p className="mx-auto max-w-2xl font-body text-lg text-cobalt-200 md:text-xl">
              {t("hero.subtitle")}
            </p>
          </AnimatedSection>
          <LineReveal className="mx-auto mt-10 w-24" color="bg-orange-500" delay={0.6} />
        </div>
      </section>

      {/* ── Service Offerings ── */}
      {services.map(({ key, Icon, gradient, iconBg }, index) => {
        const isEven = index % 2 === 0;
        const items = ["item1", "item2", "item3", "item4"] as const;

        return (
          <section
            key={key}
            className={`relative overflow-hidden py-20 md:py-28 ${
              isEven ? "bg-white" : "bg-slate-50"
            }`}
          >
            <div className="container-wide relative">
              <div className="grid items-start gap-12 md:grid-cols-2 lg:gap-20">
                {/* Text column */}
                <AnimatedSection
                  direction={isEven ? "left" : "right"}
                  className={isEven ? "" : "md:order-2"}
                >
                  {/* Large number watermark */}
                  <span
                    className={`mb-2 inline-block font-heading text-8xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent opacity-20`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Icon + title */}
                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-charcoal md:text-3xl">
                      {t(`${key}.title`)}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="mb-8 font-body text-lg leading-relaxed text-charcoal-light">
                    {t(`${key}.description`)}
                  </p>

                  {/* Includes list */}
                  <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-cobalt-600">
                    {t(`${key}.includes`)}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-3 group">
                        <CheckCircle
                          className="mt-0.5 h-5 w-5 shrink-0 text-success-500 transition-transform group-hover:scale-110"
                          aria-hidden="true"
                        />
                        <span className="font-body text-charcoal-light">
                          {t(`${key}.${item}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AnimatedSection>

                {/* Info card column */}
                <AnimatedSection
                  direction={isEven ? "right" : "left"}
                  delay={0.2}
                  className={isEven ? "" : "md:order-1"}
                >
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                    {/* Duration badge */}
                    <div className="mb-6">
                      <span className="font-heading text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                        {t(`${key}.duration`)}
                      </span>
                    </div>

                    <LineReveal className="mb-6 w-16" color="bg-cobalt-300" delay={0.4} />

                    {/* Result */}
                    <p className="font-heading text-lg font-semibold leading-snug text-charcoal">
                      {t(`${key}.result`)}
                    </p>

                    {/* Decorative accent bar */}
                    <div
                      className={`mt-8 h-1 w-full rounded-full bg-gradient-to-r ${gradient}`}
                    />
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── FAQ Section ── */}
      <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cobalt-500/5 via-transparent to-transparent" />
        <div className="container-narrow relative z-10">
          <AnimatedSection>
            <TextReveal as="h2" className="mb-4 text-center font-heading text-3xl font-bold text-charcoal md:text-4xl">
              {t("faq.title")}
            </TextReveal>
          </AnimatedSection>
          <LineReveal className="mx-auto mb-12 w-24" color="bg-orange-400" delay={0.3} />
          <AnimatedSection delay={0.2}>
            <FaqAccordion items={faqItems} />
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
