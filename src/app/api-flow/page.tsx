'use client';

import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { GlowCard } from '@/components/ui';
import { FlowDiagram, CostCalculator } from '@/components/sections/api-flow';
import { useAppStore } from '@/store/useAppStore';

interface Token {
  text: string;
  id: number;
}

export default function ApiFlowPage() {
  const mode = useAppStore((state) => state.mode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputTokens, setInputTokens] = useState<Token[]>([]);
  const [outputTokens, setOutputTokens] = useState<Token[]>([]);
  const [currentStage, setCurrentStage] = useState(-1);
  const [streamingCount, setStreamingCount] = useState(0);

  const handleTokensUpdate = useCallback((input: Token[], output: Token[]) => {
    setInputTokens(input);
    setOutputTokens(output);
    setStreamingCount(output.length);
  }, []);

  const handleStageChange = useCallback((stage: number) => {
    setCurrentStage(stage);
    // Reset streaming count when starting new animation
    if (stage === 0) {
      setStreamingCount(0);
    }
  }, []);

  const isStreaming = currentStage === 4;

  const content = (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              ? 'text-4xl md:text-6xl lg:text-7xl'
              : 'text-3xl md:text-4xl'
            }
            mb-4
          `}
        >
          <span className="text-neon-orange text-glow-orange">API & PRICING</span>
        </h1>
        <p
          className={`
            text-text-secondary max-w-2xl mx-auto
            ${mode === 'presentation' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}
          `}
        >
          See how LLM requests flow and what they cost
        </p>
      </motion.div>

      {/* Flow diagram with integrated prompt input */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <FlowDiagram
          onTokensUpdate={handleTokensUpdate}
          onStageChange={handleStageChange}
        />
      </motion.div>

      {/* Cost calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlowCard glowColor="orange" padding="lg">
          <CostCalculator
            inputTokens={inputTokens}
            outputTokens={outputTokens}
            isStreaming={isStreaming}
            streamingCount={streamingCount}
          />
        </GlowCard>
      </motion.div>

      {/* Explanation cards */}
      <motion.div
        className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-cyan mb-3">
            1. Request
          </h3>
          <p className="text-text-secondary text-sm">
            Your prompt is sent over HTTPS to the LLM provider&apos;s API servers,
            typically with authentication and configuration headers.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-magenta mb-3">
            2. Tokenization
          </h3>
          <p className="text-text-secondary text-sm">
            Your text is converted to tokens using the model&apos;s tokenizer.
            Token count determines input costs and context usage.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-yellow mb-3">
            3. Routing
          </h3>
          <p className="text-text-secondary text-sm">
            The request is routed to an available GPU cluster.
            Load balancers distribute traffic across thousands of GPUs.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-green mb-3">
            4. Inference
          </h3>
          <p className="text-text-secondary text-sm">
            The model runs on specialized GPUs, generating tokens one at a time.
            This is the most computationally expensive step.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-neon-orange mb-3">
            5. Streaming
          </h3>
          <p className="text-text-secondary text-sm">
            Tokens are streamed back as they&apos;re generated via Server-Sent Events,
            so you see responses in real-time.
          </p>
        </div>

        <div className="bg-bg-surface p-6 rounded-xl border border-text-muted/20">
          <h3 className="text-xl font-display font-bold text-text-primary mb-3">
            6. Billing
          </h3>
          <p className="text-text-secondary text-sm">
            You&apos;re charged based on tokens: input tokens (your prompt) and
            output tokens (the response). Prices vary by model.
          </p>
        </div>
      </motion.div>

      {/* Key facts */}
      <motion.div
        className="mt-12 p-6 bg-bg-surface rounded-xl border border-text-muted/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-display font-bold text-text-primary mb-4">
          Key Facts
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-3">
            <span className="text-neon-cyan">•</span>
            <span className="text-text-secondary">
              <strong className="text-text-primary">~750 words</strong> ≈ 1,000 tokens (rough estimate)
            </span>
          </div>
          <div className="flex gap-3">
            <span className="text-neon-magenta">•</span>
            <span className="text-text-secondary">
              Output tokens typically cost <strong className="text-text-primary">2-10x more</strong> than input
            </span>
          </div>
          <div className="flex gap-3">
            <span className="text-neon-yellow">•</span>
            <span className="text-text-secondary">
              Modern LLMs run on <strong className="text-text-primary">H100/B200 GPUs</strong>
            </span>
          </div>
          <div className="flex gap-3">
            <span className="text-neon-green">•</span>
            <span className="text-text-secondary">
              Typical latency: <strong className="text-text-primary">~20-50ms</strong> per token
            </span>
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
