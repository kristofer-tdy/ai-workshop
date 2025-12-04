'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';

export function TemperatureControl() {
  const { inference, setTemperature } = useAppStore();

  return (
    <div className="space-y-6">
      <Slider
        value={inference.temperature}
        onChange={setTemperature}
        min={0}
        max={2}
        step={0.1}
        label="Temperature"
        formatValue={(v) => v.toFixed(1)}
        leftIcon={<span className="text-lg">❄️</span>}
        leftLabel="Focused"
        rightIcon={<span className="text-lg">🔥</span>}
        rightLabel="Creative"
        color="magenta"
      />

      {/* Explanation cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className={`
            p-4 rounded-lg border transition-all duration-300
            ${inference.temperature < 0.5
              ? 'border-neon-cyan bg-neon-cyan/10'
              : 'border-text-muted/20 bg-bg-surface'
            }
          `}
        >
          <h4 className="font-bold text-neon-cyan mb-2">Low (0.0-0.5)</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Predictable output</li>
            <li>• Picks most likely tokens</li>
            <li>• Good for factual tasks</li>
          </ul>
        </motion.div>

        <motion.div
          className={`
            p-4 rounded-lg border transition-all duration-300
            ${inference.temperature > 1.0
              ? 'border-neon-orange bg-neon-orange/10'
              : 'border-text-muted/20 bg-bg-surface'
            }
          `}
        >
          <h4 className="font-bold text-neon-orange mb-2">High (1.0-2.0)</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Creative output</li>
            <li>• More randomness</li>
            <li>• May produce nonsense</li>
          </ul>
        </motion.div>
      </div>

      {/* Visual probability comparison */}
      <div className="bg-bg-surface p-4 rounded-lg">
        <p className="text-sm text-text-muted mb-3">
          Token selection probabilities at temperature {inference.temperature.toFixed(1)}:
        </p>
        <div className="space-y-2">
          {[
            { word: 'the', baseProb: 0.4 },
            { word: 'a', baseProb: 0.25 },
            { word: 'this', baseProb: 0.15 },
            { word: 'purple', baseProb: 0.1 },
            { word: 'dancing', baseProb: 0.1 },
          ].map((item) => {
            // Simulate temperature effect on probability
            const adjustedProb =
              inference.temperature === 0
                ? item.word === 'the' ? 100 : 0
                : Math.round(
                    (Math.pow(item.baseProb, 1 / Math.max(0.1, inference.temperature)) /
                      [0.4, 0.25, 0.15, 0.1, 0.1].reduce(
                        (sum, p) => sum + Math.pow(p, 1 / Math.max(0.1, inference.temperature)),
                        0
                      )) *
                      100
                  );

            return (
              <div key={item.word} className="flex items-center gap-3">
                <span className="w-20 font-mono text-text-secondary text-sm">
                  &quot;{item.word}&quot;
                </span>
                <div className="flex-1 bg-bg-elevated rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-full ${adjustedProb > 50 ? 'bg-neon-cyan' : 'bg-neon-magenta/50'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${adjustedProb}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="w-12 text-right text-text-muted text-xs">
                  {adjustedProb}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
