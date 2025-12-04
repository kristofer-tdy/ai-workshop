'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ModeToggle } from './ModeToggle';
import { useAppStore } from '@/store/useAppStore';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export function Header({ onMenuClick, showMenu = true }: HeaderProps) {
  const mode = useAppStore((state) => state.mode);

  // In presentation mode, header is minimal
  if (mode === 'presentation') {
    return (
      <motion.header
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ModeToggle />
      </motion.header>
    );
  }

  return (
    <header className="
      sticky top-0 z-40
      bg-bg-primary/80 backdrop-blur-sm
      border-b border-text-muted/20
    ">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="
                p-2 rounded-lg lg:hidden
                text-text-secondary hover:text-text-primary
                hover:bg-bg-elevated
                transition-colors
              "
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <span className="text-xl">🧠</span>
            <span className="font-display font-bold text-glow-cyan">
              How LLMs Think
            </span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
