
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation?: string;
}

export interface ExamResult {
  score: number;
  totalQuestions: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeTaken: string;
  questionAnalysis: ('correct' | 'wrong' | 'skipped')[];
}

export interface ResourceItem {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export interface Reminder {
  id: string;
  subject: string;
  topic: string;
  timestamp: number; // Unix timestamp
  dateString: string;
}

export enum PageState {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  TEST = 'TEST',
  RESULT = 'RESULT',
  PDF = 'PDF',
  SYLLABUS = 'SYLLABUS',
  AI_NOTES = 'AI_NOTES',
  AI_QUIZ = 'AI_QUIZ',
  UPDATES = 'UPDATES',
  NOTIFICATION = 'NOTIFICATION',
  PROFILE = 'PROFILE',
  SAMPLE_PAPER = 'SAMPLE_PAPER',
  LEADERBOARD = 'LEADERBOARD',
  BOOKMARKS = 'BOOKMARKS',
  QUIZ_HISTORY = 'QUIZ_HISTORY',
  POMODORO = 'POMODORO'
}

export interface QuizHistoryItem {
  id: string;
  type: 'AI_QUIZ' | 'MOCK_TEST';
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  correct: number;
  wrong: number;
  date: number;
  timeTaken: string;
}
