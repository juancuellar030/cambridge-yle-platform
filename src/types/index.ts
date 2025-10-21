// User types
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'student' | 'teacher' | 'admin'

// Student specific types
export interface Student extends User {
  role: 'student'
  classId?: string
  level: YLELevel
  progress: StudentProgress
}

export interface StudentProgress {
  testsCompleted: number
  averageScore: number
  lastTestDate?: Date
  strengths: string[]
  areasForImprovement: string[]
}

// Teacher specific types
export interface Teacher extends User {
  role: 'teacher'
  classes: string[]
  subjects: string[]
}

// Assessment types
export type YLELevel = 'starters' | 'movers' | 'flyers'

export interface Assessment {
  id: string
  title: string
  level: YLELevel
  description: string
  questions: Question[]
  timeLimit: number // in minutes
  passingScore: number
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  id: string
  type: QuestionType
  content: string
  options?: string[]
  correctAnswer: string | string[]
  points: number
  audioUrl?: string
  imageUrl?: string
}

export type QuestionType = 
  | 'multiple-choice'
  | 'true-false'
  | 'fill-in-blank'
  | 'listening'
  | 'reading-comprehension'

// Test attempt types
export interface TestAttempt {
  id: string
  studentId: string
  assessmentId: string
  answers: Answer[]
  score: number
  startedAt: Date
  completedAt?: Date
  timeSpent: number // in seconds
}

export interface Answer {
  questionId: string
  response: string | string[]
  isCorrect: boolean
  timeSpent: number
}

// Class management types
export interface Class {
  id: string
  name: string
  teacherId: string
  studentIds: string[]
  level: YLELevel
  createdAt: Date
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Authentication types
export interface LoginCredentials {
  email: string
  password: string
  userType: UserRole
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}