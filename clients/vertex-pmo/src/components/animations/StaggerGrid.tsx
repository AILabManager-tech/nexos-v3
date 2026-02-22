"use client";

import { useRef, type ReactNode } from "react";
import { useInView, useReducedMotion } from "@/hooks/useAnimations";

interface StaggerGridProps {
  children: ReactNode[];
  className?: string;
  stagger?: number;
}

export function StaggerGrid({
  children,
  className,
  stagger = 0.12,
}: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children.map((child, i) => (
          <div key={i}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.92)",
            filter: isInView ? "blur(0px)" : "blur(8px)",
            transition: `opacity 0.5s ease-out ${i * stagger}s, transform 0.5s ease-out ${i * stagger}s, filter 0.5s ease-out ${i * stagger}s`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
