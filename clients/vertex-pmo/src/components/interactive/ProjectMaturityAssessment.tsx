"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { TextReveal } from "@/components/animations/TextReveal";
import { LineReveal } from "@/components/animations/LineReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";

const axes = [
  "scope",
  "schedule",
  "cost",
  "quality",
  "risk",
  "stakeholders",
] as const;

type Axis = (typeof axes)[number];

const questions: { axis: Axis; key: string }[] = [
  { axis: "scope", key: "q1" },
  { axis: "scope", key: "q2" },
  { axis: "schedule", key: "q3" },
  { axis: "schedule", key: "q4" },
  { axis: "cost", key: "q5" },
  { axis: "cost", key: "q6" },
  { axis: "quality", key: "q7" },
  { axis: "quality", key: "q8" },
  { axis: "risk", key: "q9" },
  { axis: "risk", key: "q10" },
  { axis: "stakeholders", key: "q11" },
  { axis: "stakeholders", key: "q12" },
];

function RadarChart({ scores }: { scores: Record<Axis, number> }) {
  const size = 260;
  const center = size / 2;
  const radius = 100;
  const levels = 5;

  const angleStep = (2 * Math.PI) / axes.length;

  function getPoint(axisIndex: number, value: number): [number, number] {
    const angle = axisIndex * angleStep - Math.PI / 2;
    const r = (value / 5) * radius;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  }

  const dataPoints = axes.map((axis, i) => getPoint(i, scores[axis]));
  const polygonPoints = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  const axisLabels: Record<Axis, string> = {
    scope: "Portée",
    schedule: "Échéancier",
    cost: "Coûts",
    quality: "Qualité",
    risk: "Risques",
    stakeholders: "Parties prenantes",
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px] mx-auto">
      {/* Grid levels */}
      {Array.from({ length: levels }, (_, l) => {
        const lv = l + 1;
        const pts = axes
          .map((_, i) => getPoint(i, lv))
          .map(([x, y]) => `${x},${y}`)
          .join(" ");
        return (
          <polygon
            key={`level-${lv}`}
            points={pts}
            fill="none"
            stroke="rgba(46,91,186,0.15)"
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const [x, y] = getPoint(i, 5);
        return (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="rgba(46,91,186,0.2)"
            strokeWidth={1}
          />
        );
      })}

      {/* Data polygon */}
      <motion.polygon
        points={polygonPoints}
        fill="rgba(46,91,186,0.15)"
        stroke="#2E5BBA"
        strokeWidth={2}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points */}
      {dataPoints.map(([x, y], i) => (
        <motion.circle
          key={`point-${i}`}
          cx={x}
          cy={y}
          r={4}
          fill="#2E5BBA"
          stroke="white"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
        />
      ))}

      {/* Labels */}
      {axes.map((axis, i) => {
        const [x, y] = getPoint(i, 6.2);
        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#374151"
            fontSize="10"
            fontWeight="600"
            fontFamily="var(--font-manrope)"
          >
            {axisLabels[axis]}
          </text>
        );
      })}
    </svg>
  );
}

export function ProjectMaturityAssessment() {
  const t = useTranslations("assessment");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(12).fill(0));
  const [showResults, setShowResults] = useState(false);

  const scores = useMemo(() => {
    const result: Record<Axis, number> = {
      scope: 0,
      schedule: 0,
      cost: 0,
      quality: 0,
      risk: 0,
      stakeholders: 0,
    };
    questions.forEach((q, i) => {
      result[q.axis] += answers[i] ?? 0;
    });
    // Average per axis (2 questions each, max 5 each → max 10 → /2 for 0-5 scale)
    for (const axis of axes) {
      result[axis] = result[axis] / 2;
    }
    return result;
  }, [answers]);

  const avgScore = useMemo(() => {
    const total = axes.reduce((acc, axis) => acc + scores[axis], 0);
    return Math.round((total / axes.length) * 10) / 10;
  }, [scores]);

  function handleAnswer(value: number) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers(Array(12).fill(0));
    setShowResults(false);
  }

  const resultLevel = avgScore >= 3.5 ? "high" : avgScore >= 2 ? "mid" : "low";

  return (
    <section className="section-padding relative overflow-hidden bg-slate-100">
      <div className="absolute inset-0 gradient-mesh-bg" />
      <div className="container-narrow relative">
        <AnimatedSection>
          <TextReveal as="h2" className="mb-4 text-center">
            {t("title")}
          </TextReveal>
        </AnimatedSection>
        <LineReveal className="mx-auto mb-4 w-24" delay={0.3} />
        <AnimatedSection delay={0.2}>
          <p className="text-center text-slate-600 mb-10">{t("subtitle")}</p>
        </AnimatedSection>

        <div className="card-elevated max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold text-cobalt-400 uppercase tracking-widest">
                    {t(`axes.${questions[step]?.axis}`)}
                  </span>
                  <span className="text-sm text-slate-500">
                    {step + 1} / {questions.length}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-8">
                  <div
                    className="bg-cobalt-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <h3 className="text-lg font-heading font-bold text-charcoal mb-6">
                  {t(`${questions[step]?.key}.question`)}
                </h3>

                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      className="w-full text-left px-5 py-3 rounded-xl border border-slate-200 bg-white hover:border-cobalt-300 hover:bg-cobalt-50 transition-all text-sm text-charcoal group"
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 group-hover:bg-cobalt-500 group-hover:text-white transition-colors">
                          {value}
                        </span>
                        {t(`${questions[step]?.key}.a${value}`)}
                      </span>
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="mt-4 flex items-center gap-1 text-sm text-slate-500 hover:text-cobalt-500 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("back")}
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-heading font-bold text-charcoal text-center mb-2">
                  {t(`results.${resultLevel}.title`)}
                </h3>
                <p className="text-center text-3xl font-bold text-cobalt-500 mb-6">
                  {avgScore} / 5
                </p>

                <RadarChart scores={scores} />

                <p className="mt-6 text-slate-600 text-sm text-center leading-relaxed">
                  {t(`results.${resultLevel}.description`)}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
                  <MagneticButton
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-cobalt-500 px-6 py-3 text-sm font-medium text-white hover:bg-cobalt-600 transition-colors"
                    strength={0.3}
                  >
                    {t(`results.${resultLevel}.cta`)}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </MagneticButton>
                  <button
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t("restart")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
