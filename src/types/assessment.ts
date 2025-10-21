// Assessment Engine Core Types
export type YLELevel = 'starters' | 'movers' | 'flyers'
export type QuestionType = 'multiple-choice' | 'drag-drop' | 'listening' | 'reading' | 'fill-in-blank'
export type SkillArea = 'listening' | 'reading' | 'vocabulary' | 'grammar'
export type SessionStatus = 'not-started' | 'in-progress' | 'completed' | 'paused'

// Question and Content Types
export interface QuestionContent {
  text: string
  audioUrl?: string
  imageUrl?: string
  options?: string[]
  instructions: string
  alternativeText?: string // For accessibility
}

export interface Question {
  id: string
  type: QuestionType
  level: YLELevel
  skillArea: SkillArea
  difficulty: 1 | 2 | 3 | 4 | 5
  content: QuestionContent
  correctAnswer: Answer
  points: number
  timeLimit?: number
  metadata: QuestionMetadata
}

export interface QuestionMetadata {
  createdBy: string
  createdAt: Date
  lastModified: Date
  version: number
  tags: string[]
}

export type Answer = string | string[] | number

// Assessment and Session Types
export interface Assessment {
  id: string
  title: string
  description: string
  level: YLELevel
  questions: Question[]
  timeLimit: number // in minutes
  passingScore: number
  instructions: string
  createdAt: Date
  updatedAt: Date
}

export interface TestSession {
  id: string
  studentId: string
  assessmentId: string
  startTime: Date
  endTime?: Date
  currentQuestionIndex: number
  answers: StudentAnswer[]
  timeRemaining: number
  status: SessionStatus
  metadata: SessionMetadata
}

export interface SessionMetadata {
  deviceInfo?: string
  browserInfo?: string
  accessibilityFeatures?: string[]
}

export interface StudentAnswer {
  questionId: string
  response: Answer
  timeSpent: number
  timestamp: Date
  isCorrect?: boolean
  attempts: number
}

// Results and Feedback Types
export interface AssessmentResult {
  sessionId: string
  studentId: string
  assessmentId: string
  totalScore: number
  maxScore: number
  percentage: number
  skillBreakdown: SkillScore[]
  feedback: FeedbackMessage[]
  completionTime: number
  completedAt: Date
}

export interface SkillScore {
  skill: SkillArea
  score: number
  maxScore: number
  questionsAnswered: number
  correctAnswers: number
  percentage: number
}

export interface FeedbackMessage {
  type: 'encouragement' | 'improvement' | 'achievement' | 'suggestion'
  message: string
  skillArea?: SkillArea
}

// Progress Tracking Types
export interface StudentProgress {
  studentId: string
  assessmentHistory: AssessmentAttempt[]
  skillProgression: SkillProgression[]
  achievements: Achievement[]
  lastActivity: Date
  overallStats: ProgressStats
}

export interface AssessmentAttempt {
  sessionId: string
  assessmentId: string
  assessmentTitle: string
  level: YLELevel
  completedAt: Date
  score: number
  percentage: number
  timeSpent: number
  skillScores: SkillScore[]
}

export interface SkillProgression {
  skill: SkillArea
  level: YLELevel
  attempts: number
  averageScore: number
  bestScore: number
  trend: 'improving' | 'stable' | 'declining'
  lastAssessment: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  iconUrl: string
  earnedAt: Date
  level: YLELevel
  skillArea?: SkillArea
}

export interface ProgressStats {
  totalAssessments: number
  averageScore: number
  bestScore: number
  timeSpent: number
  streakDays: number
  lastLogin: Date
}

// Question Bank Types
export interface QuestionBank {
  questions: Question[]
  metadata: QuestionBankMetadata
}

export interface QuestionBankMetadata {
  version: string
  lastUpdated: Date
  totalQuestions: number
  questionsByLevel: Record<YLELevel, number>
  questionsBySkill: Record<SkillArea, number>
}