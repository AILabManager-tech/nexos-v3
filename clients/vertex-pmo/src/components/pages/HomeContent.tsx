"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { AuroraBackground } from "@/components/animations/AuroraBackground";
import { LineReveal } from "@/components/animations/LineReveal";
import { FloatingElement } from "@/components/animations/FloatingElement";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { StaggerGrid } from "@/components/animations/StaggerGrid";
import { GanttHero } from "@/components/interactive/GanttHero";
import { MetricsDashboard } from "@/components/interactive/MetricsDashboard";
import { MethodologyTimeline } from "@/components/interactive/MethodologyTimeline";
import { ProjectMaturityAssessment } from "@/components/interactive/ProjectMaturityAssessment";
import { Target, BarChart3, Users, TrendingUp } from "lucide-react";

const painIcons = [
  <Target key="scope" className="h-8 w-8" />,
  <BarChart3 key="budget" className="h-8 w-8" />,
  <Users key="team" className="h-8 w-8" />,
];

export function HomeContent() {
  const t = useTranslations("home");

  return (
    <main>
      {/* Hero — full screen with Gantt chart */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80&auto=format"
          alt="Équipe de gestion de projet en réunion stratégique"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-image-overlay" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <AuroraBackground />

        <div className="container-wide relative z-10 section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedSection delay={0.1} direction="none">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-success-400 animate-glow-pulse" />
                  <span className="text-sm font-medium text-slate-300">
                    {t("hero.badge")}
                  </span>
                </div>
              </AnimatedSection>
              <TextReveal className="mb-6 !text-white" delay={0.2}>
                {t("hero.title")}
              </TextReveal>
              <AnimatedSection delay={0.6} direction="none">
                <p className="mb-10 text-lg text-slate-300/90 md:text-xl leading-relaxed">
                  {t("hero.subtitle")}
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.9} direction="none">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <MagneticButton
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/25"
                    strength={0.35}
                  >
                    {t("hero.cta")}
                  </MagneticButton>
                  <MagneticButton
                    href="#services"
                    className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50"
                    strength={0.25}
                  >
                    {t("hero.cta_secondary")}
                  </MagneticButton>
                </div>
              </AnimatedSection>
            </div>

            {/* Gantt chart animation */}
            <AnimatedSection delay={0.5} direction="right">
              <GanttHero />
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-100 to-transparent" />
      </section>

      {/* Stats */}
      <MetricsDashboard />

      {/* Pain Points */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-bg" />
        <div className="container-wide relative">
          <AnimatedSection>
            <TextReveal as="h2" className="mb-4 text-center">
              {t("pain.title")}
            </TextReveal>
          </AnimatedSection>
          <LineReveal className="mx-auto mb-6 w-24" delay={0.3} />

          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <StaggerGrid className="grid gap-5" stagger={0.15}>
              {(["scope", "budget", "team"] as const).map((key, i) => (
                <div key={key} className="group relative rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm border border-white/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-cobalt-200/50">
                  <div className="absolute -left-px top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-cobalt-400 via-orange-400 to-success-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600 transition-colors group-hover:bg-orange-50 group-hover:text-orange-500">
                      {painIcons[i]}
                    </div>
                    <div>
                      <h3 className="text-lg mb-1 text-cobalt-700 transition-colors group-hover:text-orange-500">
                        {t(`pain.${key}.title`)}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{t(`pain.${key}.description`)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerGrid>

            <AnimatedSection direction="right" delay={0.3}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format"
                  alt="Tableau de bord de gestion de projet avec métriques"
                  width={800}
                  height={600}
                  className="object-cover w-full h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-heading text-lg font-bold">{t("pain.image_caption")}</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Methodology Timeline */}
      <MethodologyTimeline />

      {/* Assessment Quiz */}
      <ProjectMaturityAssessment />

      {/* Image banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1920&q=80&auto=format"
          alt="Équipe de projet célébrant une livraison réussie"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal-dark/50 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-6">
          <AnimatedSection direction="none">
            <h2 className="text-white mb-4 text-3xl md:text-5xl">
              {t("banner.line1")}<br />
              <span className="text-gradient-warm">{t("banner.line2")}</span>
            </h2>
            <MagneticButton
              href="/contact"
              className="inline-flex items-center justify-center mt-4 rounded-xl bg-orange-500 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/25"
              strength={0.3}
            >
              {t("banner.cta")}
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-wide">
          <AnimatedSection>
            <TextReveal as="h2" className="mb-4 text-center">
              {t("testimonials.title")}
            </TextReveal>
          </AnimatedSection>
          <LineReveal className="mx-auto mb-12 w-24" delay={0.3} />

          <StaggerGrid className="grid gap-6 md:grid-cols-3" stagger={0.2}>
            {(["c1", "c2", "c3"] as const).map((key) => (
              <div key={key} className="card-elevated">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-success-500" />
                  <span className="text-sm font-bold text-success-600">
                    {t(`testimonials.${key}.metric`)}
                  </span>
                </div>
                <p className="text-xs font-medium text-cobalt-400 uppercase tracking-wider mb-3">
                  {t(`testimonials.${key}.industry`)}
                </p>
                <div className="space-y-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-500 mb-1">{t(`testimonials.${key}.before_title`)}</p>
                    <p className="text-sm text-slate-600">{t(`testimonials.${key}.before`)}</p>
                  </div>
                  <div className="rounded-lg bg-cobalt-50 p-3">
                    <p className="text-xs font-semibold text-cobalt-500 mb-1">{t(`testimonials.${key}.after_title`)}</p>
                    <p className="text-sm text-charcoal">{t(`testimonials.${key}.after`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="relative overflow-hidden min-h-[60vh] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80&auto=format"
          alt="Équipe de projet collaborant autour d'un plan"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-image-overlay" />
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <AuroraBackground />
        <div className="container-narrow relative z-10 text-center section-padding">
          <AnimatedSection>
            <TextReveal as="h2" className="mb-4 !text-white">
              {t("cta_final.title")}
            </TextReveal>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <p className="mb-10 text-lg text-slate-300/90">{t("cta_final.subtitle")}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.5}>
            <MagneticButton
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-10 py-5 text-lg font-medium text-white transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/25"
              strength={0.4}
            >
              {t("cta_final.button")}
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
