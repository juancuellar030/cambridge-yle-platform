import React from 'react'
import { Question, StudentAnswer } from '../../types/assessment'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import ListeningQuestion from './ListeningQuestion'
import ReadingQuestion from './ReadingQuestion'
import DragDropQuestion from './DragDropQuestion'
import FillInBlankQuestion from './FillInBlankQuestion'

interface QuestionRendererProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  currentAnswer?: StudentAnswer
  onAnswerChange: (questionId: string, answer: string | string[], timeSpent: number) => void
  onTimeUpdate: (questionId: string, timeSpent: number) => void
  isReadOnly?: boolean
  showCorrectAnswer?: boolean
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswerChange,
  onTimeUpdate,
  isReadOnly = false,
  showCorrectAnswer = false
}) => {
  const [startTime] = React.useState<number>(Date.now())
  const [timeSpent, setTimeSpent] = React.useState<number>(currentAnswer?.timeSpent || 0)

  // Update time spent every second
  React.useEffect(() => {
    if (isReadOnly) return

    const interval = setInterval(() => {
      const newTimeSpent = Math.floor((Date.now() - startTime) / 1000) + (currentAnswer?.timeSpent || 0)
      setTimeSpent(newTimeSpent)
      onTimeUpdate(question.id, newTimeSpent)
    }, 1000)

    return () => clearInterval(interval)
  }, [question.id, startTime, currentAnswer?.timeSpent, onTimeUpdate, isReadOnly])

  const handleAnswerChange = (answer: string | string[]) => {
    if (isReadOnly) return
    onAnswerChange(question.id, answer, timeSpent)
  }

  const renderQuestionByType = () => {
    const commonProps = {
      question,
      currentAnswer: currentAnswer?.response,
      onAnswerChange: handleAnswerChange,
      isReadOnly,
      showCorrectAnswer
    }

    switch (question.type) {
      case 'multiple-choice':
        return <MultipleChoiceQuestion {...commonProps} />
      
      case 'listening':
        return <ListeningQuestion {...commonProps} />
      
      case 'reading':
        return <ReadingQuestion {...commonProps} />
      
      case 'drag-drop':
        return <DragDropQuestion {...commonProps} />
      
      case 'fill-in-blank':
        return <FillInBlankQuestion {...commonProps} />
      
      default:
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">
              Unsupported question type: {question.type}
            </p>
          </div>
        )
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
      case 2:
        return 'bg-green-100 text-green-800'
      case 3:
        return 'bg-yellow-100 text-yellow-800'
      case 4:
      case 5:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Question Header */}
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold text-blue-900">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              Level {question.difficulty}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {question.skillArea}
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Time: {formatTime(timeSpent)}
            </div>
            {question.timeLimit && (
              <div className="text-xs text-gray-500">
                Limit: {formatTime(question.timeLimit)}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-700 uppercase tracking-wide">
            {question.type.replace('-', ' ')}
          </span>
          <span className="text-sm text-gray-600">
            {question.points} {question.points === 1 ? 'point' : 'points'}
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        {/* Instructions */}
        {question.content.instructions && (
          <div className="mb-4 p-3 bg-gray-50 border-l-4 border-blue-400 rounded-r-md">
            <p className="text-sm text-gray-700 font-medium">
              📋 {question.content.instructions}
            </p>
          </div>
        )}

        {/* Question Content */}
        <div className="mb-6">
          {renderQuestionByType()}
        </div>

        {/* Answer Status */}
        {currentAnswer && !isReadOnly && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-green-700 font-medium">
                Answer saved
              </span>
              {currentAnswer.attempts > 1 && (
                <span className="text-xs text-green-600">
                  (Attempt {currentAnswer.attempts})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Correct Answer Display (for review mode) */}
        {showCorrectAnswer && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm font-medium text-blue-800 mb-1">Correct Answer:</p>
            <p className="text-sm text-blue-700">
              {Array.isArray(question.correctAnswer) 
                ? question.correctAnswer.join(', ') 
                : question.correctAnswer}
            </p>
          </div>
        )}
      </div>

      {/* Accessibility Information */}
      {question.content.alternativeText && (
        <div className="sr-only" aria-live="polite">
          {question.content.alternativeText}
        </div>
      )}
    </div>
  )
}

export default QuestionRenderer