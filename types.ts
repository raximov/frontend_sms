
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export interface UserProfile {
  id: number;
  username: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  COMPUTATIONAL = 'COMPUTATIONAL',
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  options?: string[]; // For choices
  correctAnswer?: string | string[];
  tolerance?: number; // For computational
}

export interface Test {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  startTime: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  answers: Record<string, any>;
}

export interface TestResult {
  attemptId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  explanations: Record<string, string>;
}
