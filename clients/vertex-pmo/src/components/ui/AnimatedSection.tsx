"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

const directions = {
  up: { y: 30, x: 0 },
  left: { x: -30, y: 0 },
  right: { x: 30, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * AnimatedSection - Fades and slides children into view on scroll with configurable direction.
 *
 * @component
 * @example
 * ```tsx
 * <AnimatedSection direction="up" delay={0.2}>
 *   <p>Animated content</p>
 * </AnimatedSection>
 * ```
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = directions[direction];

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
