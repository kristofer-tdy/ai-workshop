'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { tokenize } from '@/lib/tokenizer';
import { TokenChip } from '@/components/ui/TokenChip';

interface Example {
  text: string;
  description: string;
  highlight: string;
}

const EXAMPLES: Example[] = [
  {
    text: 'unbelievable',
    description: 'Prefixes and suffixes split',
    highlight: '[un] [believ] [able]',
  },
  {
    text: 'ChatGPT',
    description: 'Brand names may split oddly',
    highlight: '[Chat] [G] [PT]',
  },
  {
    text: 'Hello! 👋🌍',
    description: 'Emoji are individual tokens',
    highlight: '[Hello] [!] [👋] [🌍]',
  },
  {
    text: "don't won't",
    description: 'Contractions split',
    highlight: "[don] ['] [t] [won] ['] [t]",
  },
];

export function ExampleCards() {
  const { setTokenizationInput, setTokens, tokenization } = useAppStore();

  const handleClick = (text: string) => {
    setTokenizationInput(text);
    const tokens = tokenize(text, tokenization.method);
    setTokens(tokens);
  };

  return (
    <div className="w-full">
      <label className="block text-lg font-medium text-text-secondary mb-4">
        Try these examples:
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        {EXAMPLES.map((example, i) => (
          <motion.button
            key={example.text}
            onClick={() => handleClick(example.text)}
            className="
              p-4
              bg-bg-surface
              border border-text-muted/20
              hover:border-neon-magenta/50
              hover:bg-bg-elevated
              rounded-xl
              text-left
              transition-all duration-200
              group
            "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="font-mono text-lg text-text-primary mb-1 group-hover:text-neon-magenta transition-colors">
              &ldquo;{example.text}&rdquo;
            </div>
            <div className="text-sm text-text-muted mb-2">
              {example.description}
            </div>
            <div className="text-xs text-text-muted/70 font-mono">
              → {example.highlight}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
