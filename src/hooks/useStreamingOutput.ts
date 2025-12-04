'use client';

import { useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

// Simulated responses based on common prompts
const RESPONSES: Record<string, string[]> = {
  'haiku': [
    'Silent', ' ', 'keys', ' ', 'click', ' ', 'soft', '\n',
    'Logic', ' ', 'flows', ' ', 'through', ' ', 'tired', ' ', 'mind', '\n',
    'Bug', ' ', 'fixed', ' ', 'at', ' ', 'last',
  ],
  'quantum': [
    'Quantum', ' ', 'computing', ' ', 'uses', ' ', 'qubits', ' ',
    'that', ' ', 'can', ' ', 'be', ' ', '0', ',', ' ', '1', ',', ' ',
    'or', ' ', 'both', ' ', 'at', ' ', 'once', '.', ' ',
    'This', ' ', 'lets', ' ', 'them', ' ', 'solve', ' ',
    'certain', ' ', 'problems', ' ', 'much', ' ', 'faster', '.',
  ],
  'joke': [
    'Why', ' ', 'do', ' ', 'programmers', ' ', 'prefer', ' ', 'dark', ' ', 'mode', '?', '\n',
    'Because', ' ', 'light', ' ', 'attracts', ' ', 'bugs', '!',
  ],
  'meaning': [
    'The', ' ', 'meaning', ' ', 'of', ' ', 'life', ' ', 'is', ' ',
    'a', ' ', 'deeply', ' ', 'personal', ' ', 'question', '.', ' ',
    'Many', ' ', 'find', ' ', 'it', ' ', 'in', ' ',
    'connection', ',', ' ', 'growth', ',', ' ', 'and', ' ', 'purpose', '.',
  ],
  'default': [
    'I', "'", 'm', ' ', 'an', ' ', 'AI', ' ', 'assistant', '.', ' ',
    'I', ' ', 'process', ' ', 'text', ' ', 'token', ' ', 'by', ' ', 'token', ',', ' ',
    'predicting', ' ', 'what', ' ', 'comes', ' ', 'next', '.',
  ],
};

export function useStreamingOutput() {
  const {
    inference,
    setInferenceOutput,
    setIsGenerating,
  } = useAppStore();

  const abortRef = useRef(false);

  const getResponseTokens = (prompt: string): string[] => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('haiku')) return RESPONSES.haiku;
    if (lowerPrompt.includes('quantum')) return RESPONSES.quantum;
    if (lowerPrompt.includes('joke')) return RESPONSES.joke;
    if (lowerPrompt.includes('meaning')) return RESPONSES.meaning;
    return RESPONSES.default;
  };

  const generate = useCallback(async () => {
    if (!inference.prompt.trim()) return;

    abortRef.current = false;
    setIsGenerating(true);
    setInferenceOutput([]);

    const tokens = getResponseTokens(inference.prompt);
    const output: { text: string; id: number }[] = [];

    for (let i = 0; i < tokens.length; i++) {
      if (abortRef.current) break;

      // Add some randomness based on temperature
      const delay = 100 + Math.random() * 100 * (1 + inference.temperature);
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (abortRef.current) break;

      output.push({ text: tokens[i], id: i });
      setInferenceOutput([...output]);
    }

    setIsGenerating(false);
  }, [inference.prompt, inference.temperature, setInferenceOutput, setIsGenerating]);

  const stop = useCallback(() => {
    abortRef.current = true;
    setIsGenerating(false);
  }, [setIsGenerating]);

  return { generate, stop };
}
