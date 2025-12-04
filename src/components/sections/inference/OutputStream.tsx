'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { TokenChip } from '@/components/ui/TokenChip';

export function OutputStream() {
  const { inference } = useAppStore();
  const { output, isGenerating } = inference;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-lg font-medium text-text-secondary">
          Output:
        </label>
        {output.length > 0 && (
          <span className="text-neon-green font-mono text-sm">
            {output.length} tokens
          </span>
        )}
      </div>

      <motion.div
        className="
          min-h-[150px]
          p-6
          bg-bg-surface
          border border-text-muted/20
          rounded-xl
        "
        layout
      >
        {output.length === 0 && !isGenerating ? (
          <p className="text-text-muted italic">
            Generated text will appear here...
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 items-start">
            <AnimatePresence mode="popLayout">
              {output.map((token, index) => (
                <motion.div
                  key={`${token.text}-${index}`}
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  layout
                >
                  <TokenChip
                    text={token.text}
                    index={index}
                    isActive={index === output.length - 1 && isGenerating}
                    isGenerating={index === output.length - 1 && isGenerating}
                    size="md"
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Generating cursor */}
            {isGenerating && (
              <motion.span
                className="inline-block w-2 h-6 bg-neon-cyan rounded-sm ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
        )}
      </motion.div>

      {/* Rendered text */}
      {output.length > 0 && (
        <motion.div
          className="p-4 bg-bg-elevated rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-text-secondary text-sm mb-2">Rendered:</p>
          <p className="text-text-primary">
            {output.map((t) => t.text).join('')}
          </p>
        </motion.div>
      )}
    </div>
  );
}
