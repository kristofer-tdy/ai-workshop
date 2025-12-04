'use client';

import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onFullscreen?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onNext,
  onPrev,
  onSpace,
  onEscape,
  onFullscreen,
  enabled = true,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          onNext?.();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          onPrev?.();
          break;
        case ' ':
          event.preventDefault();
          onSpace?.();
          break;
        case 'Escape':
          onEscape?.();
          break;
        case 'f':
        case 'F':
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
            onFullscreen?.();
          }
          break;
      }
    },
    [enabled, onNext, onPrev, onSpace, onEscape, onFullscreen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
