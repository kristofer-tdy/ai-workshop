'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { TokenChip, TokenChipSkeleton } from '@/components/ui/TokenChip';
import { staggerDelays } from '@/lib/animations';

export function TokenDisplay() {
  const { tokenization } = useAppStore();
  const { tokens } = tokenization;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <label className="text-lg font-medium text-text-secondary">
          Tokens:
        </label>
        <motion.span
          key={tokens.length}
          className="text-neon-cyan font-mono text-lg"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {tokens.length} token{tokens.length !== 1 ? 's' : ''}
        </motion.span>
      </div>

      <motion.div
        className="
          min-h-[100px]
          p-6
          bg-bg-surface
          border border-text-muted/20
          rounded-xl
          flex flex-wrap gap-2 md:gap-3
          items-start content-start
        "
        layout
      >
        <AnimatePresence mode="popLayout">
          {tokens.length === 0 ? (
            <motion.span
              key="empty"
              className="text-text-muted italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Type something above to see tokens...
            </motion.span>
          ) : (
            tokens.map((token, index) => (
              <motion.div
                key={`${token.text}-${index}`}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    delay: index * staggerDelays.tight,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                layout
              >
                <TokenChip
                  text={token.text}
                  index={index}
                  showId
                  size="md"
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
