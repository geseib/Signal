export type SectionStatus = 'available' | 'in-progress' | 'complete';

export interface QuizScore {
  correct: boolean;
  attempts: number;
}

export interface SectionProgress {
  status: SectionStatus;
  quizScores: Record<string, QuizScore>;
  xpEarned: number;
}

export interface ProgressData {
  schemaVersion: number;
  totalXP: number;
  badges: string[];
  sections: Record<string, SectionProgress>;
  streakDays: number;
  longestStreak: number;
  lastVisit: string | null;
}

export interface ProgressStore extends ProgressData {
  recordQuizAnswer: (sectionId: string, quizId: string, correct: boolean, attempt: number) => void;
  evaluateSectionCompletion: (sectionId: string) => void;
  recordVisit: () => void;
  resetProgress: () => void;
}
