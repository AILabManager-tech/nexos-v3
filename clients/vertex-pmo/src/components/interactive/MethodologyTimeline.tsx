"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { TextReveal } from "@/components/animations/TextReveal";
import { LineReveal } from "@/components/animations/LineReveal";
import { ClipboardCheck, Compass, Hammer, Rocket, ShieldCheck, HeartHandshake } from "lucide-react";

const phases = [
  { key: "discovery", icon: Compass, color: "bg-cobalt-500", ring: "ring-cobalt-200" },
  { key: "planning", icon: ClipboardCheck, color: "bg-cobalt-600", ring: "ring-cobalt-200" },
  { key: "execution", icon: Hammer, color: "bg-orange-500", ring: "ring-orange-200" },
  { key: "monitoring", icon: ShieldCheck, color: "bg-success-500", ring: "ring-success-200" },
  { key: "delivery", icon: Rocket, color: "bg-orange-600", ring: "ring-orange-200" },
  { key: "support", icon: HeartHandshake, color: "bg-cobalt-500", ring: "ring-cobalt-200" },
];

export function MethodologyTimeline() {
  const t = useTranslations("home.methodology");

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh-bg" />
      <div className="container-wide relative">
        <AnimatedSection>
          <TextReveal as="h2" className="mb-4 text-center">
            {t("title")}
          </TextReveal>
        </AnimatedSection>
        <LineReveal className="mx-auto mb-6 w-24" delay={0.3} />
        <AnimatedSection delay={0.2}>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cobalt-300 via-orange-300 to-success-300 hidden md:block" />

          <div className="space-y-8 md:space-y-12">
            {phases.map((phase, i) => {
              const Icon = phase.icon;
              const isLeft = i % 2 === 0;

              return (
                <AnimatedSection
                  key={phase.key}
                  delay={i * 0.15}
                  direction={isLeft ? "left" : "right"}
                >
                  <div className={`flex items-center gap-6 md:gap-12 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                      <div className="card-elevated">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-bold text-cobalt-400 uppercase tracking-widest">
                            Phase {i + 1}
                          </span>
                        </div>
                        <h3 className="text-lg font-heading font-bold text-charcoal mb-2">
                          {t(`${phase.key}.title`)}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {t(`${phase.key}.description`)}
                        </p>
                        <p className="mt-3 text-xs font-medium text-orange-500">
                          {t(`${phase.key}.duration`)}
                        </p>
                      </div>
                    </div>

                    {/* Center icon */}
                    <div className="hidden md:flex flex-shrink-0">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${phase.color} ring-4 ${phase.ring} text-white shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="hidden md:block flex-1" />
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
