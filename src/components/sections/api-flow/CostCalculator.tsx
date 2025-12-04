'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MODEL_PRICING, calculateCost, formatCost, MODELS_BY_PROVIDER } from '@/lib/pricing';

interface Token {
  text: string;
  id: number;
}

interface CostCalculatorProps {
  inputTokens: Token[];
  outputTokens: Token[];
  isStreaming?: boolean;
  streamingCount?: number;
}

export function CostCalculator({
  inputTokens,
  outputTokens,
  isStreaming = false,
  streamingCount = 0,
}: CostCalculatorProps) {
  const [selectedModel, setSelectedModel] = useState('gpt-5-mini');

  const inputCount = inputTokens.length;
  const outputCount = isStreaming ? streamingCount : outputTokens.length;

  const pricing = MODEL_PRICING[selectedModel];
  const { inputCost, outputCost, totalCost } = calculateCost(
    selectedModel,
    inputCount,
    outputCount
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold text-text-primary">
          Cost Calculator
        </h3>
        {(inputCount > 0 || outputCount > 0) && (
          <motion.div
            className="text-2xl font-mono font-bold text-neon-orange"
            key={totalCost.toFixed(6)}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {formatCost(totalCost)}
          </motion.div>
        )}
      </div>

      {/* Model selector by provider */}
      <div className="space-y-4">
        {Object.entries(MODELS_BY_PROVIDER).map(([provider, models]) => (
          <div key={provider}>
            <label className="block text-xs text-text-muted mb-2 uppercase tracking-wider">
              {provider}
            </label>
            <div className="flex flex-wrap gap-2">
              {models.map((model) => (
                <button
                  key={model.name}
                  onClick={() => setSelectedModel(model.name)}
                  className={`
                    px-3 py-2 rounded-lg text-sm
                    transition-all duration-200
                    ${selectedModel === model.name
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                      : 'bg-bg-elevated text-text-muted hover:text-text-secondary border border-text-muted/20 hover:border-text-muted/40'
                    }
                  `}
                >
                  <div className="font-medium">{model.displayName}</div>
                  <div className="text-xs opacity-60 mt-0.5">
                    ${model.inputPer1M} / ${model.outputPer1M}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Token counts and costs */}
      <div className="bg-bg-elevated rounded-lg p-4 space-y-3">
        {/* Input tokens */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-neon-cyan" />
            <span className="text-text-secondary">Input tokens</span>
          </div>
          <div className="text-right">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={inputCount}
                className="font-mono text-text-primary"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {inputCount.toLocaleString()}
              </motion.span>
            </AnimatePresence>
            <span className="text-text-muted text-sm ml-2">
              = {formatCost(inputCost)}
            </span>
          </div>
        </div>

        {/* Output tokens */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-neon-orange animate-pulse' : 'bg-neon-green'}`} />
            <span className="text-text-secondary">
              Output tokens
              {isStreaming && <span className="text-neon-orange ml-1">(streaming...)</span>}
            </span>
          </div>
          <div className="text-right">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={outputCount}
                className="font-mono text-text-primary"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {outputCount.toLocaleString()}
              </motion.span>
            </AnimatePresence>
            <span className="text-text-muted text-sm ml-2">
              = {formatCost(outputCost)}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-text-muted/30 pt-3 flex items-center justify-between">
          <span className="font-bold text-text-primary">Total Cost</span>
          <motion.span
            key={totalCost.toFixed(6)}
            className={`font-mono font-bold text-lg ${
              totalCost > 0 ? 'text-neon-orange' : 'text-text-muted'
            }`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          >
            {formatCost(totalCost)}
          </motion.span>
        </div>
      </div>

      {/* Pricing details */}
      {pricing && (
        <div className="bg-bg-surface rounded-lg p-4 border border-text-muted/20">
          <div className="flex items-start gap-3">
            <div className="text-2xl">
              {pricing.provider === 'openai' && '🟢'}
              {pricing.provider === 'anthropic' && '🟠'}
              {pricing.provider === 'google' && '🔵'}
            </div>
            <div>
              <h4 className="font-bold text-text-primary">{pricing.displayName}</h4>
              <p className="text-sm text-text-muted mt-1">{pricing.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Input:</span>
                  <span className="text-text-secondary ml-2 font-mono">
                    ${pricing.inputPer1M.toFixed(2)} / 1M tokens
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Output:</span>
                  <span className="text-text-secondary ml-2 font-mono">
                    ${pricing.outputPer1M.toFixed(2)} / 1M tokens
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost comparison */}
      {(inputCount > 0 || outputCount > 0) && (
        <div className="bg-bg-surface rounded-lg p-4 border border-text-muted/20">
          <h4 className="text-sm font-bold text-text-secondary mb-3">
            Same request on other models:
          </h4>
          <div className="space-y-2">
            {Object.values(MODEL_PRICING)
              .filter((m) => m.name !== selectedModel)
              .sort((a, b) => {
                const costA = calculateCost(a.name, inputCount, outputCount).totalCost;
                const costB = calculateCost(b.name, inputCount, outputCount).totalCost;
                return costA - costB;
              })
              .slice(0, 4)
              .map((model) => {
                const { totalCost: otherCost } = calculateCost(
                  model.name,
                  inputCount,
                  outputCount
                );
                const diff = otherCost - totalCost;
                const percentDiff = totalCost > 0 ? (diff / totalCost) * 100 : 0;
                const isMore = diff > 0;

                return (
                  <div key={model.name} className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">{model.displayName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-text-secondary">
                        {formatCost(otherCost)}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        isMore
                          ? 'bg-neon-orange/20 text-neon-orange'
                          : 'bg-neon-green/20 text-neon-green'
                      }`}>
                        {isMore ? '+' : ''}{percentDiff.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {inputCount === 0 && outputCount === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p>Enter a prompt above and click &quot;Send Request&quot; to see cost calculations</p>
        </div>
      )}
    </div>
  );
}
