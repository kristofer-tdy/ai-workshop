'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { useAppStore } from '@/store/useAppStore';

export default function TheEndPage() {
  const mode = useAppStore((state) => state.mode);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const content = (
    <div className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden bg-bg-primary flex items-center justify-center">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #00FFFF 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* The End Title */}
          <motion.h1
            className="font-display font-bold text-neon-cyan text-glow-cyan mb-8"
            style={{
              fontSize: mode === 'presentation' ? 'clamp(4rem, 12vw, 10rem)' : 'clamp(3rem, 10vw, 8rem)',
            }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            THE END
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-text-secondary max-w-2xl mx-auto"
            style={{
              fontSize: mode === 'presentation' ? 'clamp(1.25rem, 3vw, 2rem)' : 'clamp(1rem, 2.5vw, 1.5rem)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Thank you for exploring how LLMs think!
          </motion.p>

          {/* Decorative sparkles */}
          <div className="mt-12 flex justify-center gap-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="text-4xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  delay: 1 + i * 0.2,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (mode === 'presentation') {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main>{content}</main>
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
