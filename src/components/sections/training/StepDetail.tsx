'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { TokenChip } from '@/components/ui/TokenChip';

const EXAMPLE_CONTEXT = ['The', 'cat', 'sat', 'on', 'the'];
const PREDICTIONS = [
  { word: 'floor', prob: 32 },
  { word: 'mat', prob: 28 },
  { word: 'couch', prob: 18 },
  { word: 'bed', prob: 12 },
  { word: 'rug', prob: 10 },
];
const ACTUAL = 'mat';

const STEP_CONTENT = [
  {
    title: 'Loading Training Data',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          The model receives a sentence from its training data:
        </p>
        <div className="flex flex-wrap gap-2 justify-center p-4 bg-bg-elevated rounded-lg">
          {[...EXAMPLE_CONTEXT, ACTUAL].map((word, i) => (
            <TokenChip
              key={i}
              text={word}
              index={i}
              isActive={i === EXAMPLE_CONTEXT.length}
            />
          ))}
        </div>
        <p className="text-text-muted text-sm text-center">
          The highlighted token is what we want the model to predict
        </p>
      </div>
    ),
  },
  {
    title: 'Predicting Next Token',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Given the context, the model predicts probabilities for each possible next token:
        </p>
        <div className="flex flex-wrap gap-2 justify-center p-4 bg-bg-elevated rounded-lg">
          {EXAMPLE_CONTEXT.map((word, i) => (
            <TokenChip key={i} text={word} index={i} />
          ))}
          <span className="text-neon-magenta font-mono text-xl">???</span>
        </div>
        <div className="space-y-2 max-w-xs mx-auto">
          {PREDICTIONS.map((pred, i) => (
            <motion.div
              key={pred.word}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="w-16 font-mono text-text-secondary">&quot;{pred.word}&quot;</span>
              <div className="flex-1 bg-bg-surface rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full bg-neon-magenta/50"
                  initial={{ width: 0 }}
                  animate={{ width: `${pred.prob}%` }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                />
              </div>
              <span className="w-10 text-right text-text-muted text-sm">{pred.prob}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Comparing to Actual',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          The model&apos;s guess is compared to the actual next word:
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="p-4 bg-bg-elevated rounded-lg text-center">
            <p className="text-text-muted text-sm mb-2">Model predicted:</p>
            <p className="text-2xl font-mono text-neon-magenta">&quot;floor&quot;</p>
            <p className="text-text-muted text-xs mt-1">32% confident</p>
          </div>
          <div className="p-4 bg-bg-elevated rounded-lg text-center">
            <p className="text-text-muted text-sm mb-2">Actual word:</p>
            <p className="text-2xl font-mono text-neon-green">&quot;mat&quot;</p>
            <p className="text-neon-yellow text-xs mt-1">Wrong!</p>
          </div>
        </div>
        <motion.div
          className="text-center p-4 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-neon-yellow font-medium">
            Error: The model needs to learn that &quot;mat&quot; was more likely here
          </p>
        </motion.div>
      </div>
    ),
  },
  {
    title: 'Adjusting Weights',
    content: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          The model adjusts its internal weights to make &quot;mat&quot; more likely next time:
        </p>
        <motion.div
          className="relative p-8 bg-bg-elevated rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Neural network visualization */}
          <div className="flex justify-between items-center gap-4">
            {[0, 1, 2].map((layer) => (
              <div key={layer} className="flex flex-col gap-2">
                {[0, 1, 2, 3].map((node) => (
                  <motion.div
                    key={node}
                    className="w-4 h-4 rounded-full bg-neon-green"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      delay: layer * 0.2 + node * 0.1,
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/20 to-neon-green/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        <motion.p
          className="text-center text-neon-green"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Learning in progress... weights updated!
        </motion.p>
        <p className="text-text-muted text-sm text-center">
          This process repeats billions of times with different examples
        </p>
      </div>
    ),
  },
];

export function StepDetail() {
  const { training } = useAppStore();
  const step = STEP_CONTENT[training.currentStep];

  return (
    <div className="bg-bg-surface border border-text-muted/20 rounded-xl p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={training.currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-display font-bold text-text-primary mb-4">
            {step.title}
          </h3>
          {step.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
