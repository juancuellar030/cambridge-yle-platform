import React from 'react'
import { Question } from '../../types/assessment'

interface MultipleChoiceQuestionProps {
  question: Question
  currentAnswer?: string | string[]
  onAnswerChange: (answer: string) => void
  isReadOnly?: boolean
  showCorrectAnswer?: boolean
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  showCorrectAnswer = false
}) => {
  const selectedAnswer = Array.isArray(currentAnswer) ? currentAnswer[0] : currentAnswer

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

  if (!question.content.options || question.content.options.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">No options available for this question.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.content.text}
        </h3>
        
        {/* Question Image */}
        {question.content.imageUrl && (
          <div className="mt-4">
            <img 
              src={question.content.imageUrl} 
              alt={question.content.alternativeText || "Question image"}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3" role="radiogroup" aria-labelledby="question-text">
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
              <span className="font-medium">Correct! Well done.</span>
            </div>
          ) : (
            <div className="text-red-700">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Incorrect.</span>
              </div>
              <p className="text-sm">
                You selected: <strong>{selectedAnswer}</strong><br />
                Correct answer: <strong>{question.correctAnswer}</strong>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MultipleChoiceQuestion