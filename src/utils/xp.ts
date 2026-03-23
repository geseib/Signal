export const XP_VALUES = {
  quizCorrectFirst: 10,
  quizCorrectSecond: 5,
  quizCorrectThird: 2,
  sectionComplete: 50,
} as const;

export function getQuizXP(attempt: number): number {
  if (attempt === 1) return XP_VALUES.quizCorrectFirst;
  if (attempt === 2) return XP_VALUES.quizCorrectSecond;
  return XP_VALUES.quizCorrectThird;
}
