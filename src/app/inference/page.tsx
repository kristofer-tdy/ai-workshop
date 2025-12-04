'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { GlowCard } from '@/components/ui';
import {
  PromptInput,
  OutputStream,
  TemperatureControl,
} from '@/components/sections/inference';
import { useStreamingOutput } from '@/hooks/useStreamingOutput';
import { useAppStore } from '@/store/useAppStore';

export default function InferencePage() {
  const mode = useAppStore((state) => state.mode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { generate, stop } = useStreamingOutput();

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
          <span className="text-neon-yellow text-glow-yellow">INFERENCE</span>
        </h1>
        <p
          className={`
            text-text-secondary max-w-2xl mx-auto
            ${mode === 'presentation' ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}
          `}
        >
          How LLMs generate responses in real-time
        </p>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Prompt input */}
        <GlowCard glowColor="cyan">
          <PromptInput onGenerate={generate} onStop={stop} />
        </GlowCard>

        {/* Output stream */}
        <GlowCard glowColor="green">
          <OutputStream />
        </GlowCard>

        {/* Temperature control */}
        <GlowCard glowColor="magenta" padding="lg">
          <TemperatureControl />
        </GlowCard>
      </motion.div>

      {/* Explanation */}
      <motion.div
        className="mt-16 grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-cyan mb-3">
            Token-by-Token Generation
          </h3>
          <p className="text-text-secondary">
            Watch how the model generates one token at a time. Each new token
            is predicted based on the prompt and all previously generated tokens.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-magenta mb-3">
            Temperature Sampling
          </h3>
          <p className="text-text-secondary">
            Temperature controls randomness. Low values pick the most likely
            tokens; high values allow less likely (more creative) choices.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-yellow mb-3">
            Streaming Output
          </h3>
          <p className="text-text-secondary">
            Real LLM APIs stream tokens as they&apos;re generated, so you see
            the response build up in real-time rather than waiting for the
            whole thing.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-green mb-3">
            Stop Generation
          </h3>
          <p className="text-text-secondary">
            You can stop generation at any time. The model doesn&apos;t know
            how long its response will be—it just keeps going until it
            produces a stop token.
          </p>
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
