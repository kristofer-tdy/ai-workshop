'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { useAppStore } from '@/store/useAppStore';

interface Challenge {
  title: string;
  description: string;
}

interface ChallengesData {
  easy: Challenge[];
  medium: Challenge[];
  hard: Challenge[];
}

interface ActiveChallenge extends Challenge {
  id: string;
  startTime: number;
  duration: number; // in ms
  isExpiring: boolean;
  isStreaming: boolean;
  streamedTitle: string;
  streamedDescription: string;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const CHALLENGE_DURATION_MIN = 45000; // 45 seconds minimum
const CHALLENGE_DURATION_MAX = 120000; // 120 seconds maximum
const MAX_CHALLENGES_PER_COLUMN = 5;
const SPAWN_DELAY_MIN = 2000; // 2 seconds
const SPAWN_DELAY_MAX = 6000; // 6 seconds
const STREAM_SPEED = 25; // ms per character

const difficultyConfig: Record<Difficulty, { color: string; glowColor: string; label: string }> = {
  easy: {
    color: 'neon-green',
    glowColor: 'rgba(0, 255, 0, 0.5)',
    label: 'Padawan',
  },
  medium: {
    color: 'neon-yellow',
    glowColor: 'rgba(255, 255, 0, 0.5)',
    label: 'Jedi Knight',
  },
  hard: {
    color: 'neon-magenta',
    glowColor: 'rgba(255, 0, 255, 0.5)',
    label: 'Jedi Master',
  },
};

function ChallengeCard({
  challenge,
  difficulty,
  onRemove,
}: {
  challenge: ActiveChallenge;
  difficulty: Difficulty;
  onRemove: (id: string) => void;
}) {
  const [progress, setProgress] = useState(100);
  const config = difficultyConfig[difficulty];
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - challenge.startTime;
      const remaining = Math.max(0, 100 - (elapsed / challenge.duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [challenge.startTime, challenge.duration]);

  // Handle expiring state
  useEffect(() => {
    if (challenge.isExpiring) {
      const timeout = setTimeout(() => {
        onRemove(challenge.id);
      }, 1500); // Pulse for 1.5 seconds then remove
      return () => clearTimeout(timeout);
    }
  }, [challenge.isExpiring, challenge.id, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{
        opacity: challenge.isExpiring ? [1, 0.3, 1, 0.3, 0] : 1,
        y: 0,
        scale: challenge.isExpiring ? [1, 1.02, 1, 1.02, 0.9] : 1,
        boxShadow: challenge.isExpiring
          ? [
              `0 0 20px ${config.glowColor}`,
              `0 0 40px ${config.glowColor}`,
              `0 0 20px ${config.glowColor}`,
              `0 0 40px ${config.glowColor}`,
              '0 0 0px transparent',
            ]
          : `0 0 15px ${config.glowColor.replace('0.5', '0.2')}`,
      }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{
        duration: challenge.isExpiring ? 1.5 : 0.3,
        layout: { duration: 0.3 },
      }}
      className={`bg-bg-surface rounded-lg p-3 border-2 transition-colors ${
        challenge.isExpiring ? `border-${config.color}` : 'border-text-muted/30'
      }`}
    >
      {/* Title with streaming effect */}
      <h3 className={`text-base font-bold text-${config.color} mb-1.5 font-display`}>
        {challenge.isStreaming ? (
          <>
            {challenge.streamedTitle}
            <motion.span
              className={`inline-block w-[2px] h-5 bg-${config.color} ml-1`}
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
            />
          </>
        ) : (
          challenge.title
        )}
      </h3>

      {/* Description with streaming effect */}
      <p className="text-xs text-text-secondary mb-3 whitespace-pre-line min-h-[32px] leading-relaxed">
        {challenge.isStreaming ? (
          <>
            {challenge.streamedDescription}
            {challenge.streamedTitle === challenge.title && (
              <motion.span
                className={`inline-block w-[2px] h-4 bg-${config.color} ml-0.5`}
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
              />
            )}
          </>
        ) : (
          challenge.description
        )}
      </p>

      {/* Timer bar */}
      <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-${config.color} rounded-full`}
          style={{ width: `${progress}%` }}
          animate={{
            opacity: progress < 20 ? [1, 0.5, 1] : 1,
          }}
          transition={{
            opacity: { repeat: Infinity, duration: 0.5 },
          }}
        />
      </div>
    </motion.div>
  );
}

function ChallengeColumn({
  title,
  difficulty,
  challenges,
  onRemove,
}: {
  title: string;
  difficulty: Difficulty;
  challenges: ActiveChallenge[];
  onRemove: (id: string) => void;
}) {
  const config = difficultyConfig[difficulty];

  return (
    <div className="flex-1 flex flex-col">
      {/* Column Header */}
      <motion.div
        className={`text-center mb-6 pb-4 border-b-2 border-${config.color}/30`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: difficulty === 'easy' ? 0 : difficulty === 'medium' ? 0.1 : 0.2 }}
      >
        <h2
          className={`text-3xl font-display font-bold text-${config.color}`}
          style={{ textShadow: `0 0 20px ${config.glowColor}` }}
        >
          {title}
        </h2>
        <p className="text-sm text-text-muted mt-1">
          {challenges.filter((c) => !c.isExpiring).length} active
        </p>
      </motion.div>

      {/* Challenges Stack */}
      <div className="flex-1 space-y-4">
        <AnimatePresence mode="popLayout">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              difficulty={difficulty}
              onRemove={onRemove}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const mode = useAppStore((state) => state.mode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [challengesData, setChallengesData] = useState<ChallengesData | null>(null);
  const [activeChallenges, setActiveChallenges] = useState<Record<Difficulty, ActiveChallenge[]>>({
    easy: [],
    medium: [],
    hard: [],
  });
  const usedChallengesRef = useRef<Record<Difficulty, Set<string>>>({
    easy: new Set(),
    medium: new Set(),
    hard: new Set(),
  });

  // Fetch challenges on mount
  useEffect(() => {
    fetch('/api/challenges')
      .then((res) => res.json())
      .then((data) => setChallengesData(data))
      .catch((err) => console.error('Failed to load challenges:', err));
  }, []);

  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Get random challenge that hasn't been used recently
  const getRandomChallenge = useCallback(
    (difficulty: Difficulty): Challenge | null => {
      if (!challengesData) return null;

      const available = challengesData[difficulty];
      if (available.length === 0) return null;

      // Filter out recently used challenges
      const unused = available.filter(
        (c) => !usedChallengesRef.current[difficulty].has(c.title)
      );

      // If all challenges have been used, reset the set
      if (unused.length === 0) {
        usedChallengesRef.current[difficulty].clear();
        return available[Math.floor(Math.random() * available.length)];
      }

      const selected = unused[Math.floor(Math.random() * unused.length)];
      usedChallengesRef.current[difficulty].add(selected.title);
      return selected;
    },
    [challengesData]
  );

  // Spawn a new challenge with streaming animation
  const spawnChallenge = useCallback(
    (difficulty: Difficulty) => {
      const challenge = getRandomChallenge(difficulty);
      if (!challenge) return;

      // Random duration between min and max
      const randomDuration = CHALLENGE_DURATION_MIN +
        Math.random() * (CHALLENGE_DURATION_MAX - CHALLENGE_DURATION_MIN);

      const newChallenge: ActiveChallenge = {
        ...challenge,
        id: generateId(),
        startTime: Date.now(),
        duration: randomDuration,
        isExpiring: false,
        isStreaming: true,
        streamedTitle: '',
        streamedDescription: '',
      };

      setActiveChallenges((prev) => {
        // Check limit inside the state update to prevent race conditions
        const currentCount = prev[difficulty].filter((c) => !c.isExpiring).length;
        if (currentCount >= MAX_CHALLENGES_PER_COLUMN) {
          return prev; // Don't add if at limit
        }
        return {
          ...prev,
          [difficulty]: [...prev[difficulty], newChallenge],
        };
      });

      // Stream the title
      let titleIndex = 0;
      const titleInterval = setInterval(() => {
        if (titleIndex < challenge.title.length) {
          setActiveChallenges((prev) => ({
            ...prev,
            [difficulty]: prev[difficulty].map((c) =>
              c.id === newChallenge.id
                ? { ...c, streamedTitle: challenge.title.slice(0, titleIndex + 1) }
                : c
            ),
          }));
          titleIndex++;
        } else {
          clearInterval(titleInterval);

          // Stream the description
          let descIndex = 0;
          const descInterval = setInterval(() => {
            if (descIndex < challenge.description.length) {
              setActiveChallenges((prev) => ({
                ...prev,
                [difficulty]: prev[difficulty].map((c) =>
                  c.id === newChallenge.id
                    ? {
                        ...c,
                        streamedDescription: challenge.description.slice(0, descIndex + 1),
                      }
                    : c
                ),
              }));
              descIndex++;
            } else {
              clearInterval(descInterval);
              // Mark streaming as complete
              setActiveChallenges((prev) => ({
                ...prev,
                [difficulty]: prev[difficulty].map((c) =>
                  c.id === newChallenge.id ? { ...c, isStreaming: false } : c
                ),
              }));
            }
          }, STREAM_SPEED);
        }
      }, STREAM_SPEED);
    },
    [getRandomChallenge]
  );

  // Remove a challenge
  const removeChallenge = useCallback((id: string) => {
    setActiveChallenges((prev) => ({
      easy: prev.easy.filter((c) => c.id !== id),
      medium: prev.medium.filter((c) => c.id !== id),
      hard: prev.hard.filter((c) => c.id !== id),
    }));
  }, []);

  // Check for expired challenges
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChallenges((prev) => {
        const updated = { ...prev };
        let hasChanges = false;

        (['easy', 'medium', 'hard'] as Difficulty[]).forEach((difficulty) => {
          updated[difficulty] = prev[difficulty].map((challenge) => {
            if (challenge.isExpiring || challenge.isStreaming) return challenge;

            const elapsed = Date.now() - challenge.startTime;
            if (elapsed >= challenge.duration) {
              hasChanges = true;
              return { ...challenge, isExpiring: true };
            }
            return challenge;
          });
        });

        return hasChanges ? updated : prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Simple periodic spawning - the limit check is inside spawnChallenge
  useEffect(() => {
    if (!challengesData) return;

    // Initial spawns with staggered delays
    const initialTimeouts = [
      setTimeout(() => spawnChallenge('easy'), 500),
      setTimeout(() => spawnChallenge('medium'), 1500),
      setTimeout(() => spawnChallenge('hard'), 2500),
    ];

    // Periodic spawning - try to spawn one in each column every few seconds
    const interval = setInterval(() => {
      const delay1 = Math.random() * 2000;
      const delay2 = Math.random() * 2000;
      const delay3 = Math.random() * 2000;

      setTimeout(() => spawnChallenge('easy'), delay1);
      setTimeout(() => spawnChallenge('medium'), delay2);
      setTimeout(() => spawnChallenge('hard'), delay3);
    }, 5000);

    return () => {
      initialTimeouts.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [challengesData, spawnChallenge]);

  const content = (
    <div className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden bg-bg-primary p-6">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-[10%] w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #00FF00 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-[20%] left-[45%] w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #FFFF00 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-0 right-[10%] w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #FF00FF 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-neon-cyan text-glow-cyan mb-2">
          Workshop Challenges
        </h1>
        <p className="text-text-secondary">
          Pick a challenge from any column and start coding!
        </p>
      </motion.div>

      {/* Challenge Columns */}
      <div className="flex gap-6 max-w-7xl mx-auto h-[calc(100vh-200px)]">
        <ChallengeColumn
          title={difficultyConfig.easy.label}
          difficulty="easy"
          challenges={activeChallenges.easy}
          onRemove={removeChallenge}
        />
        <ChallengeColumn
          title={difficultyConfig.medium.label}
          difficulty="medium"
          challenges={activeChallenges.medium}
          onRemove={removeChallenge}
        />
        <ChallengeColumn
          title={difficultyConfig.hard.label}
          difficulty="hard"
          challenges={activeChallenges.hard}
          onRemove={removeChallenge}
        />
      </div>

      {/* Loading state */}
      {!challengesData && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-bg-primary/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <motion.div
              className="text-4xl mb-4"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              ⚡
            </motion.div>
            <p className="text-text-secondary">Loading challenges...</p>
          </div>
        </motion.div>
      )}
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
