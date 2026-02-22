"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { TextReveal } from "@/components/animations/TextReveal";
import { LineReveal } from "@/components/animations/LineReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useInView, useReducedMotion } from "@/hooks/useAnimations";

const AuroraBackground = dynamic(
  () =>
    import("@/components/animations/AuroraBackground").then((m) => ({
      default: m.AuroraBackground,
    })),
  { ssr: false, loading: () => null }
);

const FloatingElement = dynamic(
  () =>
    import("@/components/animations/FloatingElement").then((m) => ({
      default: m.FloatingElement,
    })),
  { ssr: false, loading: () => null }
);

const values = ["precision", "collaboration", "results"] as const;

const valueColors = [
  { icon: "bg-cobalt-50 text-cobalt-600", hover: "group-hover:text-cobalt-500", accent: "from-cobalt-400 to-cobalt-600", expandBg: "bg-cobalt-50", expandBorder: "border-cobalt-100", expandText: "text-cobalt-700" },
  { icon: "bg-orange-50 text-orange-600", hover: "group-hover:text-orange-500", accent: "from-orange-400 to-orange-600", expandBg: "bg-orange-50", expandBorder: "border-orange-100", expandText: "text-orange-700" },
  { icon: "bg-success-50 text-success-600", hover: "group-hover:text-success-500", accent: "from-success-400 to-success-600", expandBg: "bg-success-50", expandBorder: "border-success-100", expandText: "text-success-700" },
];

const valueIcons = [
  /* Precision — crosshair/target */
  <svg key="precision" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </svg>,
  /* Collaboration — users */
  <svg key="collaboration" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>,
  /* Results — trending up */
  <svg key="results" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>,
];

function ValueCard({
  valueKey,
  icon,
  index,
}: {
  valueKey: string;
  icon: React.ReactNode;
  index: number;
}) {
  const t = useTranslations("about.values");
  const [expanded, setExpanded] = useState(false);
  const colors = valueColors[index]!;
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className="group"
      style={{
        opacity: shouldReduceMotion || isInView ? 1 : 0,
        transform: shouldReduceMotion || isInView ? "none" : "translateY(30px)",
        transition: shouldReduceMotion
          ? "none"
          : `opacity 0.5s ease-out ${index * 0.15}s, transform 0.5s ease-out ${index * 0.15}s`,
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full card-elevated text-left"
        aria-expanded={expanded}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.icon} transition-colors`}
          >
            {icon}
          </div>
          <h3
            className={`text-charcoal transition-colors ${colors.hover}`}
          >
            {t(`${valueKey}.title`)}
          </h3>
          <span
            className="ml-auto text-charcoal-light"
            style={{
              display: "inline-block",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            ▾
          </span>
        </div>
        <p className="text-charcoal-light">{t(`${valueKey}.description`)}</p>

        {expanded && (
          <div
            className="overflow-hidden"
            style={{ animation: "fadeInScale 0.3s ease-out" }}
          >
            <div
              className={`mt-4 rounded-xl ${colors.expandBg} p-4 border ${colors.expandBorder}`}
            >
              <p className={`text-sm italic ${colors.expandText}`}>
                {t(`${valueKey}.example`)}
              </p>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

/**
 * About page content with hero, story, philosophy, and expandable value cards.
 * Design: cobalt / orange / success / slate / charcoal palette for Vertex PMO.
 *
 * @component
 * @example
 * <AboutContent />
 */
export function AboutContent() {
  const t = useTranslations("about");

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80&auto=format"
          alt="Rencontre stratégique d'une équipe de gestion de projet"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-image-overlay" />
        <AuroraBackground />

        <div className="container-narrow relative z-10 text-center section-padding">
          <TextReveal className="mb-4 !text-white">{t("hero.title")}</TextReveal>
          <AnimatedSection delay={0.4} direction="none">
            <p className="text-lg text-slate-300/90 md:text-xl leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </AnimatedSection>
          <LineReveal className="mx-auto mt-8 w-24" color="bg-orange-400" delay={0.6} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-100 to-transparent" />
      </section>

      {/* ── Story ────────────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-bg" />
        <div className="container-wide relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div>
              <AnimatedSection>
                <TextReveal as="h2" className="mb-4">
                  {t("story.title")}
                </TextReveal>
              </AnimatedSection>
              <LineReveal className="mb-8 w-16" color="bg-cobalt-400" delay={0.3} />
              <AnimatedSection delay={0.2}>
                <div className="space-y-5 text-lg leading-relaxed text-charcoal-light">
                  <p>{t("story.p1")}</p>
                  <p>{t("story.p2")}</p>
                  <p>{t("story.p3")}</p>
                </div>
              </AnimatedSection>
            </div>

            {/* Image */}
            <AnimatedSection direction="right" delay={0.3}>
              <FloatingElement amplitude={8} duration={7}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80&auto=format"
                    alt="Fondateurs planifiant la vision de l'entreprise"
                    width={800}
                    height={600}
                    className="object-cover w-full h-[420px]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/40 via-transparent to-transparent" />
                </div>
              </FloatingElement>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Philosophy ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Image side */}
          <div className="relative min-h-[450px]">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format"
              alt="Collaboration d'equipe autour d'un plan de projet"
              fill
              className="object-cover"
              sizes="50vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-cobalt-700/20" />
          </div>

          {/* Text side */}
          <div className="section-padding flex items-center bg-slate-100">
            <div className="max-w-lg">
              <AnimatedSection>
                <TextReveal as="h2" className="mb-4">
                  {t("philosophy.title")}
                </TextReveal>
              </AnimatedSection>
              <LineReveal className="mb-6 w-16" color="bg-orange-400" delay={0.3} />
              <AnimatedSection delay={0.2}>
                <p className="text-lg leading-relaxed text-charcoal-light">
                  {t("philosophy.p1")}
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.4}>
                <div className="mt-8">
                  <MagneticButton
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-cobalt-600 px-8 py-4 text-base font-medium text-white transition-all hover:bg-cobalt-700 hover:shadow-xl hover:shadow-cobalt-500/25"
                    strength={0.3}
                  >
                    {t("philosophy.cta")}
                  </MagneticButton>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-bg" />
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <TextReveal as="h2" className="mb-4 text-center">
              {t("values.title")}
            </TextReveal>
          </AnimatedSection>
          <LineReveal className="mx-auto mb-12 w-24" color="bg-cobalt-400" delay={0.3} />

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((key, i) => (
              <ValueCard
                key={key}
                valueKey={key}
                icon={valueIcons[i]}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
