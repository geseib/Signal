import type {SectionProgress} from '../types/progress';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  criteria: (sections: Record<string, SectionProgress>) => boolean;
}

function isSectionComplete(sections: Record<string, SectionProgress>, id: string): boolean {
  return sections[id]?.status === 'complete';
}

function areAllComplete(sections: Record<string, SectionProgress>, ids: string[]): boolean {
  return ids.every((id) => isSectionComplete(sections, id));
}

export const BADGES: BadgeDefinition[] = [
  // Workshop 101
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first section',
    emoji: '👣',
    criteria: (s) =>
      ['101-S1', '101-S2', '101-S3'].some((id) => isSectionComplete(s, id)),
  },
  {
    id: 'star-student',
    name: 'STAR Student',
    description: 'Complete all four STAR method sections',
    emoji: '⭐',
    criteria: (s) =>
      areAllComplete(s, ['101-S4', '101-S5', '101-S6', '101-S7']),
  },
  {
    id: 'story-builder',
    name: 'Story Builder',
    description: 'Complete the STAR Practice Lab',
    emoji: '🏗️',
    criteria: (s) => isSectionComplete(s, '101-S8'),
  },
  {
    id: 'signal-finder',
    name: 'Signal Finder',
    description: 'Complete Your First Mock Answer',
    emoji: '📡',
    criteria: (s) => isSectionComplete(s, '101-S9'),
  },
  {
    id: 'workshop-101-complete',
    name: 'Foundations Complete',
    description: 'Complete all of Workshop 101',
    emoji: '🎓',
    criteria: (s) =>
      areAllComplete(s, Array.from({length: 9}, (_, i) => `101-S${i + 1}`)),
  },
  // Workshop 201
  {
    id: 'principle-thinker',
    name: 'Principle Thinker',
    description: 'Complete Leadership Principles Overview',
    emoji: '🧭',
    criteria: (s) => isSectionComplete(s, '201-S1'),
  },
  {
    id: 'bias-buster',
    name: 'Bias Buster',
    description: 'Complete Avoiding Bias',
    emoji: '⚖️',
    criteria: (s) => isSectionComplete(s, '201-S6'),
  },
  {
    id: 'workshop-201-complete',
    name: 'Interviewer Ready',
    description: 'Complete all of Workshop 201',
    emoji: '🎯',
    criteria: (s) =>
      areAllComplete(s, Array.from({length: 8}, (_, i) => `201-S${i + 1}`)),
  },
  // Workshop 301
  {
    id: 'loop-master',
    name: 'Loop Master',
    description: 'Complete The Full Interview Loop',
    emoji: '🔄',
    criteria: (s) => isSectionComplete(s, '301-S1'),
  },
  {
    id: 'workshop-301-complete',
    name: 'Advanced Complete',
    description: 'Complete all of Workshop 301',
    emoji: '🏆',
    criteria: (s) =>
      areAllComplete(s, Array.from({length: 6}, (_, i) => `301-S${i + 1}`)),
  },
  // Cross-workshop
  {
    id: 'bar-raiser',
    name: 'Bar Raiser',
    description: 'Complete all three workshops',
    emoji: '📊',
    criteria: (s) =>
      areAllComplete(s, [
        ...Array.from({length: 9}, (_, i) => `101-S${i + 1}`),
        ...Array.from({length: 8}, (_, i) => `201-S${i + 1}`),
        ...Array.from({length: 6}, (_, i) => `301-S${i + 1}`),
      ]),
  },
];

export function evaluateBadges(
  sections: Record<string, SectionProgress>,
  currentBadges: string[],
): string[] {
  return BADGES.filter((b) => !currentBadges.includes(b.id) && b.criteria(sections)).map(
    (b) => b.id,
  );
}
