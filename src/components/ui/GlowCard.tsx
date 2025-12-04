'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

type GlowColor = 'cyan' | 'magenta' | 'yellow' | 'green' | 'orange' | 'none';

interface GlowCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  glowColor?: GlowColor;
  isActive?: boolean;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const glowStyles: Record<GlowColor, string> = {
  cyan: 'border-neon-cyan/50 hover:border-neon-cyan hover:shadow-glow-cyan',
  magenta: 'border-neon-magenta/50 hover:border-neon-magenta hover:shadow-glow-magenta',
  yellow: 'border-neon-yellow/50 hover:border-neon-yellow hover:shadow-glow-yellow',
  green: 'border-neon-green/50 hover:border-neon-green hover:shadow-glow-green',
  orange: 'border-neon-orange/50 hover:border-neon-orange hover:shadow-glow-orange',
  none: 'border-text-muted/30 hover:border-text-muted',
};

const activeGlowStyles: Record<GlowColor, string> = {
  cyan: 'border-neon-cyan shadow-glow-cyan',
  magenta: 'border-neon-magenta shadow-glow-magenta',
  yellow: 'border-neon-yellow shadow-glow-yellow',
  green: 'border-neon-green shadow-glow-green',
  orange: 'border-neon-orange shadow-glow-orange',
  none: 'border-text-muted',
};

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  (
    {
      glowColor = 'cyan',
      isActive = false,
      hoverable = true,
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={`
          bg-bg-surface rounded-xl
          border-2
          transition-all duration-300
          ${isActive ? activeGlowStyles[glowColor] : glowStyles[glowColor]}
          ${!hoverable ? 'hover:shadow-none hover:border-current' : ''}
          ${paddingStyles[padding]}
          ${className}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlowCard.displayName = 'GlowCard';
