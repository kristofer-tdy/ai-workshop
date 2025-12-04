'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Button, TokenChip } from '@/components/ui';
import { tokenize } from '@/lib/tokenizer';
import { EXAMPLE_PROMPTS } from '@/lib/pricing';

interface Token {
  text: string;
  id: number;
}

const STAGES = [
  { id: 0, name: 'Sending Request', color: 'cyan' },
  { id: 1, name: 'Tokenizing', color: 'magenta' },
  { id: 2, name: 'Routing', color: 'yellow' },
  { id: 3, name: 'Processing', color: 'green' },
  { id: 4, name: 'Streaming', color: 'orange' },
  { id: 5, name: 'Complete', color: 'cyan' },
];

interface FlowDiagramProps {
  onTokensUpdate?: (inputTokens: Token[], outputTokens: Token[]) => void;
  onStageChange?: (stage: number) => void;
}

export function FlowDiagram({ onTokensUpdate, onStageChange }: FlowDiagramProps) {
  const [prompt, setPrompt] = useState('');
  const [currentStage, setCurrentStage] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputTokens, setInputTokens] = useState<Token[]>([]);
  const [outputTokens, setOutputTokens] = useState<Token[]>([]);
  const [streamingTokens, setStreamingTokens] = useState<Token[]>([]);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  const updateStage = useCallback((stage: number) => {
    setCurrentStage(stage);
    onStageChange?.(stage);
  }, [onStageChange]);

  const runAnimation = async () => {
    if (!prompt.trim()) return;

    setIsAnimating(true);
    setOutputTokens([]);
    setStreamingTokens([]);

    // Stage 0: Request sent
    updateStage(0);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Stage 1: Tokenization
    updateStage(1);
    const tokens = tokenize(prompt, 'subword');
    setInputTokens(tokens);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Stage 2: Routing
    updateStage(2);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Stage 3: GPU Processing
    updateStage(3);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Stage 4: Streaming output
    updateStage(4);

    // Find the expected output for the selected example, or generate a default
    const example = selectedExample !== null ? EXAMPLE_PROMPTS[selectedExample] : null;
    const outputText = example?.expectedOutput || 'This is a simulated response from the LLM based on your prompt.';
    const outputTokensArray = tokenize(outputText, 'subword');

    // Stream tokens one by one
    for (let i = 0; i < outputTokensArray.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      setStreamingTokens((prev) => [...prev, outputTokensArray[i]]);
    }

    setOutputTokens(outputTokensArray);
    onTokensUpdate?.(tokens, outputTokensArray);

    // Stage 5: Complete
    updateStage(5);
    await new Promise((resolve) => setTimeout(resolve, 300));

    setIsAnimating(false);
  };

  const resetAnimation = () => {
    updateStage(-1);
    setInputTokens([]);
    setOutputTokens([]);
    setStreamingTokens([]);
    onTokensUpdate?.([], []);
  };

  const selectExample = (index: number) => {
    setSelectedExample(index);
    setPrompt(EXAMPLE_PROMPTS[index].prompt);
    resetAnimation();
  };

  return (
    <div className="space-y-6">
      {/* Prompt Input Section */}
      <div className="bg-bg-surface rounded-xl p-6 border border-text-muted/20">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Enter a prompt:
        </label>
        <textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setSelectedExample(null);
          }}
          placeholder="Type your prompt here..."
          disabled={isAnimating}
          className="
            w-full px-4 py-3 h-24
            bg-bg-elevated border border-text-muted/30
            rounded-lg text-text-primary font-mono text-sm
            focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan/50
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
          "
        />

        {/* Example prompts */}
        <div className="mt-4">
          <span className="text-xs text-text-muted mr-2">Try an example:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <button
                key={index}
                onClick={() => selectExample(index)}
                disabled={isAnimating}
                className={`
                  px-3 py-1.5 text-xs rounded-lg
                  transition-all duration-200
                  ${selectedExample === index
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                    : 'bg-bg-elevated text-text-muted hover:text-text-secondary border border-text-muted/20 hover:border-text-muted/40'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="relative bg-bg-surface rounded-xl p-6 md:p-8 overflow-hidden border border-text-muted/20">
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
          {/* Your App - Left */}
          <div className="flex flex-col items-center gap-4 lg:w-1/4">
            <motion.div
              className={`
                w-full max-w-[200px] min-h-[160px]
                flex flex-col items-center justify-center
                bg-bg-elevated rounded-2xl p-4
                border-2 transition-all duration-300
                ${currentStage === 0 || currentStage === 5
                  ? 'border-neon-cyan shadow-glow-cyan'
                  : 'border-text-muted/30'
                }
              `}
            >
              <span className="text-3xl mb-2">📱</span>
              <span className="text-sm font-medium text-text-secondary mb-2">Your App</span>

              {currentStage === 0 && (
                <motion.div
                  className="text-xs text-neon-cyan font-mono truncate max-w-full px-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Sending...
                </motion.div>
              )}

              {currentStage >= 4 && streamingTokens.length > 0 && (
                <div className="mt-2 max-h-20 overflow-y-auto text-xs text-neon-green font-mono text-center px-2">
                  {streamingTokens.slice(-5).map((t) => t.text).join('')}
                  {currentStage === 4 && <span className="animate-pulse">|</span>}
                </div>
              )}

              {currentStage === 5 && (
                <motion.div
                  className="text-xs text-neon-green font-mono mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  Complete
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Center: LLM Service */}
          <div className="flex-1 lg:w-2/4">
            <motion.div
              className={`
                relative w-full
                bg-bg-elevated rounded-2xl
                border-2 p-4
                transition-all duration-300
                ${currentStage >= 1 && currentStage <= 4
                  ? 'border-neon-magenta/50'
                  : 'border-text-muted/30'
                }
              `}
            >
              <h4 className="text-center text-sm font-bold text-text-secondary mb-4">
                LLM SERVICE
              </h4>

              {/* Service stages */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Tokenizer', stageIndex: 1, icon: '🔤' },
                  { name: 'Router', stageIndex: 2, icon: '🔀' },
                  { name: 'GPU Cluster', stageIndex: 3, icon: '⚡' },
                  { name: 'Output Stream', stageIndex: 4, icon: '📤' },
                ].map(({ name, stageIndex, icon }) => {
                  const isActive = currentStage === stageIndex;
                  const isPast = currentStage > stageIndex;

                  return (
                    <motion.div
                      key={name}
                      className={`
                        p-3 rounded-lg text-center
                        transition-all duration-300
                        ${isActive
                          ? 'bg-neon-magenta/20 border border-neon-magenta'
                          : isPast
                          ? 'bg-neon-green/10 border border-neon-green/30'
                          : 'bg-bg-primary/50 border border-text-muted/20'
                        }
                      `}
                    >
                      <div className="text-lg mb-1">{icon}</div>
                      <span className={`text-xs ${isActive ? 'text-neon-magenta' : isPast ? 'text-neon-green' : 'text-text-muted'}`}>
                        {name}
                      </span>

                      {/* Show tokens during tokenization */}
                      {isActive && stageIndex === 1 && inputTokens.length > 0 && (
                        <div className="mt-2 text-xs text-neon-magenta">
                          {inputTokens.length} tokens
                        </div>
                      )}

                      {/* GPU animation */}
                      {isActive && stageIndex === 3 && (
                        <div className="flex justify-center gap-1 mt-2">
                          {[0, 1, 2, 3].map((gpu) => (
                            <motion.div
                              key={gpu}
                              className="w-3 h-3 bg-neon-green rounded"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                delay: gpu * 0.1,
                                repeat: Infinity,
                                duration: 0.5,
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Streaming indicator */}
                      {isActive && stageIndex === 4 && (
                        <div className="mt-2 text-xs text-neon-orange">
                          {streamingTokens.length} / {outputTokens.length || '?'}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Token visualization */}
              {currentStage >= 1 && inputTokens.length > 0 && (
                <div className="mt-4 p-3 bg-bg-primary/50 rounded-lg">
                  <div className="text-xs text-text-muted mb-2">Input Tokens:</div>
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                      {inputTokens.slice(0, 20).map((token, i) => (
                        <motion.span
                          key={`${token.id}-${i}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="px-1.5 py-0.5 text-xs font-mono bg-neon-cyan/20 text-neon-cyan rounded border border-neon-cyan/30"
                        >
                          {token.text === ' ' ? '␣' : token.text}
                        </motion.span>
                      ))}
                      {inputTokens.length > 20 && (
                        <span className="px-1.5 py-0.5 text-xs text-text-muted">
                          +{inputTokens.length - 20} more
                        </span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Output Display */}
          <div className="flex flex-col items-center gap-4 lg:w-1/4">
            <motion.div
              className={`
                w-full max-w-[200px] min-h-[160px]
                flex flex-col items-center justify-center
                bg-bg-elevated rounded-2xl p-4
                border-2 transition-all duration-300
                ${currentStage >= 4
                  ? 'border-neon-green shadow-glow-green'
                  : 'border-text-muted/30'
                }
              `}
            >
              <span className="text-3xl mb-2">📊</span>
              <span className="text-sm font-medium text-text-secondary">Output</span>

              {currentStage >= 5 && outputTokens.length > 0 && (
                <div className="mt-2 text-center">
                  <div className="text-xs text-neon-green font-mono">
                    {outputTokens.length} tokens
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Stage progress indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {STAGES.map((stage, index) => (
            <div
              key={stage.id}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-full text-xs
                transition-all duration-200
                ${currentStage === index
                  ? 'bg-neon-cyan/20 text-neon-cyan'
                  : currentStage > index
                  ? 'bg-neon-green/10 text-neon-green'
                  : 'bg-bg-elevated text-text-muted'
                }
              `}
            >
              <span className={`w-2 h-2 rounded-full ${
                currentStage === index
                  ? 'bg-neon-cyan animate-pulse'
                  : currentStage > index
                  ? 'bg-neon-green'
                  : 'bg-text-muted/30'
              }`} />
              <span className="hidden sm:inline">{stage.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={runAnimation}
          disabled={isAnimating || !prompt.trim()}
          size="lg"
          rightIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          }
        >
          {isAnimating ? 'Processing...' : 'Send Request'}
        </Button>
        <Button
          variant="secondary"
          onClick={resetAnimation}
          disabled={isAnimating || currentStage === -1}
        >
          Reset
        </Button>
      </div>

      {/* Output display */}
      {currentStage >= 5 && outputTokens.length > 0 && (
        <motion.div
          className="bg-bg-surface rounded-xl p-6 border border-neon-green/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="text-sm font-medium text-text-secondary mb-3">Generated Response:</h4>
          <div className="flex flex-wrap gap-1">
            {outputTokens.map((token, i) => (
              <TokenChip
                key={`output-${token.id}-${i}`}
                text={token.text}
                index={i}
                size="sm"
              />
            ))}
          </div>
          <div className="mt-4 text-text-primary font-mono text-sm whitespace-pre-wrap bg-bg-elevated p-4 rounded-lg">
            {outputTokens.map((t) => t.text).join('')}
          </div>
        </motion.div>
      )}
    </div>
  );
}
