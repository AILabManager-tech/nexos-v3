"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface StaggerGridProps {
  children: ReactNode[];
  className?: string;
  stagger?: number;
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.92,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
    },
  },
};

/**
 * StaggerGrid - Renders children in a grid with staggered reveal animations on scroll.
 *
 * @component
 * @example
 * ```tsx
 * <StaggerGrid stagger={0.12} className="grid grid-cols-3 gap-4">
 *   {items.map(item => <Card key={item.id} />)}
 * </StaggerGrid>
 * ```
 */
export function StaggerGrid({
  children,
  className,
  stagger = 0.12,
}: StaggerGridProps) {
  const ref = useRef(null);
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
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
