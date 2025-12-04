'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ZoomContainerProps {
  children: ReactNode;
  zoom: number;
  focusX: number; // 0-100 percentage
  focusY: number; // 0-100 percentage
  className?: string;
}

export function ZoomContainer({
  children,
  zoom,
  focusX,
  focusY,
  className = '',
}: ZoomContainerProps) {
  // Calculate transform origin and translation
  // When zoomed in, we need to translate to keep the focus point centered
  const translateX = (50 - focusX) * (zoom - 1);
  const translateY = (50 - focusY) * (zoom - 1);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="w-full h-full"
        animate={{
          scale: zoom,
          x: `${translateX}%`,
          y: `${translateY}%`,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          mass: 1,
        }}
        style={{
          transformOrigin: `${focusX}% ${focusY}%`,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
