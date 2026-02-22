"use client";

import { useTranslations } from "next-intl";
import { CountUp } from "@/components/animations/CountUp";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Metric {
  value: number;
  suffix: string;
  labelKey: string;
  color: string;
}

const metrics: Metric[] = [
  { value: 150, suffix: "+", labelKey: "projects", color: "text-cobalt-500" },
  { value: 98, suffix: "%", labelKey: "ontime", color: "text-success-500" },
  { value: 15, suffix: "+", labelKey: "years", color: "text-orange-500" },
  { value: 40, suffix: "M$", labelKey: "managed", color: "text-cobalt-600" },
];

export function MetricsDashboard() {
  const t = useTranslations("home.stats");

  return (
    <section className="relative -mt-16 z-20">
      <div className="container-wide px-6">
        <AnimatedSection>
          <div className="glass rounded-2xl p-8 glow-cobalt">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {metrics.map((metric) => (
                <div key={metric.labelKey}>
                  <p className={`font-heading text-3xl font-bold md:text-4xl ${metric.color}`}>
                    <CountUp to={metric.value} suffix={metric.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{t(metric.labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
