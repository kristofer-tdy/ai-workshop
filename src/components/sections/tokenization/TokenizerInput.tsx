'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { tokenize } from '@/lib/tokenizer';

const PLACEHOLDER_TEXT = 'Hello, world! How are you?';

export function TokenizerInput() {
  const { tokenization, setTokenizationInput, setTokens } = useAppStore();
  const [localValue, setLocalValue] = useState(tokenization.inputText || PLACEHOLDER_TEXT);

  // Debounced tokenization
  useEffect(() => {
    const timer = setTimeout(() => {
      setTokenizationInput(localValue);
      const tokens = tokenize(localValue, tokenization.method);
      setTokens(tokens);
    }, 150);

    return () => clearTimeout(timer);
  }, [localValue, tokenization.method, setTokenizationInput, setTokens]);

  // Initialize with placeholder
  useEffect(() => {
    if (!tokenization.inputText) {
      setLocalValue(PLACEHOLDER_TEXT);
    }
  }, [tokenization.inputText]);

  return (
    <div className="w-full">
      <label
        htmlFor="tokenizer-input"
        className="block text-lg font-medium text-text-secondary mb-3"
      >
        Type something:
      </label>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <textarea
          id="tokenizer-input"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={PLACEHOLDER_TEXT}
          className="
            w-full min-h-[120px]
            px-6 py-4
            bg-bg-elevated
            border-2 border-text-muted/30
            focus:border-neon-cyan focus:shadow-glow-cyan
            rounded-xl
            text-text-primary text-xl md:text-2xl lg:text-3xl
            font-mono
            placeholder:text-text-muted
            outline-none
            transition-all duration-200
            resize-none
          "
          maxLength={100}
          aria-describedby="char-count"
        />
        <span
          id="char-count"
          className="absolute bottom-3 right-3 text-xs text-text-muted"
        >
          {localValue.length}/100
        </span>
      </motion.div>
    </div>
  );
}
