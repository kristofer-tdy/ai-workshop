'use client';

import { motion } from 'framer-motion';
import { getTokenColor, springConfigs } from '@/lib/animations';

interface TokenChipProps {
  text: string;
  index: number;
  isActive?: boolean;
  isGenerating?: boolean;
  onClick?: () => void;
  showId?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-1.5 text-base',
  lg: 'px-4 py-2 text-lg md:text-xl',
};

export function TokenChip({
  text,
  index,
  isActive = false,
  isGenerating = false,
  onClick,
  showId = false,
  size = 'md',
}: TokenChipProps) {
  const color = getTokenColor(index);

  // Handle special characters display
  const displayText = text === ' ' ? '␣' : text === '\n' ? '↵' : text;

  return (
    <motion.span
      className={`
        inline-flex items-center gap-1
        font-mono rounded-md
        border-2 cursor-default
        transition-all duration-200
        ${sizeStyles[size]}
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${isGenerating ? 'animate-pulse' : ''}
      `}
      style={{
        borderColor: color,
        backgroundColor: isActive || isGenerating ? `${color}33` : 'transparent',
        color: color,
        boxShadow: isActive || isGenerating ? `0 0 20px ${color}` : 'none',
      }}
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={springConfigs.bounce}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Token: ${text}${showId ? `, ID: ${index}` : ''}`}
    >
      <span className="whitespace-pre">{displayText}</span>
      {showId && (
        <span className="text-xs opacity-60">#{index}</span>
      )}
    </motion.span>
  );
}

export function TokenChipSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span
      className={`
        inline-block
        bg-bg-elevated rounded-md
        border-2 border-text-muted
        animate-pulse
        ${sizeStyles[size]}
      `}
    >
      <span className="invisible">token</span>
    </span>
  );
}
