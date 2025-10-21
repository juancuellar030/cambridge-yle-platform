import React, { useState, useEffect } from 'react'
import { Question } from '../../types/assessment'

interface FillInBlankQuestionProps {
  question: Question
  currentAnswer?: string | string[]
  onAnswerChange: (answer: string[]) => void
  isReadOnly?: boolean
  showCorrectAnswer?: boolean
}

interface BlankField {
  id: string
  placeholder: string
  value: string
  correctAnswer: string
}

const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  showCorrectAnswer = false
}) => {
  // Parse blanks from question text (marked with [BLANK_1], [BLANK_2], etc.)
  const [blanks, setBlanks] = useState<BlankField[]>([])
  const [questionParts, setQuestionParts] = useState<string[]>([])

  useEffect(() => {
    // Parse question text to find blanks
    const text = question.content.text
    const blankRegex = /\[BLANK_(\d+)(?::([^\]]+))?\]/g
    const foundBlanks: BlankField[] = []
    const parts: string[] = []
    let lastIndex = 0
    let match

    while ((match = blankRegex.exec(text)) !== null) {
      // Add text before the blank
      parts.push(text.substring(lastIndex, match.index))
      
      const blankId = match[1]
      const placeholder = match[2] || `Blank ${blankId}`
      
      foundBlanks.push({
        id: `blank-${blankId}`,
        placeholder,
        value: '',
        correctAnswer: Array.isArray(question.correctAnswer) 
          ? question.correctAnswer[parseInt(blankId) - 1] || ''
          : question.correctAnswer as string
      })
      
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text
    parts.push(text.substring(lastIndex))
    
    // If no blanks found, create a single blank at the end
    if (foundBlanks.length === 0) {
      foundBlanks.push({
        id: 'blank-1',
        placeholder: 'Your answer',
        value: '',
        correctAnswer: Array.isArray(question.correctAnswer) 
          ? question.correctAnswer[0] || ''
          : question.correctAnswer as string
      })
      parts.push(' ') // Add space before the blank
    }
    
    setBlanks(foundBlanks)
    setQuestionParts(parts)
  }, [question])

  // Load current answers
  useEffect(() => {
    if (currentAnswer && Array.isArray(currentAnswer)) {
      setBlanks(prevBlanks => 
        prevBlanks.map((blank, index) => ({
          ...blank,
          value: currentAnswer[index] || ''
        }))
      )
    }
  }, [currentAnswer])

  const handleInputChange = (blankId: string, value: string) => {
    if (isReadOnly) return
    
    setBlanks(prevBlanks => {
      const newBlanks = prevBlanks.map(blank => 
        blank.id === blankId ? { ...blank, value } : blank
      )
      
      // Update answer
      const answers = newBlanks.map(blank => blank.value)
      onAnswerChange(answers)
      
      return newBlanks
    })
  }

  const isBlankCorrect = (blank: BlankField): boolean => {
    if (!showCorrectAnswer) return false
    return blank.value.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim()
  }

  const getInputStyle = (blank: BlankField): string => {
    let baseStyle = "inline-block min-w-[120px] px-3 py-2 border-b-2 bg-transparent focus:outline-none focus:ring-0 text-center font-medium"
    
    if (showCorrectAnswer) {
      if (isBlankCorrect(blank)) {
        baseStyle += " border-green-500 text-green-700 bg-green-50"
      } else if (blank.value.trim()) {
        baseStyle += " border-red-500 text-red-700 bg-red-50"
      } else {
        baseStyle += " border-gray-400 text-gray-600"
      }
    } else {
      if (blank.value.trim()) {
        baseStyle += " border-blue-500 text-blue-700"
      } else {
        baseStyle += " border-gray-400 text-gray-700 focus:border-blue-500"
      }
    }
    
    return baseStyle
  }

  const renderQuestionWithBlanks = () => {
    const elements: JSX.Element[] = []
    
    questionParts.forEach((part, index) => {
      // Add text part
      if (part) {
        elements.push(
          <span key={`text-${index}`} className="text-lg">
            {part}
          </span>
        )
      }
      
      // Add blank input if there's a corresponding blank
      if (index < blanks.length) {
        const blank = blanks[index]
        elements.push(
          <span key={blank.id} className="relative inline-block mx-1">
            <input
              type="text"
              value={blank.value}
              onChange={(e) => handleInputChange(blank.id, e.target.value)}
              placeholder={blank.placeholder}
              className={getInputStyle(blank)}
              disabled={isReadOnly}
              aria-label={`Fill in blank ${index + 1}: ${blank.placeholder}`}
              autoComplete="off"
            />
            
            {showCorrectAnswer && !isBlankCorrect(blank) && blank.value.trim() && (
              <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-red-100 border border-red-300 rounded text-xs text-red-700 whitespace-nowrap z-10">
                Correct: {blank.correctAnswer}
              </div>
            )}
          </span>
        )
      }
    })
    
    return elements
  }

  const getOverallScore = (): { correct: number; total: number } => {
    const correct = blanks.filter(isBlankCorrect).length
    return { correct, total: blanks.length }
  }

  return (
    <div className="space-y-6">
      {/* Question with Blanks */}
      <div className="mb-6">
        <div className="text-lg leading-relaxed">
          {renderQuestionWithBlanks()}
        </div>
        
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

      {/* Word Bank (if options are provided) */}
      {question.content.options && question.content.options.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-3">Word Bank:</h4>
          <div className="flex flex-wrap gap-2">
            {question.content.options.map((option, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => {
                  // Find first empty blank and fill it
                  const emptyBlank = blanks.find(blank => !blank.value.trim())
                  if (emptyBlank && !isReadOnly) {
                    handleInputChange(emptyBlank.id, option)
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Click to use word: ${option}`}
              >
                {option}
              </span>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Click on words to fill in the blanks, or type your own answers.
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>Instructions:</strong> Fill in the blanks by typing your answers or clicking words from the word bank above.
          {blanks.length > 1 && ` Complete all ${blanks.length} blanks.`}
        </p>
      </div>

      {/* Progress Indicator */}
      {blanks.length > 1 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Progress:</span>
          <div className="flex space-x-1">
            {blanks.map((blank, index) => (
              <div
                key={blank.id}
                className={`w-3 h-3 rounded-full ${
                  blank.value.trim() 
                    ? showCorrectAnswer 
                      ? isBlankCorrect(blank) 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                      : 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
                title={`Blank ${index + 1}: ${blank.value || 'Empty'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {blanks.filter(blank => blank.value.trim()).length} of {blanks.length} completed
          </span>
        </div>
      )}

      {/* Answer Feedback */}
      {showCorrectAnswer && (
        <div className="mt-4 space-y-3">
          {/* Overall Score */}
          <div className={`p-3 rounded-md border ${
            getOverallScore().correct === getOverallScore().total
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                Score: {getOverallScore().correct} out of {getOverallScore().total} correct
              </span>
            </div>
          </div>

          {/* Individual Blank Feedback */}
          <div className="space-y-2">
            {blanks.map((blank, index) => (
              <div key={blank.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">
                  <strong>Blank {index + 1}:</strong> 
                  {blank.value ? (
                    <span className={isBlankCorrect(blank) ? 'text-green-600' : 'text-red-600'}>
                      {blank.value}
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">Not answered</span>
                  )}
                </span>
                
                {!isBlankCorrect(blank) && (
                  <span className="text-sm text-gray-600">
                    Correct: <strong>{blank.correctAnswer}</strong>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FillInBlankQuestion