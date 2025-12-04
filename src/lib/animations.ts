// Shared animation configurations for Framer Motion

export const easings = {
  default: [0.4, 0, 0.2, 1] as const,
  snappy: [0.68, -0.55, 0.265, 1.55] as const,
  gentle: [0.25, 0.1, 0.25, 1] as const,
};

export const springConfigs = {
  bounce: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
  },
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },
};

export const durations = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  dramatic: 1,
};

export const staggerDelays = {
  tight: 0.03,
  normal: 0.05,
  loose: 0.1,
};

// Token colors - rotating neon palette
export const tokenColors = [
  '#00ffff', // cyan
  '#ff00ff', // magenta
  '#ffff00', // yellow
  '#00ff88', // green
  '#ff8800', // orange
  '#88ff00', // lime
];

export const getTokenColor = (index: number): string => {
  return tokenColors[index % tokenColors.length];
};

// Common animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export const tokenAppear = {
  initial: { opacity: 0, scale: 0.5, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springConfigs.bounce,
  },
  exit: { opacity: 0, scale: 0.5 },
};

export const glowPulse = {
  initial: { boxShadow: '0 0 10px currentColor' },
  animate: {
    boxShadow: [
      '0 0 10px currentColor',
      '0 0 20px currentColor, 0 0 40px currentColor',
      '0 0 10px currentColor',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
