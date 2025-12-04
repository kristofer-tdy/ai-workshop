'use client';

import { motion } from 'framer-motion';

interface PresentationControlsProps {
  currentSection: number;
  totalSections: number;
  onPrev: () => void;
  onNext: () => void;
  sectionNames?: string[];
}

export function PresentationControls({
  currentSection,
  totalSections,
  onPrev,
  onNext,
  sectionNames = [],
}: PresentationControlsProps) {
  return (
    <motion.div
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-4
        px-4 py-3
        bg-bg-surface/90 backdrop-blur-sm
        border border-text-muted/30 rounded-xl
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Section indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSections }).map((_, i) => (
          <div
            key={i}
            className={`
              w-2 h-2 rounded-full transition-all duration-200
              ${i === currentSection
                ? 'bg-neon-cyan w-4'
                : 'bg-text-muted/50 hover:bg-text-muted'
              }
            `}
            title={sectionNames[i] || `Section ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2 border-l border-text-muted/30 pl-4">
        <button
          onClick={onPrev}
          disabled={currentSection === 0}
          className="
            p-2 rounded-lg
            text-text-secondary hover:text-text-primary
            hover:bg-bg-elevated
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-200
          "
          aria-label="Previous section"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNext}
          disabled={currentSection === totalSections - 1}
          className="
            p-2 rounded-lg
            text-text-secondary hover:text-text-primary
            hover:bg-bg-elevated
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-200
          "
          aria-label="Next section"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="text-xs text-text-muted hidden sm:block">
        <kbd className="px-1.5 py-0.5 bg-bg-elevated rounded">←</kbd>
        {' '}
        <kbd className="px-1.5 py-0.5 bg-bg-elevated rounded">→</kbd>
      </div>
    </motion.div>
  );
}
