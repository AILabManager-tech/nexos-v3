"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GanttBar {
  label: string;
  start: number;
  width: number;
  color: string;
  delay: number;
}

const bars: GanttBar[] = [
  { label: "Planification", start: 0, width: 30, color: "#2E5BBA", delay: 0.2 },
  { label: "Design", start: 15, width: 25, color: "#E8732A", delay: 0.4 },
  { label: "Développement", start: 30, width: 40, color: "#34A853", delay: 0.6 },
  { label: "Tests QA", start: 55, width: 20, color: "#2E5BBA", delay: 0.8 },
  { label: "Déploiement", start: 70, width: 15, color: "#E8732A", delay: 1.0 },
  { label: "Support", start: 75, width: 25, color: "#34A853", delay: 1.2 },
];

export function GanttHero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-lg" aria-hidden="true">
      <svg viewBox="0 0 400 240" className="w-full h-auto" role="img">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-${i}`}
            x1={80 + i * 80}
            y1={10}
            x2={80 + i * 80}
            y2={230}
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="4 4"
          />
        ))}

        {/* Bars */}
        {bars.map((bar, i) => (
          <g key={bar.label}>
            {/* Label */}
            <text
              x={4}
              y={30 + i * 36}
              fill="rgba(255,255,255,0.7)"
              fontSize="10"
              fontFamily="var(--font-source-sans)"
            >
              {bar.label}
            </text>

            {/* Bar background */}
            <rect
              x={80 + (bar.start / 100) * 310}
              y={20 + i * 36}
              width={0}
              height={18}
              rx={4}
              fill={bar.color}
              opacity={0.15}
            >
              {visible && (
                <animate
                  attributeName="width"
                  from="0"
                  to={(bar.width / 100) * 310}
                  dur="0.8s"
                  begin={`${bar.delay}s`}
                  fill="freeze"
                />
              )}
            </rect>

            {/* Bar fill */}
            <rect
              x={80 + (bar.start / 100) * 310}
              y={20 + i * 36}
              width={0}
              height={18}
              rx={4}
              fill={bar.color}
              opacity={0.85}
            >
              {visible && (
                <animate
                  attributeName="width"
                  from="0"
                  to={(bar.width / 100) * 310}
                  dur="0.8s"
                  begin={`${bar.delay}s`}
                  fill="freeze"
                />
              )}
            </rect>

            {/* Progress diamond */}
            {visible && (
              <motion.circle
                cx={80 + ((bar.start + bar.width * 0.8) / 100) * 310}
                cy={29 + i * 36}
                r={4}
                fill="white"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: bar.delay + 0.5, duration: 0.3 }}
              />
            )}
          </g>
        ))}

        {/* Today line */}
        {visible && (
          <motion.line
            x1={260}
            y1={5}
            x2={260}
            y2={230}
            stroke="#E8732A"
            strokeWidth={2}
            strokeDasharray="6 3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          />
        )}
        {visible && (
          <motion.text
            x={262}
            y={240}
            fill="#E8732A"
            fontSize="9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            Aujourd&apos;hui
          </motion.text>
        )}
      </svg>
    </div>
  );
}
