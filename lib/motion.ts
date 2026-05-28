import type { Transition, Variants } from "framer-motion";

export const springTransition: Transition = {
  stiffness: 250,
  damping: 25,
};

export const cardInteraction = {
  whileHover: { scale: 1.012, y: -2 },
  whileTap: { scale: 0.988 },
} as const;

export const createRevealVariants = (
  staggerChildren = 0.06,
  delayChildren = 0,
): Variants => ({
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...springTransition,
      staggerChildren,
      delayChildren,
      when: "beforeChildren",
    },
  },
});

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

export const getReducedMotionProps = (reducedMotion: boolean) =>
  reducedMotion
    ? {
        initial: false as const,
        animate: false as const,
        whileHover: undefined,
        whileTap: undefined,
        transition: { duration: 0 } as const,
      }
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
      };
