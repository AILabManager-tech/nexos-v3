"use client";

import { type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useAnimations";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}

export function FloatingElement({
  children,
  className,
  amplitude = 12,
  duration = 6,
  delay = 0,
}: FloatingElementProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      style={{
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
        ["--float-y" as string]: `${amplitude}px`,
      }}
    >
      {children}
    </div>
  );
}
