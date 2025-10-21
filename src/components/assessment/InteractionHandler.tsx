import React, { useCallback, useEffect } from 'react'
import { Question, StudentAnswer } from '../../types/assessment'

interface InteractionHandlerProps {
  question: Question
  currentAnswer?: StudentAnswer
  onAnswerChange: (questionId: string, answer: string | string[], timeSpent: number) => void
  onInteractionStart?: (questionId: string) => void
  onInteractionEnd?: (questionId: string) => void
  isReadOnly?: boolean
  children: React.ReactNode
}

interface InteractionState {
  startTime: number
  totalTime: number
  interactionCount: number
  lastInteraction: number
}

const InteractionHandler: React.FC<InteractionHandlerProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  onInteractionStart,
  onInteractionEnd,
  isReadOnly = false,
  children
}) => {
  const [interactionState, setInteractionState] = React.useState<InteractionState>({
    startTime: Date.now(),
    totalTime: currentAnswer?.timeSpent || 0,
    interactionCount: currentAnswer?.attempts || 0,
    lastInteraction: Date.now()
  })

  const [isActive, setIsActive] = React.useState(false)
  const [hasInteracted, setHasInteracted] = React.useState(!!currentAnswer)

  // Update time spent every second when active
  useEffect(() => {
    if (isReadOnly || !isActive) return

    const interval = setInterval(() => {
      setInteractionState(prev => ({
        ...prev,
        totalTime: prev.totalTime + 1
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, isReadOnly])

  // Handle interaction start
  const handleInteractionStart = useCallback(() => {
    if (isReadOnly) return

    setIsActive(true)
    setHasInteracted(true)
    
    setInteractionState(prev => ({
      ...prev,
      lastInteraction: Date.now(),
      interactionCount: prev.interactionCount + 1
    }))

    onInteractionStart?.(question.id)
  }, [question.id, onInteractionStart, isReadOnly])

  // Handle interaction end
  const handleInteractionEnd = useCallback(() => {
    if (isReadOnly) return

    setIsActive(false)
    onInteractionEnd?.(question.id)
  }, [question.id, onInteractionEnd, isReadOnly])

  // Handle answer submission
  const handleAnswerSubmit = useCallback((answer: string | string[]) => {
    if (isReadOnly) return

    const timeSpent = interactionState.totalTime + Math.floor((Date.now() - interactionState.startTime) / 1000)
    
    onAnswerChange(question.id, answer, timeSpent)
    
    setInteractionState(prev => ({
      ...prev,
      totalTime: timeSpent
    }))
  }, [question.id, onAnswerChange, interactionState, isReadOnly])

  // Keyboard event handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isReadOnly) return

    // Handle common keyboard shortcuts
    switch (e.key) {
      case 'Enter':
        if (e.ctrlKey || e.metaKey) {
          // Ctrl+Enter or Cmd+Enter to submit (if applicable)
          handleInteractionEnd()
        }
        break
      
      case 'Escape':
        // Escape to cancel interaction
        handleInteractionEnd()
        break
      
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        // Number keys for multiple choice (if applicable)
        if (question.type === 'multiple-choice' && question.content.options) {
          const optionIndex = parseInt(e.key) - 1
          if (optionIndex >= 0 && optionIndex < question.content.options.length) {
            e.preventDefault()
            handleAnswerSubmit(question.content.options[optionIndex])
          }
        }
        break
    }
  }, [question, handleAnswerSubmit, handleInteractionEnd, isReadOnly])

  // Mouse event handlers
  const handleMouseEnter = useCallback(() => {
    if (!isActive && !isReadOnly) {
      handleInteractionStart()
    }
  }, [isActive, handleInteractionStart, isReadOnly])

  const handleMouseLeave = useCallback(() => {
    // Don't end interaction on mouse leave to avoid interrupting user
    // Only end on explicit actions or timeout
  }, [])

  // Focus event handlers
  const handleFocus = useCallback(() => {
    if (!isActive && !isReadOnly) {
      handleInteractionStart()
    }
  }, [isActive, handleInteractionStart, isReadOnly])

  const handleBlur = useCallback(() => {
    // End interaction when focus leaves the component
    if (isActive) {
      handleInteractionEnd()
    }
  }, [isActive, handleInteractionEnd])

  // Touch event handlers for mobile
  const handleTouchStart = useCallback(() => {
    if (!isActive && !isReadOnly) {
      handleInteractionStart()
    }
  }, [isActive, handleInteractionStart, isReadOnly])

  // Add keyboard event listeners
  useEffect(() => {
    if (isReadOnly) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, isReadOnly])

  // Accessibility announcements
  const getAccessibilityStatus = (): string => {
    if (isReadOnly) return 'Question in review mode'
    if (!hasInteracted) return 'Question ready for interaction'
    if (isActive) return 'Currently answering question'
    return 'Question answered'
  }

  // Interaction analytics
  const getInteractionMetrics = () => {
    return {
      timeSpent: interactionState.totalTime,
      interactionCount: interactionState.interactionCount,
      hasInteracted,
      isActive,
      efficiency: interactionState.interactionCount > 0 ? interactionState.totalTime / interactionState.interactionCount : 0
    }
  }

  // Provide context to child components
  const interactionContext = {
    question,
    currentAnswer,
    onAnswerChange: handleAnswerSubmit,
    onInteractionStart: handleInteractionStart,
    onInteractionEnd: handleInteractionEnd,
    isReadOnly,
    isActive,
    hasInteracted,
    metrics: getInteractionMetrics()
  }

  return (
    <div
      className={`interaction-handler ${isActive ? 'active' : ''} ${hasInteracted ? 'interacted' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      tabIndex={isReadOnly ? -1 : 0}
      role="region"
      aria-label={`Question ${question.id} interaction area`}
      aria-live="polite"
      aria-describedby={`question-${question.id}-status`}
    >
      {/* Accessibility status */}
      <div 
        id={`question-${question.id}-status`} 
        className="sr-only"
        aria-live="polite"
      >
        {getAccessibilityStatus()}
      </div>

      {/* Interaction indicators */}
      {!isReadOnly && (
        <div className="interaction-indicators mb-2">
          {/* Active indicator */}
          {isActive && (
            <div className="flex items-center space-x-2 text-sm text-blue-600 mb-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span>Answering question...</span>
            </div>
          )}

          {/* Time and interaction stats */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Time: {Math.floor(interactionState.totalTime / 60)}:{(interactionState.totalTime % 60).toString().padStart(2, '0')}</span>
            {interactionState.interactionCount > 0 && (
              <span>Attempts: {interactionState.interactionCount}</span>
            )}
          </div>
        </div>
      )}

      {/* Render children with interaction context */}
      <InteractionContext.Provider value={interactionContext}>
        {children}
      </InteractionContext.Provider>

      {/* Keyboard shortcuts help */}
      {!isReadOnly && question.type === 'multiple-choice' && (
        <div className="mt-4 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <details>
            <summary className="cursor-pointer font-medium">⌨️ Keyboard shortcuts</summary>
            <div className="mt-2 space-y-1">
              <div>• Press 1-{question.content.options?.length || 4} to select answers</div>
              <div>• Press Ctrl+Enter to submit (where applicable)</div>
              <div>• Press Escape to cancel interaction</div>
            </div>
          </details>
        </div>
      )}

      {/* Touch instructions for mobile */}
      <div className="sr-only md:hidden">
        Touch and hold to interact with this question. Tap your answer choice to select it.
      </div>
    </div>
  )
}

// Create interaction context for child components
interface InteractionContextType {
  question: Question
  currentAnswer?: StudentAnswer
  onAnswerChange: (answer: string | string[]) => void
  onInteractionStart: () => void
  onInteractionEnd: () => void
  isReadOnly: boolean
  isActive: boolean
  hasInteracted: boolean
  metrics: {
    timeSpent: number
    interactionCount: number
    hasInteracted: boolean
    isActive: boolean
    efficiency: number
  }
}

const InteractionContext = React.createContext<InteractionContextType | null>(null)

// Hook for child components to access interaction context
export const useInteraction = (): InteractionContextType => {
  const context = React.useContext(InteractionContext)
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionHandler')
  }
  return context
}

// Enhanced interaction wrapper for specific question types
interface EnhancedInteractionProps {
  question: Question
  currentAnswer?: StudentAnswer
  onAnswerChange: (questionId: string, answer: string | string[], timeSpent: number) => void
  isReadOnly?: boolean
  children: React.ReactNode
}

export const EnhancedInteractionHandler: React.FC<EnhancedInteractionProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  children
}) => {
  const [interactionLog, setInteractionLog] = React.useState<Array<{
    timestamp: number
    action: string
    data?: any
  }>>([])

  const logInteraction = useCallback((action: string, data?: any) => {
    setInteractionLog(prev => [...prev, {
      timestamp: Date.now(),
      action,
      data
    }])
  }, [])

  const handleInteractionStart = useCallback((questionId: string) => {
    logInteraction('interaction_start', { questionId })
  }, [logInteraction])

  const handleInteractionEnd = useCallback((questionId: string) => {
    logInteraction('interaction_end', { questionId })
  }, [logInteraction])

  const handleAnswerChange = useCallback((questionId: string, answer: string | string[], timeSpent: number) => {
    logInteraction('answer_change', { questionId, answer, timeSpent })
    onAnswerChange(questionId, answer, timeSpent)
  }, [logInteraction, onAnswerChange])

  return (
    <InteractionHandler
      question={question}
      currentAnswer={currentAnswer}
      onAnswerChange={handleAnswerChange}
      onInteractionStart={handleInteractionStart}
      onInteractionEnd={handleInteractionEnd}
      isReadOnly={isReadOnly}
    >
      {children}
      
      {/* Development mode: show interaction log */}
      {process.env.NODE_ENV === 'development' && interactionLog.length > 0 && (
        <details className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <summary className="cursor-pointer font-medium text-yellow-800">
            🔍 Interaction Log ({interactionLog.length} events)
          </summary>
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
            {interactionLog.slice(-10).map((log, index) => (
              <div key={index} className="text-yellow-700">
                <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="ml-2">{log.action}</span>
                {log.data && (
                  <span className="ml-2 text-yellow-600">
                    {JSON.stringify(log.data)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </details>
      )}
    </InteractionHandler>
  )
}

export default InteractionHandler