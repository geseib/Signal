export interface SectionMeta {
  id: string;
  title: string;
  workshop: '101' | '201' | '301';
  quizCount: number;
  maxXP: number;
}

// XP per section = (quizCount * 10) + 50 (completion bonus)
// Using first-attempt max for quiz XP

export const SECTIONS: SectionMeta[] = [
  // Workshop 101
  {id: '101-S1', title: 'Getting More From Interviews', workshop: '101', quizCount: 3, maxXP: 80},
  {id: '101-S2', title: 'The Bar Raiser Philosophy', workshop: '101', quizCount: 3, maxXP: 80},
  {id: '101-S3', title: 'Behavioral vs. Technical', workshop: '101', quizCount: 3, maxXP: 80},
  {id: '101-S4', title: 'The STAR Framework', workshop: '101', quizCount: 3, maxXP: 80},
  {id: '101-S5', title: 'STAR: Situation', workshop: '101', quizCount: 3, maxXP: 80},
  {id: '101-S6', title: 'STAR: Task', workshop: '101', quizCount: 3, maxXP: 80},
  {id: '101-S7', title: 'STAR: Action', workshop: '101', quizCount: 3, maxXP: 80},
  {id: '101-S8', title: 'STAR: Result', workshop: '101', quizCount: 3, maxXP: 80},
  {id: '101-S9', title: 'STAR Practice Lab', workshop: '101', quizCount: 3, maxXP: 80},
  {id: '101-S10', title: 'Your First Mock Answer', workshop: '101', quizCount: 3, maxXP: 80},
  // Workshop 201 (placeholders)
  {id: '201-S1', title: "Your Organization's Principles", workshop: '201', quizCount: 3, maxXP: 80},
  {id: '201-S2', title: 'Mapping Stories to Principles', workshop: '201', quizCount: 3, maxXP: 80},
  {id: '201-S3', title: 'Probing & Follow-ups', workshop: '201', quizCount: 3, maxXP: 80},
  {id: '201-S4', title: 'Writing Great Questions', workshop: '201', quizCount: 3, maxXP: 80},
  {id: '201-S5', title: 'Active Listening & Note-Taking', workshop: '201', quizCount: 3, maxXP: 80},
  {id: '201-S6', title: 'Avoiding Bias', workshop: '201', quizCount: 3, maxXP: 80},
  {id: '201-S7', title: 'The Debrief', workshop: '201', quizCount: 3, maxXP: 80},
  {id: '201-S8', title: 'Capstone: Practice Debrief', workshop: '201', quizCount: 3, maxXP: 80},
  // Workshop 301 (placeholders)
  {id: '301-S1', title: 'Planning the Interview Loop', workshop: '301', quizCount: 3, maxXP: 80},
  {id: '301-S2', title: 'Frameworks Beyond Amazon', workshop: '301', quizCount: 3, maxXP: 80},
  {id: '301-S3', title: 'Technical Interviews in the GenAI Era', workshop: '301', quizCount: 3, maxXP: 80},
  {id: '301-S4', title: 'Difficult Scenarios', workshop: '301', quizCount: 3, maxXP: 80},
  {id: '301-S5', title: 'Building a Story Bank', workshop: '301', quizCount: 3, maxXP: 80},
  {id: '301-S6', title: 'Capstone: Full Mock Interview', workshop: '301', quizCount: 3, maxXP: 80},
];

export function getSectionsForWorkshop(workshop: '101' | '201' | '301'): SectionMeta[] {
  return SECTIONS.filter((s) => s.workshop === workshop);
}

export function getTotalMaxXP(): number {
  return SECTIONS.reduce((sum, s) => sum + s.maxXP, 0);
}

export function getWorkshopMaxXP(workshop: '101' | '201' | '301'): number {
  return getSectionsForWorkshop(workshop).reduce((sum, s) => sum + s.maxXP, 0);
}
