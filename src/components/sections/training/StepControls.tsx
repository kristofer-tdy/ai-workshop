'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';

const TOTAL_STEPS = 4;

export function StepControls() {
  const { training, setTrainingStep, toggleAutoPlay, setTrainingSpeed } = useAppStore();
  const { currentStep, isAutoPlaying, speed } = training;

  const handlePrev = () => {
    setTrainingStep(Math.max(0, currentStep - 1));
  };

  const handleNext = () => {
    setTrainingStep((currentStep + 1) % TOTAL_STEPS);
  };

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      const nextStep = (useAppStore.getState().training.currentStep + 1) % TOTAL_STEPS;
      setTrainingStep(nextStep);
    }, 3000 / speed);

    return () => clearInterval(interval);
  }, [isAutoPlaying, speed, setTrainingStep]);

  return (
    <div className="space-y-6">
      {/* Main controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentStep === 0 && !isAutoPlaying}
          leftIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          rightIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
        >
          Step
        </Button>

        <Button
          variant={isAutoPlaying ? 'danger' : 'secondary'}
          onClick={toggleAutoPlay}
          leftIcon={
            isAutoPlaying ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )
          }
        >
          {isAutoPlaying ? 'Pause' : 'Auto-Play'}
        </Button>
      </div>

      {/* Speed controls */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-text-muted text-sm mr-2">Speed:</span>
        {([1, 2, 3] as const).map((s) => (
          <button
            key={s}
            onClick={() => setTrainingSpeed(s)}
            className={`
              px-3 py-1 rounded-lg text-sm font-mono
              transition-colors duration-200
              ${speed === s
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                : 'bg-bg-elevated text-text-muted hover:text-text-secondary'
              }
            `}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <button
            key={i}
            onClick={() => setTrainingStep(i)}
            className={`
              w-3 h-3 rounded-full transition-all duration-200
              ${i === currentStep
                ? 'bg-neon-cyan w-6'
                : i < currentStep
                ? 'bg-text-secondary'
                : 'bg-text-muted/30 hover:bg-text-muted'
              }
            `}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
