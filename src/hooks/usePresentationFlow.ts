'use client';

import { useState, useCallback, useEffect } from 'react';

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  // Zoom/pan configuration
  zoom: number;
  focusX: number; // percentage 0-100
  focusY: number; // percentage 0-100
  // Duration in ms before auto-advancing (0 = wait for user)
  duration: number;
  // Which elements to highlight
  highlights?: string[];
}

interface UsePresentationFlowOptions {
  steps: FlowStep[];
  onStepChange?: (step: number, stepData: FlowStep) => void;
}

export function usePresentationFlow({ steps, onStepChange }: UsePresentationFlowOptions) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);

  const currentStepData = steps[currentStep];

  const goToStep = useCallback((step: number) => {
    const clampedStep = Math.max(0, Math.min(step, steps.length - 1));
    setCurrentStep(clampedStep);
    setWaitingForInput(true);
    onStepChange?.(clampedStep, steps[clampedStep]);
  }, [steps, onStepChange]);

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, steps.length, goToStep]);

  const previous = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const reset = useCallback(() => {
    goToStep(0);
    setIsPlaying(false);
  }, [goToStep]);

  const play = useCallback(() => {
    setIsPlaying(true);
    setWaitingForInput(false);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault();
          next();
          break;
        case 'b':
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          previous();
          break;
        case 'r':
          e.preventDefault();
          reset();
          break;
        case 'Escape':
          e.preventDefault();
          pause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, previous, reset, pause]);

  // Auto-advance when playing and duration > 0
  useEffect(() => {
    if (isPlaying && currentStepData?.duration > 0 && !waitingForInput) {
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          next();
        } else {
          setIsPlaying(false);
        }
      }, currentStepData.duration);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, currentStepData, waitingForInput, steps.length, next]);

  return {
    currentStep,
    currentStepData,
    totalSteps: steps.length,
    isPlaying,
    waitingForInput,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    progress: ((currentStep + 1) / steps.length) * 100,
    next,
    previous,
    goToStep,
    reset,
    play,
    pause,
  };
}
