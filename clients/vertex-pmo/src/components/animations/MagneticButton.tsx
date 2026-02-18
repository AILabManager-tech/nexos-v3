"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  strength?: number;
  onClick?: () => void;
  type?: "button" | "submit";
}

/**
 * MagneticButton - Button or link that follows the cursor with a magnetic pull effect.
 *
 * @component
 * @example
 * ```tsx
 * <MagneticButton href="/contact" strength={0.3}>
 *   Contact us
 * </MagneticButton>
 * ```
 */
export function MagneticButton({
  children,
  className,
  href,
  strength = 0.3,
  onClick,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const glowOpacity = useTransform(
    [springX, springY],
    ([latestX, latestY]) => {
      const dist = Math.sqrt(
        (latestX as number) ** 2 + (latestY as number) ** 2
      );
      return Math.min(dist / 50, 0.6);
    }
  );

  function handleMouse(e: MouseEvent) {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const Tag = href ? "a" : "button";
  const linkProps = href
    ? { href, ...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
    : { type, onClick };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
      className="inline-block"
    >
      <Tag className={`relative overflow-hidden ${className ?? ""}`} {...linkProps}>
        {!shouldReduceMotion && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-white/20"
            style={{ opacity: glowOpacity }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </Tag>
    </motion.div>
  );
}
