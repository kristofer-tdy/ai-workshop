import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export interface Challenge {
  title: string;
  description: string;
}

export interface ChallengesData {
  easy: Challenge[];
  medium: Challenge[];
  hard: Challenge[];
}

function parseChallenges(content: string): ChallengesData {
  const result: ChallengesData = {
    easy: [],
    medium: [],
    hard: [],
  };

  let currentSection: 'easy' | 'medium' | 'hard' | null = null;
  let currentTitle = '';
  let currentDescription = '';
  let inDescription = false;

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for section headers
    if (line.trim() === '### Easy') {
      // Save previous challenge if exists
      if (currentSection && currentTitle) {
        result[currentSection].push({
          title: currentTitle,
          description: currentDescription.trim(),
        });
      }
      currentSection = 'easy';
      currentTitle = '';
      currentDescription = '';
      inDescription = false;
      continue;
    }
    if (line.trim() === '### Medium') {
      if (currentSection && currentTitle) {
        result[currentSection].push({
          title: currentTitle,
          description: currentDescription.trim(),
        });
      }
      currentSection = 'medium';
      currentTitle = '';
      currentDescription = '';
      inDescription = false;
      continue;
    }
    if (line.trim() === '### Hard') {
      if (currentSection && currentTitle) {
        result[currentSection].push({
          title: currentTitle,
          description: currentDescription.trim(),
        });
      }
      currentSection = 'hard';
      currentTitle = '';
      currentDescription = '';
      inDescription = false;
      continue;
    }

    if (!currentSection) continue;

    // Check for title
    if (line.startsWith('Title:')) {
      // Save previous challenge if exists
      if (currentTitle) {
        result[currentSection].push({
          title: currentTitle,
          description: currentDescription.trim(),
        });
      }
      currentTitle = line.replace('Title:', '').trim();
      currentDescription = '';
      inDescription = false;
      continue;
    }

    // Check for description start
    if (line.startsWith('Description:')) {
      const descPart = line.replace('Description:', '').trim();
      currentDescription = descPart;
      inDescription = true;
      continue;
    }

    // Continue description (multi-line)
    if (inDescription && line.trim() !== '' && !line.startsWith('Title:')) {
      currentDescription += (currentDescription ? '\n' : '') + line;
    } else if (line.trim() === '') {
      // Empty line might end description
      inDescription = false;
    }
  }

  // Don't forget the last challenge
  if (currentSection && currentTitle) {
    result[currentSection].push({
      title: currentTitle,
      description: currentDescription.trim(),
    });
  }

  return result;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'challenges.md');
    const content = await fs.readFile(filePath, 'utf-8');
    const challenges = parseChallenges(content);
    return NextResponse.json(challenges);
  } catch (error) {
    console.error('Error reading challenges:', error);
    return NextResponse.json(
      { error: 'Failed to load challenges' },
      { status: 500 }
    );
  }
}
