'use client';

import { motion } from 'framer-motion';
import { useAppStore, TokenMethod } from '@/store/useAppStore';

const METHODS: { value: TokenMethod; label: string; description: string }[] = [
  {
    value: 'word',
    label: 'Word-level',
    description: 'Split by spaces and punctuation',
  },
  {
    value: 'subword',
    label: 'Subword (BPE)',
    description: 'Split into common pieces',
  },
  {
    value: 'character',
    label: 'Character-level',
    description: 'Each character is a token',
  },
];

export function MethodSlider() {
  const { tokenization, setTokenizationMethod } = useAppStore();
  const currentMethod = tokenization.method;
  const currentIndex = METHODS.findIndex((m) => m.value === currentMethod);

  return (
    <div className="w-full">
      <label className="block text-lg font-medium text-text-secondary mb-4">
        Tokenization Method:
      </label>

      {/* Method buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {METHODS.map((method) => (
          <button
            key={method.value}
            onClick={() => setTokenizationMethod(method.value)}
            className={`
              relative flex-1
              px-4 py-4
              rounded-xl
              border-2 transition-all duration-200
              text-left
              ${currentMethod === method.value
                ? 'border-neon-cyan bg-neon-cyan/10 shadow-glow-cyan'
                : 'border-text-muted/30 hover:border-text-muted bg-bg-surface'
              }
            `}
            aria-pressed={currentMethod === method.value}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`
                  w-4 h-4 rounded-full border-2
                  ${currentMethod === method.value
                    ? 'border-neon-cyan bg-neon-cyan'
                    : 'border-text-muted'
                  }
                `}
              >
                {currentMethod === method.value && (
                  <motion.div
                    className="w-full h-full rounded-full bg-neon-cyan"
                    layoutId="method-indicator"
                  />
                )}
              </div>
              <span
                className={`
                  font-display font-semibold
                  ${currentMethod === method.value
                    ? 'text-neon-cyan'
                    : 'text-text-primary'
                  }
                `}
              >
                {method.label}
              </span>
            </div>
            <p className="text-sm text-text-muted pl-7">
              {method.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
