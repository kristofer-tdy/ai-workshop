'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FlowStep } from '@/hooks/usePresentationFlow';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepData: FlowStep;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  stepData,
  isFirstStep,
  isLastStep,
}: StepIndicatorProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      {/* Step info panel */}
      <motion.div
        className="bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent pt-16 pb-6 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Progress bar */}
          <div className="h-1 bg-bg-elevated rounded-full mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-orange rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step content */}
          <div className="flex items-start justify-between gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepData.id}
                className="flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-text-muted">
                    {currentStep + 1} / {totalSteps}
                  </span>
                  <h3 className="text-xl font-display font-bold text-text-primary">
                    {stepData.title}
                  </h3>
                </div>
                <p className="text-text-secondary text-sm md:text-base max-w-2xl">
                  {stepData.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation hints */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center gap-4 text-sm">
                {!isFirstStep && (
                  <div className="flex items-center gap-2 text-text-muted">
                    <kbd className="px-2 py-1 bg-bg-elevated rounded text-xs font-mono">B</kbd>
                    <span>Back</span>
                  </div>
                )}
                {!isLastStep ? (
                  <div className="flex items-center gap-2 text-neon-cyan">
                    <span>Continue</span>
                    <kbd className="px-2 py-1 bg-neon-cyan/20 border border-neon-cyan/50 rounded text-xs font-mono text-neon-cyan">
                      SPACE
                    </kbd>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-neon-green">
                    <span>Complete!</span>
                    <kbd className="px-2 py-1 bg-bg-elevated rounded text-xs font-mono">R</kbd>
                    <span className="text-text-muted">to restart</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
