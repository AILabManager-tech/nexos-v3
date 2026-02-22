"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "@/hooks/useAnimations";

interface LineRevealProps {
  className?: string;
  color?: string;
  delay?: number;
}

export function LineReveal({
  className,
  color = "bg-cobalt-400",
  delay = 0,
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <div
        className={`h-[3px] ${color} rounded-full`}
        style={{
          transform: shouldReduceMotion || isInView ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: shouldReduceMotion
            ? "none"
            : `transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        }}
      />
    </div>
  );
}
