"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}

/**
 * FloatingElement - Wraps children in a continuous floating animation.
 *
 * @component
 * @example
 * ```tsx
 * <FloatingElement amplitude={12} duration={6}>
 *   <div>Floating content</div>
 * </FloatingElement>
 * ```
 */
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
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-1.5, 1.5, -1.5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
