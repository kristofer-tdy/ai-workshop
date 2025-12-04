'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const STEPS = [
  {
    id: 0,
    title: 'Training Data',
    description: 'Load a piece of training text',
    color: 'cyan',
  },
  {
    id: 1,
    title: 'Predict',
    description: 'Model predicts the next token',
    color: 'magenta',
  },
  {
    id: 2,
    title: 'Compare',
    description: 'Compare prediction to actual answer',
    color: 'yellow',
  },
  {
    id: 3,
    title: 'Adjust',
    description: 'Update model weights based on error',
    color: 'green',
  },
];

export function TrainingLoop() {
  const { training } = useAppStore();
  const currentStep = training.currentStep;

  return (
    <div className="relative">
      {/* Loop visualization */}
      <div className="relative w-full max-w-lg mx-auto aspect-square">
        {/* Central connecting lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arrows between nodes */}
          <motion.path
            d="M100 40 L100 80"
            stroke={currentStep >= 0 ? '#00ffff' : '#444'}
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M130 100 L160 100"
            stroke={currentStep >= 1 ? '#ff00ff' : '#444'}
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentStep >= 1 ? 1 : 0 }}
          />
          <motion.path
            d="M100 130 L100 160"
            stroke={currentStep >= 2 ? '#ffff00' : '#444'}
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentStep >= 2 ? 1 : 0 }}
          />
          <motion.path
            d="M40 100 L70 100"
            stroke={currentStep >= 3 ? '#00ff88' : '#444'}
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentStep >= 3 ? 1 : 0 }}
          />
          {/* Return arrow */}
          <motion.path
            d="M40 60 Q20 60 20 100 Q20 140 40 140"
            stroke={currentStep >= 3 ? '#00ff88' : '#444'}
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentStep >= 3 ? 1 : 0 }}
          />
        </svg>

        {/* Step nodes */}
        {STEPS.map((step, i) => {
          const positions = [
            { top: '5%', left: '50%', transform: 'translateX(-50%)' },
            { top: '35%', right: '5%' },
            { bottom: '5%', left: '50%', transform: 'translateX(-50%)' },
            { top: '35%', left: '5%' },
          ];

          const isActive = currentStep === step.id;
          const isPast = currentStep > step.id;

          return (
            <motion.div
              key={step.id}
              className="absolute"
              style={positions[i] as React.CSSProperties}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isActive ? 1.1 : 1,
                opacity: 1,
              }}
              transition={{ delay: i * 0.1, type: 'spring' }}
            >
              <div
                className={`
                  w-24 h-24 md:w-32 md:h-32
                  rounded-2xl
                  flex flex-col items-center justify-center
                  border-2 transition-all duration-300
                  ${isActive
                    ? `border-neon-${step.color} bg-neon-${step.color}/20 shadow-glow-${step.color}`
                    : isPast
                    ? 'border-text-muted/50 bg-bg-elevated'
                    : 'border-text-muted/30 bg-bg-surface'
                  }
                `}
                style={{
                  borderColor: isActive
                    ? step.color === 'cyan' ? '#00ffff'
                      : step.color === 'magenta' ? '#ff00ff'
                      : step.color === 'yellow' ? '#ffff00'
                      : '#00ff88'
                    : undefined,
                }}
              >
                <span
                  className={`
                    text-xs md:text-sm font-bold uppercase tracking-wider
                    ${isActive ? 'text-text-primary' : 'text-text-muted'}
                  `}
                  style={{
                    color: isActive
                      ? step.color === 'cyan' ? '#00ffff'
                        : step.color === 'magenta' ? '#ff00ff'
                        : step.color === 'yellow' ? '#ffff00'
                        : '#00ff88'
                      : undefined,
                  }}
                >
                  {step.title}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-2xl md:text-3xl font-display font-bold text-text-primary">
              Step {currentStep + 1}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
