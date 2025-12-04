'use client';

import { motion } from 'framer-motion';
import { useId } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  leftLabel?: string;
  rightLabel?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  color?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'orange';
  disabled?: boolean;
}

const colorStyles = {
  cyan: {
    track: 'bg-neon-cyan',
    thumb: 'border-neon-cyan shadow-glow-cyan',
  },
  magenta: {
    track: 'bg-neon-magenta',
    thumb: 'border-neon-magenta shadow-glow-magenta',
  },
  yellow: {
    track: 'bg-neon-yellow',
    thumb: 'border-neon-yellow shadow-glow-yellow',
  },
  green: {
    track: 'bg-neon-green',
    thumb: 'border-neon-green shadow-glow-green',
  },
  orange: {
    track: 'bg-neon-orange',
    thumb: 'border-neon-orange shadow-glow-orange',
  },
};

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue = (v) => v.toString(),
  leftLabel,
  rightLabel,
  leftIcon,
  rightIcon,
  color = 'cyan',
  disabled = false,
}: SliderProps) {
  const id = useId();
  const percentage = ((value - min) / (max - min)) * 100;
  const styles = colorStyles[color];

  return (
    <div className={`w-full ${disabled ? 'opacity-50' : ''}`}>
      {/* Label and value */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label
              htmlFor={id}
              className="text-text-secondary font-medium"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-text-primary font-mono">
              {formatValue(value)}
            </span>
          )}
        </div>
      )}

      {/* Slider container */}
      <div className="flex items-center gap-3">
        {/* Left icon/label */}
        {(leftIcon || leftLabel) && (
          <div className="flex items-center gap-1 text-text-secondary text-sm whitespace-nowrap">
            {leftIcon}
            {leftLabel}
          </div>
        )}

        {/* Slider track */}
        <div className="relative flex-1 h-2">
          {/* Background track */}
          <div className="absolute inset-0 bg-text-muted/30 rounded-full" />

          {/* Active track */}
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${styles.track}`}
            style={{ width: `${percentage}%` }}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.1 }}
          />

          {/* Native input (hidden but functional) */}
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={formatValue(value)}
          />

          {/* Thumb */}
          <motion.div
            className={`
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2
              w-5 h-5 rounded-full
              bg-bg-primary border-2
              pointer-events-none
              ${styles.thumb}
            `}
            style={{ left: `${percentage}%` }}
            initial={false}
            animate={{ left: `${percentage}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Right icon/label */}
        {(rightIcon || rightLabel) && (
          <div className="flex items-center gap-1 text-text-secondary text-sm whitespace-nowrap">
            {rightLabel}
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}

// Discrete slider for selecting between fixed options
interface DiscreteSliderProps {
  value: number;
  onChange: (value: number) => void;
  options: { value: number; label: string }[];
  label?: string;
  color?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'orange';
}

export function DiscreteSlider({
  value,
  onChange,
  options,
  label,
  color = 'cyan',
}: DiscreteSliderProps) {
  const id = useId();
  const currentIndex = options.findIndex((opt) => opt.value === value);
  const percentage = (currentIndex / (options.length - 1)) * 100;
  const styles = colorStyles[color];

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-text-secondary font-medium mb-4"
        >
          {label}
        </label>
      )}

      {/* Options labels */}
      <div className="flex justify-between mb-2">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              text-sm font-medium transition-colors
              ${option.value === value
                ? 'text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Track */}
      <div className="relative h-2">
        <div className="absolute inset-0 bg-text-muted/30 rounded-full" />

        {/* Dots for each option */}
        <div className="absolute inset-0 flex justify-between items-center px-0">
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                w-3 h-3 rounded-full transition-all
                ${option.value === value
                  ? `${styles.track} scale-125`
                  : 'bg-text-muted hover:bg-text-secondary'
                }
              `}
              aria-label={option.label}
            />
          ))}
        </div>

        {/* Active track line */}
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${styles.track}`}
          style={{ width: `${percentage}%` }}
          initial={false}
          animate={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
