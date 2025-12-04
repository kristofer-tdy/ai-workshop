'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { GlowCard } from '@/components/ui';
import {
  TrainingLoop,
  StepControls,
  StepDetail,
} from '@/components/sections/training';
import { useAppStore } from '@/store/useAppStore';

export default function TrainingPage() {
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
          <span className="text-neon-magenta text-glow-magenta">TRAINING</span>
        </h1>
        <p
          className={`
            text-text-secondary max-w-2xl mx-auto
            ${mode === 'presentation' ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}
          `}
        >
          How LLMs learn to predict the next token
        </p>
      </motion.div>

      {/* Training loop visualization */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GlowCard glowColor="magenta" padding="lg">
          <TrainingLoop />
        </GlowCard>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <StepControls />
      </motion.div>

      {/* Step detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <StepDetail />
      </motion.div>

      {/* Key concepts */}
      <motion.div
        className="mt-16 grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-cyan mb-3">
            The Training Loop
          </h3>
          <p className="text-text-secondary">
            LLMs learn by predicting the next word in billions of sentences.
            Each mistake helps the model adjust its weights to make better
            predictions next time.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-magenta mb-3">
            Massive Scale
          </h3>
          <p className="text-text-secondary">
            Modern LLMs are trained on trillions of tokens from books,
            websites, and code. This takes weeks of training on thousands
            of GPUs.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-yellow mb-3">
            Self-Supervised
          </h3>
          <p className="text-text-secondary">
            No human labels are needed! The training data itself provides
            the answers—just hide the next word and ask the model to guess.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-green mb-3">
            Emergent Abilities
          </h3>
          <p className="text-text-secondary">
            By learning to predict text well, LLMs develop surprising
            abilities: reasoning, coding, translation, and more—without
            being explicitly taught.
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
