import { Assessment, YLELevel } from '../types/assessment'
import { getQuestionsByLevel } from './questionBank'

// Sample assessments for each YLE level
export const sampleAssessments: Assessment[] = [
  {
    id: 'starters-practice-001',
    title: 'Starters Practice Test',
    description: 'A beginner-level practice test covering basic vocabulary, simple listening, and reading comprehension.',
    level: 'starters',
    questions: getQuestionsByLevel('starters'),
    timeLimit: 30, // 30 minutes
    passingScore: 70,
    instructions: `Welcome to the Cambridge YLE Starters Practice Test!

This test will help you practice your English skills. You will have 30 minutes to complete all questions.

Instructions:
• Read each question carefully
• Click on your answer choice
• You can go back to change your answers
• Ask your teacher if you need help

Good luck!`,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'movers-practice-001',
    title: 'Movers Practice Test',
    description: 'An intermediate-level practice test with grammar, listening comprehension, and reading skills.',
    level: 'movers',
    questions: getQuestionsByLevel('movers'),
    timeLimit: 45, // 45 minutes
    passingScore: 75,
    instructions: `Welcome to the Cambridge YLE Movers Practice Test!

This test will assess your intermediate English skills. You have 45 minutes to complete all sections.

Instructions:
• Read all instructions carefully before starting
• Listen to audio clips as many times as needed
• Choose the best answer for each question
• Review your answers before submitting

You can do it!`,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'flyers-practice-001',
    title: 'Flyers Practice Test',
    description: 'An advanced-level practice test featuring complex reading passages, advanced grammar, and detailed listening exercises.',
    level: 'flyers',
    questions: getQuestionsByLevel('flyers'),
    timeLimit: 60, // 60 minutes
    passingScore: 80,
    instructions: `Welcome to the Cambridge YLE Flyers Practice Test!

This is an advanced test that will challenge your English language skills. You have 60 minutes to complete all sections.

Instructions:
• Read passages carefully and take your time
• Pay attention to grammar and sentence structure
• Listen to audio materials attentively
• Think critically about your answer choices
• Manage your time wisely across all sections

Best of luck with your test!`,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Helper functions for assessment operations
export const getAssessmentById = (id: string): Assessment | undefined => {
  return sampleAssessments.find(assessment => assessment.id === id)
}

export const getAssessmentsByLevel = (level: YLELevel): Assessment[] => {
  return sampleAssessments.filter(assessment => assessment.level === level)
}

export const getAllAssessments = (): Assessment[] => {
  return sampleAssessments
}

// Create a custom assessment with specific questions
export const createCustomAssessment = (
  title: string,
  description: string,
  level: YLELevel,
  questionIds: string[],
  timeLimit: number,
  passingScore: number = 70
): Assessment => {
  const levelQuestions = getQuestionsByLevel(level)
  const selectedQuestions = levelQuestions.filter(q => questionIds.includes(q.id))
  
  return {
    id: `custom-${Date.now()}`,
    title,
    description,
    level,
    questions: selectedQuestions,
    timeLimit,
    passingScore,
    instructions: `Custom Assessment: ${title}

${description}

You have ${timeLimit} minutes to complete this assessment.
Passing score: ${passingScore}%

Good luck!`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}