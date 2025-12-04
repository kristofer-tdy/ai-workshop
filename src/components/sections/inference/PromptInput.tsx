'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui';

const EXAMPLE_PROMPTS = [
  'Write a haiku about coding',
  'Explain quantum computing simply',
  'Tell me a short joke',
  'What is the meaning of life?',
];

interface PromptInputProps {
  onGenerate: () => void;
  onStop: () => void;
}

export function PromptInput({ onGenerate, onStop }: PromptInputProps) {
  const { inference, setInferencePrompt } = useAppStore();

  return (
    <div className="space-y-4">
      <label
        htmlFor="prompt-input"
        className="block text-lg font-medium text-text-secondary"
      >
        Your Prompt:
      </label>

      <textarea
        id="prompt-input"
        value={inference.prompt}
        onChange={(e) => setInferencePrompt(e.target.value)}
        placeholder="Type a prompt..."
        disabled={inference.isGenerating}
        className="
          w-full min-h-[100px]
          px-6 py-4
          bg-bg-elevated
          border-2 border-text-muted/30
          focus:border-neon-cyan focus:shadow-glow-cyan
          rounded-xl
          text-text-primary text-lg md:text-xl
          placeholder:text-text-muted
          outline-none
          transition-all duration-200
          resize-none
          disabled:opacity-50
        "
      />

      {/* Example prompts */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setInferencePrompt(prompt)}
            disabled={inference.isGenerating}
            className="
              px-3 py-1.5
              bg-bg-surface
              border border-text-muted/30
              hover:border-neon-cyan/50
              rounded-full
              text-sm text-text-muted
              hover:text-text-secondary
              transition-all duration-200
              disabled:opacity-50
            "
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Generate button */}
      <div className="flex justify-center pt-4">
        {inference.isGenerating ? (
          <Button
            variant="danger"
            size="lg"
            onClick={onStop}
            leftIcon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          >
            Stop
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={onGenerate}
            disabled={!inference.prompt.trim()}
            rightIcon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            }
          >
            Generate
          </Button>
        )}
      </div>
    </div>
  );
}
