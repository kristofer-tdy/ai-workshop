'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { GlowCard } from '@/components/ui';
import {
  TokenizerInput,
  TokenDisplay,
  MethodSlider,
  ExampleCards,
} from '@/components/sections/tokenization';
import { useAppStore } from '@/store/useAppStore';

export default function TokenizationPage() {
  const mode = useAppStore((state) => state.mode);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const content = (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          className={`
            font-display font-bold text-text-primary
            ${mode === 'presentation'
              ? 'text-5xl md:text-7xl lg:text-section'
              : 'text-3xl md:text-5xl'
            }
            mb-4
          `}
        >
          <span className="text-neon-cyan text-glow-cyan">TOKENIZATION</span>
        </h1>
        <p
          className={`
            text-text-secondary max-w-2xl mx-auto
            ${mode === 'presentation' ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}
          `}
        >
          Breaking text into pieces the model can read
        </p>
      </motion.div>

      {/* Main interactive area */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Input */}
        <GlowCard glowColor="cyan">
          <TokenizerInput />
        </GlowCard>

        {/* Token display */}
        <GlowCard glowColor="magenta">
          <TokenDisplay />
        </GlowCard>

        {/* Method selector */}
        <GlowCard glowColor="yellow" padding="lg">
          <MethodSlider />
        </GlowCard>

        {/* Examples */}
        <GlowCard glowColor="green" padding="lg">
          <ExampleCards />
        </GlowCard>
      </motion.div>

      {/* Educational content */}
      <motion.div
        className="mt-16 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
            <h3 className="text-xl font-display font-bold text-neon-cyan mb-3">
              Why Tokenization?
            </h3>
            <p className="text-text-secondary">
              LLMs don&apos;t read text like humans. They process{' '}
              <strong className="text-text-primary">tokens</strong> —
              chunks of text that might be words, parts of words, or even
              individual characters.
            </p>
          </div>

          <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
            <h3 className="text-xl font-display font-bold text-neon-magenta mb-3">
              Tokens ≠ Words
            </h3>
            <p className="text-text-secondary">
              A single word might become multiple tokens, and multiple short
              words might combine into one. Common words stay whole, while
              rare words get split into pieces.
            </p>
          </div>

          <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
            <h3 className="text-xl font-display font-bold text-neon-yellow mb-3">
              Why It Matters
            </h3>
            <p className="text-text-secondary">
              Token count affects API costs, context limits, and processing
              time. Understanding tokens helps you write more efficient prompts
              and understand model behavior.
            </p>
          </div>

          <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
            <h3 className="text-xl font-display font-bold text-neon-green mb-3">
              Different Methods
            </h3>
            <p className="text-text-secondary">
              Modern LLMs use <strong className="text-text-primary">subword tokenization</strong>{' '}
              (like BPE or WordPiece) to balance vocabulary size with the
              ability to handle any text.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (mode === 'presentation') {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main className="section-full">{content}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar isOpen={true} />
        </div>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1">{content}</main>
      </div>
    </div>
  );
}
