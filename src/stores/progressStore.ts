import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {ProgressStore, SectionProgress} from '../types/progress';
import {getQuizXP, XP_VALUES} from '../utils/xp';
import {evaluateBadges} from '../data/badges';
import {SECTIONS} from '../data/sections';

function createDefaultSections(): Record<string, SectionProgress> {
  const sections: Record<string, SectionProgress> = {};
  for (const s of SECTIONS) {
    sections[s.id] = {
      status: 'available',
      quizScores: {},
      xpEarned: 0,
    };
  }
  return sections;
}

const DEFAULT_PROGRESS = {
  schemaVersion: 1,
  totalXP: 0,
  badges: [] as string[],
  sections: createDefaultSections(),
  streakDays: 0,
  longestStreak: 0,
  lastVisit: null as string | null,
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PROGRESS,

      recordQuizAnswer: (sectionId, quizId, correct, attempt) => {
        const state = get();
        const section = state.sections[sectionId];
        if (!section) return;

        const existingScore = section.quizScores[quizId];
        // Don't re-award XP if already answered correctly
        if (existingScore?.correct) return;

        let xpGained = 0;
        if (correct) {
          xpGained = getQuizXP(attempt);
        }

        const updatedSection: SectionProgress = {
          ...section,
          status: section.status === 'available' ? 'in-progress' : section.status,
          quizScores: {
            ...section.quizScores,
            [quizId]: {correct, attempts: attempt},
          },
          xpEarned: section.xpEarned + xpGained,
        };

        set({
          sections: {...state.sections, [sectionId]: updatedSection},
          totalXP: state.totalXP + xpGained,
        });
      },

      evaluateSectionCompletion: (sectionId) => {
        const state = get();
        const section = state.sections[sectionId];
        const meta = SECTIONS.find((s) => s.id === sectionId);
        if (!section || !meta) return;
        if (section.status === 'complete') return;

        // Check all quizzes answered correctly
        const quizzesPassed = Object.values(section.quizScores).filter((q) => q.correct).length;
        if (quizzesPassed < meta.quizCount) return;

        // Section complete — award bonus XP
        const bonusXP = XP_VALUES.sectionComplete;
        const updatedSection: SectionProgress = {
          ...section,
          status: 'complete',
          xpEarned: section.xpEarned + bonusXP,
        };

        const updatedSections = {...state.sections, [sectionId]: updatedSection};
        const newTotalXP = state.totalXP + bonusXP;

        // Check for new badges
        const newBadges = evaluateBadges(updatedSections, state.badges);

        set({
          sections: updatedSections,
          totalXP: newTotalXP,
          badges: [...state.badges, ...newBadges],
        });
      },

      recordVisit: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.lastVisit === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = state.streakDays;
        if (state.lastVisit === yesterdayStr) {
          newStreak += 1;
        } else if (state.lastVisit !== today) {
          newStreak = 1;
        }

        set({
          lastVisit: today,
          streakDays: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
        });
      },

      resetProgress: () => {
        set({...DEFAULT_PROGRESS, sections: createDefaultSections()});
      },
    }),
    {
      name: 'signal-progress',
      version: 1,
    },
  ),
);
