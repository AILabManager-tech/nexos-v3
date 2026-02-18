"use client";

import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { useRef, useEffect } from "react";

interface CountUpProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/**
 * CountUp - Animates a number counting up when scrolled into view.
 *
 * @component
 * @example
 * ```tsx
 * <CountUp to={100} suffix="%" duration={2} />
 * ```
 */
export function CountUp({
  from = 0,
  to,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: CountUpProps) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(shouldReduceMotion ? to : from);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;
    const controls = animate(motionValue, to, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    return controls.stop;
  }, [isInView, shouldReduceMotion, motionValue, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shouldReduceMotion ? <span>{to}</span> : <motion.span>{rounded}</motion.span>}
      {suffix}
    </span>
  );
}
