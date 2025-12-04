'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { TokenChip } from '@/components/ui/TokenChip';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getTokenColor } from '@/lib/animations';

interface GenerationStep {
  prompt: string[];
  generated: string[];
}

const DEMO_SEQUENCE: GenerationStep[] = [
  { prompt: ['The', 'cat', 'sat', 'on', 'the'], generated: [] },
  { prompt: ['The', 'cat', 'sat', 'on', 'the'], generated: ['mat'] },
  { prompt: ['The', 'cat', 'sat', 'on', 'the'], generated: ['mat', '.'] },
];

const CANDIDATE_WORDS = [
  ['floor', 'mat', 'couch', 'bed', 'rug'],
  ['.', '!', ',', '...'],
];

export function TokenGenerationLoop() {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [showingCandidates, setShowingCandidates] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentState = DEMO_SEQUENCE[Math.min(step, DEMO_SEQUENCE.length - 1)];
  const generatedCount = currentState.generated.length;

  const advanceStep = useCallback(() => {
    if (reducedMotion) {
      // In reduced motion, just cycle through states
      setStep((s) => (s + 1) % (DEMO_SEQUENCE.length + 1));
      return;
    }

    setShowingCandidates(true);
    setCandidateIndex(0);

    // Animate through candidates
    const candidateTimer = setInterval(() => {
      setCandidateIndex((i) => {
        if (i >= 3) {
          clearInterval(candidateTimer);
          setShowingCandidates(false);
          setStep((s) => (s + 1) % (DEMO_SEQUENCE.length + 1));
          return 0;
        }
        return i + 1;
      });
    }, 150);

    return () => clearInterval(candidateTimer);
  }, [reducedMotion]);

  useEffect(() => {
    if (isPaused) return;

    // Reset after showing complete sentence
    if (step >= DEMO_SEQUENCE.length) {
      const resetTimer = setTimeout(() => {
        setStep(0);
      }, 2000);
      return () => clearTimeout(resetTimer);
    }

    // Advance to next step
    const timer = setTimeout(() => {
      advanceStep();
    }, step === 0 ? 1500 : 1000);

    return () => clearTimeout(timer);
  }, [step, isPaused, advanceStep]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="img"
      aria-label="Animation showing how LLMs generate text one token at a time"
    >
      {/* Main animation container */}
      <motion.div
        className="
          relative
          px-8 py-12 md:px-16 md:py-16
          bg-bg-surface/50
          border border-text-muted/30 rounded-2xl
          min-h-[200px] md:min-h-[250px]
          flex flex-col items-center justify-center
        "
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Token display */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {/* Prompt tokens */}
          {currentState.prompt.map((token, i) => (
            <motion.div
              key={`prompt-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <TokenChip
                text={token}
                index={i}
                size="lg"
                isActive={i === currentState.prompt.length - 1 && generatedCount === 0}
              />
            </motion.div>
          ))}

          {/* Generated tokens */}
          <AnimatePresence mode="popLayout">
            {currentState.generated.map((token, i) => (
              <motion.div
                key={`gen-${i}`}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <TokenChip
                  text={token}
                  index={currentState.prompt.length + i}
                  size="lg"
                  isActive={i === generatedCount - 1}
                  isGenerating={i === generatedCount - 1 && showingCandidates}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cursor / generating indicator */}
          {step < DEMO_SEQUENCE.length && (
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {showingCandidates ? (
                <motion.div
                  className="
                    px-4 py-2
                    bg-bg-elevated/80 backdrop-blur-sm
                    border-2 border-dashed border-neon-magenta/50
                    rounded-lg
                  "
                  animate={{
                    borderColor: ['rgba(255,0,255,0.3)', 'rgba(255,0,255,0.8)', 'rgba(255,0,255,0.3)'],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <span
                    className="font-mono text-lg md:text-xl text-neon-magenta"
                    style={{
                      textShadow: `0 0 10px ${getTokenColor(currentState.prompt.length + generatedCount)}`,
                    }}
                  >
                    {CANDIDATE_WORDS[generatedCount]?.[candidateIndex] || '...'}
                  </span>
                </motion.div>
              ) : (
                <motion.span
                  className="
                    inline-block w-3 h-8 md:h-10
                    bg-neon-cyan rounded-sm
                    ml-1
                  "
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  aria-hidden="true"
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Status text */}
        <motion.p
          className="
            mt-8 text-text-secondary text-center
            text-sm md:text-base
          "
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {step >= DEMO_SEQUENCE.length ? (
            <span className="text-neon-green">Generation complete!</span>
          ) : showingCandidates ? (
            <span className="text-neon-magenta">Predicting next token...</span>
          ) : generatedCount > 0 ? (
            <span>Token generated: &ldquo;{currentState.generated[generatedCount - 1]}&rdquo;</span>
          ) : (
            <span>Ready to generate...</span>
          )}
        </motion.p>
      </motion.div>

      {/* Pause indicator */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            className="
              absolute top-4 right-4
              px-3 py-1.5
              bg-bg-elevated/90 backdrop-blur-sm
              border border-text-muted/50 rounded-full
              text-xs text-text-muted
            "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Paused (hover to pause)
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
