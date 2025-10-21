import { Question, QuestionBank, YLELevel, QuestionType, SkillArea } from '../types/assessment'

// Sample questions for each YLE level
const sampleQuestions: Question[] = [
  // Starters Level Questions
  {
    id: 'starters-mc-001',
    type: 'multiple-choice',
    level: 'starters',
    skillArea: 'vocabulary',
    difficulty: 1,
    content: {
      text: 'What color is the sun?',
      instructions: 'Choose the correct answer.',
      options: ['Blue', 'Yellow', 'Green', 'Purple'],
      alternativeText: 'Question about the color of the sun with four color options'
    },
    correctAnswer: 'Yellow',
    points: 1,
    metadata: {
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-01'),
      version: 1,
      tags: ['colors', 'basic-vocabulary', 'nature']
    }
  },
  {
    id: 'starters-listening-001',
    type: 'listening',
    level: 'starters',
    skillArea: 'listening',
    difficulty: 2,
    content: {
      text: 'Listen to the sound and choose the correct animal.',
      instructions: 'Click play to hear the sound, then choose the animal that makes this sound.',
      audioUrl: '/audio/starters/dog-bark.mp3',
      options: ['Cat', 'Dog', 'Bird', 'Fish'],
      alternativeText: 'Audio question with animal sound identification'
    },
    correctAnswer: 'Dog',
    points: 2,
    timeLimit: 30,
    metadata: {
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-01'),
      version: 1,
      tags: ['animals', 'sounds', 'listening-skills']
    }
  },
  {
    id: 'starters-reading-001',
    type: 'reading',
    level: 'starters',
    skillArea: 'reading',
    difficulty: 1,
    content: {
      text: 'My name is Sam. I am six years old. I like to play with my red ball.',
      instructions: 'Read the text and answer: What does Sam like to play with?',
      options: ['Blue ball', 'Red ball', 'Yellow ball', 'Green ball'],
      alternativeText: 'Short reading passage about a child named Sam and their toy preference'
    },
    correctAnswer: 'Red ball',
    points: 2,
    metadata: {
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-01'),
      version: 1,
      tags: ['reading-comprehension', 'basic-text', 'toys']
    }
  },

  // Movers Level Questions
  {
    id: 'movers-mc-001',
    type: 'multiple-choice',
    level: 'movers',
    skillArea: 'grammar',
    difficulty: 3,
    content: {
      text: 'Yesterday, I _____ to the park with my friends.',
      instructions: 'Choose the correct verb form to complete the sentence.',
      options: ['go', 'went', 'going', 'will go'],
      alternativeText: 'Grammar question about past tense verb usage'
    },
    correctAnswer: 'went',
    points: 2,
    metadata: {
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-01'),
      version: 1,
      tags: ['past-tense', 'verbs', 'grammar']
    }
  },
  {
    id: 'movers-listening-001',
    type: 'listening',
    level: 'movers',
    skillArea: 'listening',
    difficulty: 3,
    content: {
      text: 'Listen to the conversation and answer the question.',
      instructions: 'What time does the library close on Saturday?',
      audioUrl: '/audio/movers/library-hours.mp3',
      options: ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
      alternativeText: 'Listening comprehension about library opening hours'
    },
    correctAnswer: '5:00 PM',
    points: 3,
    timeLimit: 45,
    metadata: {
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-01'),
      version: 1,
      tags: ['time', 'public-places', 'conversation']
    }
  },

  // Flyers Level Questions
  {
    id: 'flyers-reading-001',
    type: 'reading',
    level: 'flyers',
    skillArea: 'reading',
    difficulty: 4,
    content: {
      text: 'The ancient pyramids of Egypt were built over 4,000 years ago. These magnificent structures were tombs for pharaohs and took many years to complete. The largest pyramid, the Great Pyramid of Giza, was one of the Seven Wonders of the Ancient World.',
      instructions: 'According to the text, what were the pyramids used for?',
      options: ['Houses for people', 'Tombs for pharaohs', 'Storage for food', 'Schools for children'],
      alternativeText: 'Reading comprehension passage about Egyptian pyramids and their historical purpose'
    },
    correctAnswer: 'Tombs for pharaohs',
    points: 3,
    metadata: {
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-01'),
      version: 1,
      tags: ['history', 'ancient-civilizations', 'reading-comprehension']
    }
  },
  {
    id: 'flyers-grammar-001',
    type: 'multiple-choice',
    level: 'flyers',
    skillArea: 'grammar',
    difficulty: 4,
    content: {
      text: 'If I _____ more time, I would learn to play the piano.',
      instructions: 'Choose the correct form to complete the conditional sentence.',
      options: ['have', 'had', 'will have', 'would have'],
      alternativeText: 'Advanced grammar question about conditional sentences'
    },
    correctAnswer: 'had',
    points: 3,
    metadata: {
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-01'),
      version: 1,
      tags: ['conditionals', 'advanced-grammar', 'hypothetical-situations']
    }
  }
]

// Create the question bank
export const questionBank: QuestionBank = {
  questions: sampleQuestions,
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date('2024-01-01'),
    totalQuestions: sampleQuestions.length,
    questionsByLevel: {
      starters: sampleQuestions.filter(q => q.level === 'starters').length,
      movers: sampleQuestions.filter(q => q.level === 'movers').length,
      flyers: sampleQuestions.filter(q => q.level === 'flyers').length
    },
    questionsBySkill: {
      listening: sampleQuestions.filter(q => q.skillArea === 'listening').length,
      reading: sampleQuestions.filter(q => q.skillArea === 'reading').length,
      vocabulary: sampleQuestions.filter(q => q.skillArea === 'vocabulary').length,
      grammar: sampleQuestions.filter(q => q.skillArea === 'grammar').length
    }
  }
}

// Helper functions for question bank operations
export const getQuestionsByLevel = (level: YLELevel): Question[] => {
  return questionBank.questions.filter(question => question.level === level)
}

export const getQuestionsBySkill = (skill: SkillArea): Question[] => {
  return questionBank.questions.filter(question => question.skillArea === skill)
}

export const getQuestionById = (id: string): Question | undefined => {
  return questionBank.questions.find(question => question.id === id)
}

export const getRandomQuestions = (level: YLELevel, count: number): Question[] => {
  const levelQuestions = getQuestionsByLevel(level)
  const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}