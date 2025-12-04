'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export function ModeToggle() {
  const { mode, setMode } = useAppStore();

  return (
    <div className="flex items-center gap-2 p-1 bg-bg-elevated rounded-lg">
      <button
        onClick={() => setMode('self-study')}
        className={`
          relative px-4 py-2 rounded-md text-sm font-medium
          transition-colors duration-200
          ${mode === 'self-study'
            ? 'text-text-primary'
            : 'text-text-muted hover:text-text-secondary'
          }
        `}
        aria-pressed={mode === 'self-study'}
      >
        {mode === 'self-study' && (
          <motion.div
            layoutId="mode-indicator"
            className="absolute inset-0 bg-neon-cyan/20 border border-neon-cyan/50 rounded-md"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">Self-Study</span>
      </button>
      <button
        onClick={() => setMode('presentation')}
        className={`
          relative px-4 py-2 rounded-md text-sm font-medium
          transition-colors duration-200
          ${mode === 'presentation'
            ? 'text-text-primary'
            : 'text-text-muted hover:text-text-secondary'
          }
        `}
        aria-pressed={mode === 'presentation'}
      >
        {mode === 'presentation' && (
          <motion.div
            layoutId="mode-indicator"
            className="absolute inset-0 bg-neon-magenta/20 border border-neon-magenta/50 rounded-md"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">Presentation</span>
      </button>
    </div>
  );
}
