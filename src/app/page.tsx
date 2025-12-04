'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TokenGenerationLoop, ScrollIndicator } from '@/components/sections/landing';
import { Button } from '@/components/ui';
import { Header } from '@/components/layout';
import { Sidebar } from '@/components/layout';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

export default function Home() {
  const mode = useAppStore((state) => state.mode);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary">
      {mode === 'self-study' && (
        <>
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex">
            <div className="hidden lg:block">
              <Sidebar isOpen={true} />
            </div>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1">
              <LandingContent />
            </main>
          </div>
        </>
      )}

      {mode === 'presentation' && (
        <>
          <Header />
          <main>
            <LandingContent isPresentation />
          </main>
        </>
      )}
    </div>
  );
}

function LandingContent({ isPresentation = false }: { isPresentation?: boolean }) {
  return (
    <section
      className={`
        section-full
        ${isPresentation ? 'min-h-screen' : 'min-h-[calc(100vh-64px)]'}
      `}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Title */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className={`
              font-display font-bold text-text-primary
              ${isPresentation
                ? 'text-6xl md:text-8xl lg:text-hero'
                : 'text-4xl md:text-6xl lg:text-7xl'
              }
              mb-6
            `}
          >
            <span className="text-glow-cyan">HOW</span>{' '}
            <span className="text-neon-magenta text-glow-magenta">LLMs</span>{' '}
            <span className="text-glow-cyan">THINK</span>
          </h1>
        </motion.div>

        {/* Main Animation */}
        <motion.div
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <TokenGenerationLoop />
        </motion.div>

        {/* Caption */}
        <motion.p
          className={`
            text-center text-text-secondary
            ${isPresentation
              ? 'text-2xl md:text-3xl lg:text-4xl'
              : 'text-lg md:text-xl lg:text-2xl'
            }
            max-w-3xl mx-auto mb-12
          `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          LLMs predict the next piece of text,{' '}
          <span className="text-neon-cyan">one token at a time</span>.
        </motion.p>

        {/* CTA Buttons (self-study mode only) */}
        {!isPresentation && (
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Link href="/tokenization">
              <Button
                size="lg"
                rightIcon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                }
              >
                Start Learning
              </Button>
            </Link>
            <Link href="/tokenization">
              <Button variant="secondary" size="lg">
                Explore Tokenization
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Scroll indicator (presentation mode) */}
        {isPresentation && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <ScrollIndicator />
          </motion.div>
        )}
      </div>

      {/* Topics preview (self-study mode) */}
      {!isPresentation && (
        <motion.div
          className="container mx-auto px-4 max-w-6xl mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
            What You&apos;ll Learn
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Tokenization',
                description: 'How text becomes pieces the model can read',
                color: 'cyan',
                href: '/tokenization',
              },
              {
                title: 'Training',
                description: 'How LLMs learn to predict the next token',
                color: 'magenta',
                href: '/training',
              },
              {
                title: 'Inference',
                description: 'How LLMs generate responses in real-time',
                color: 'yellow',
                href: '/inference',
              },
              {
                title: 'Behind the Scenes',
                description: 'What happens when you call an LLM API',
                color: 'green',
                href: '/api-flow',
              },
            ].map((topic, i) => (
              <Link key={topic.title} href={topic.href}>
                <motion.div
                  className={`
                    p-6 rounded-xl
                    bg-bg-surface border border-text-muted/20
                    hover:border-neon-${topic.color}/50
                    hover:shadow-glow-${topic.color}
                    transition-all duration-300
                    cursor-pointer
                    h-full
                  `}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + i * 0.1 }}
                >
                  <h3 className={`text-xl font-display font-bold mb-2 text-neon-${topic.color}`}>
                    {topic.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {topic.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
