"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useAnimations";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({
  children,
  className,
  speed = 0.3,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [transform, setTransform] = useState({ y: 0, opacity: 1 });

  useEffect(() => {
    if (shouldReduceMotion) return;
    const element = ref.current;
    if (!element) return;

    function onScroll() {
      const rect = element!.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const y = (1 - clamped * 2) * speed * 100;
      const opacity =
        clamped < 0.2
          ? (clamped / 0.2) * 0.6 + 0.4
          : clamped > 0.8
            ? ((1 - clamped) / 0.2) * 0.6 + 0.4
            : 1;
      setTransform({ y, opacity });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [shouldReduceMotion, speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      {shouldReduceMotion ? (
        <div>{children}</div>
      ) : (
        <div style={{ transform: `translateY(${transform.y}px)`, opacity: transform.opacity }}>
          {children}
        </div>
      )}
    </div>
  );
}
