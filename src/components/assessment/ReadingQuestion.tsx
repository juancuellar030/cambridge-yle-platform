import React from 'react'
import { Question } from '../../types/assessment'

interface ReadingQuestionProps {
  question: Question
  currentAnswer?: string | string[]
  onAnswerChange: (answer: string) => void
  isReadOnly?: boolean
  showCorrectAnswer?: boolean
}

const ReadingQuestion: React.FC<ReadingQuestionProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  showCorrectAnswer = false
}) => {
  const selectedAnswer = Array.isArray(currentAnswer) ? currentAnswer[0] : currentAnswer
  const [fontSize, setFontSize] = React.useState<'small' | 'medium' | 'large'>('medium')

  const handleOptionClick = (option: string) => {
    if (isReadOnly) return
    onAnswerChange(option)
  }

  const getOptionStyle = (option: string): string => {
    let baseStyle = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    
    if (isReadOnly || showCorrectAnswer) {
      // Review mode styling
      if (option === question.correctAnswer) {
        baseStyle += " bg-green-100 border-green-500 text-green-800"
      } else if (option === selectedAnswer && option !== question.correctAnswer) {
        baseStyle += " bg-red-100 border-red-500 text-red-800"
      } else {
        baseStyle += " bg-gray-50 border-gray-300 text-gray-600"
      }
    } else {
      // Interactive mode styling
      if (option === selectedAnswer) {
        baseStyle += " bg-blue-100 border-blue-500 text-blue-800 shadow-md"
      } else {
        baseStyle += " bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
      }
    }
    
    return baseStyle
  }

  const getOptionIcon = (option: string): JSX.Element => {
    const isSelected = option === selectedAnswer
    const isCorrect = option === question.correctAnswer
    const isIncorrect = showCorrectAnswer && option === selectedAnswer && option !== question.correctAnswer

    if (showCorrectAnswer) {
      if (isCorrect) {
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      } else if (isIncorrect) {
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )
      }
    }

    // Regular radio button
    return (
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        isSelected 
          ? 'border-blue-500 bg-blue-500' 
          : 'border-gray-400 bg-white'
      }`}>
        {isSelected && (
          <div className="w-2 h-2 rounded-full bg-white"></div>
        )}
      </div>
    )
  }

  const getFontSizeClass = (): string => {
    switch (fontSize) {
      case 'small':
        return 'text-sm'
      case 'large':
        return 'text-lg'
      default:
        return 'text-base'
    }
  }

  const getReadingPassage = (): string => {
    // For reading questions, the main text is usually the passage to read
    return question.content.text
  }

  const getQuestionText = (): string => {
    // The instructions usually contain the actual question
    return question.content.instructions || "Answer the question based on the reading passage."
  }

  if (!question.content.options || question.content.options.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">No answer options available for this reading question.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reading Controls */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Reading Passage</span>
        </div>
        
        {/* Font Size Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">Text size:</span>
          <div className="flex space-x-1">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  fontSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                aria-label={`Set text size to ${size}`}
              >
                {size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reading Passage */}
      <div className={`p-6 bg-white border border-gray-200 rounded-lg shadow-sm ${getFontSizeClass()}`}>
        <div className="prose prose-gray max-w-none">
          {getReadingPassage().split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed text-gray-800">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Reading Image */}
        {question.content.imageUrl && (
          <div className="mt-6">
            <img 
              src={question.content.imageUrl} 
              alt={question.content.alternativeText || "Reading passage illustration"}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Reading Comprehension Instructions */}
      <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-800 font-medium">
              📖 {getQuestionText()}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Read the passage carefully and choose the best answer based on what you read.
            </p>
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-3" role="radiogroup" aria-labelledby="reading-question">
        {question.content.options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={getOptionStyle(option)}
            onClick={() => handleOptionClick(option)}
            disabled={isReadOnly}
            role="radio"
            aria-checked={option === selectedAnswer}
            aria-describedby={showCorrectAnswer ? `option-${index}-feedback` : undefined}
          >
            <div className="flex items-center space-x-3">
              {getOptionIcon(option)}
              <span className="flex-1 text-left font-medium">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Reading Tips */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 flex items-center space-x-2">
            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>💡 Reading Tips</span>
          </summary>
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            <p>• Read the question first to know what to look for</p>
            <p>• Look for key words in both the passage and answer choices</p>
            <p>• Eliminate obviously wrong answers first</p>
            <p>• Re-read relevant parts of the passage if needed</p>
            <p>• Choose the answer that best matches the passage content</p>
          </div>
        </details>
      </div>

      {/* Feedback for screen readers */}
      {showCorrectAnswer && (
        <div className="sr-only">
          <div id="correct-answer-feedback">
            The correct answer is: {question.correctAnswer}
          </div>
          {selectedAnswer && selectedAnswer !== question.correctAnswer && (
            <div id="selected-answer-feedback">
              You selected: {selectedAnswer}
            </div>
          )}
        </div>
      )}

      {/* Visual feedback summary */}
      {showCorrectAnswer && selectedAnswer && (
        <div className="mt-4 p-3 rounded-md border">
          {selectedAnswer === question.correctAnswer ? (
            <div className="flex items-center space-x-2 text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Great reading comprehension! That's correct.</span>
            </div>
          ) : (
            <div className="text-red-700">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Not quite right. Try reading more carefully!</span>
              </div>
              <p className="text-sm">
                You selected: <strong>{selectedAnswer}</strong><br />
                Correct answer: <strong>{question.correctAnswer}</strong>
              </p>
              <p className="text-xs mt-2 text-red-600">
                💡 Tip: Look for specific details in the passage that support the correct answer.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Accessibility Information */}
      <div className="sr-only" aria-live="polite">
        Reading comprehension question. Read the passage above carefully, then select the best answer from the options provided.
      </div>
    </div>
  )
}

export default ReadingQuestion