"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  staggerChildren?: number;
}

/**
 * TextReveal - Splits text into words and animates each word in with a staggered spring effect.
 *
 * @component
 * @example
 * ```tsx
 * <TextReveal as="h2" delay={0.1}>
 *   Your headline text here
 * </TextReveal>
 * ```
 */
export function TextReveal({
  children,
  className,
  as: Tag = "h1",
  delay = 0,
  staggerChildren = 0.035,
}: TextRevealProps) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = children.split(" ");

  if (shouldReduceMotion) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "100%", opacity: 0, rotateX: 45 },
              visible: {
                y: 0,
                opacity: 1,
                rotateX: 0,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </MotionTag>
  );
}
