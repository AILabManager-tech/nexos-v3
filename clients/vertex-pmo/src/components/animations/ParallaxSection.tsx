"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

/**
 * ParallaxSection - Wraps children in a scroll-driven parallax effect with opacity fade.
 *
 * @component
 * @example
 * ```tsx
 * <ParallaxSection speed={0.3}>
 *   <p>Parallax content</p>
 * </ParallaxSection>
 * ```
 */
export function ParallaxSection({
  children,
  className,
  speed = 0.3,
}: ParallaxSectionProps) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      {shouldReduceMotion ? (
        <div>{children}</div>
      ) : (
        <motion.div style={{ y, opacity }}>
          {children}
        </motion.div>
      )}
    </div>
  );
}
