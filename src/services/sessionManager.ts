import { TestSession, SessionStatus, StudentAnswer, Assessment } from '../types/assessment'

// Local storage keys
const SESSION_STORAGE_KEY = 'yle_test_session'
const SESSIONS_HISTORY_KEY = 'yle_sessions_history'

export class SessionManager {
  private currentSession: TestSession | null = null

  /**
   * Create a new test session
   */
  createSession(studentId: string, assessment: Assessment): TestSession {
    const session: TestSession = {
      id: this.generateSessionId(),
      studentId,
      assessmentId: assessment.id,
      startTime: new Date(),
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: assessment.timeLimit * 60, // Convert minutes to seconds
      status: 'not-started',
      metadata: {
        deviceInfo: this.getDeviceInfo(),
        browserInfo: this.getBrowserInfo(),
        accessibilityFeatures: this.getAccessibilityFeatures()
      }
    }

    this.currentSession = session
    this.saveSessionToStorage()
    return session
  }

  /**
   * Start the test session
   */
  startSession(): boolean {
    if (!this.currentSession) {
      console.error('No active session to start')
      return false
    }

    this.currentSession.status = 'in-progress'
    this.currentSession.startTime = new Date()
    this.saveSessionToStorage()
    return true
  }

  /**
   * Get the current active session
   */
  getCurrentSession(): TestSession | null {
    if (!this.currentSession) {
      this.loadSessionFromStorage()
    }
    return this.currentSession
  }

  /**
   * Save an answer for the current question
   */
  saveAnswer(questionId: string, response: string | string[] | number, timeSpent: number): boolean {
    if (!this.currentSession) {
      console.error('No active session to save answer to')
      return false
    }

    // Check if answer already exists for this question
    const existingAnswerIndex = this.currentSession.answers.findIndex(
      answer => answer.questionId === questionId
    )

    const studentAnswer: StudentAnswer = {
      questionId,
      response,
      timeSpent,
      timestamp: new Date(),
      attempts: existingAnswerIndex >= 0 ? this.currentSession.answers[existingAnswerIndex].attempts + 1 : 1
    }

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      this.currentSession.answers[existingAnswerIndex] = studentAnswer
    } else {
      // Add new answer
      this.currentSession.answers.push(studentAnswer)
    }

    this.saveSessionToStorage()
    return true
  }

  /**
   * Navigate to next question
   */
  nextQuestion(): boolean {
    if (!this.currentSession) {
      return false
    }

    this.currentSession.currentQuestionIndex++
    this.saveSessionToStorage()
    return true
  }

  /**
   * Navigate to previous question
   */
  previousQuestion(): boolean {
    if (!this.currentSession) {
      return false
    }

    if (this.currentSession.currentQuestionIndex > 0) {
      this.currentSession.currentQuestionIndex--
      this.saveSessionToStorage()
      return true
    }
    return false
  }

  /**
   * Go to specific question by index
   */
  goToQuestion(index: number): boolean {
    if (!this.currentSession) {
      return false
    }

    if (index >= 0) {
      this.currentSession.currentQuestionIndex = index
      this.saveSessionToStorage()
      return true
    }
    return false
  }

  /**
   * Pause the current session
   */
  pauseSession(): boolean {
    if (!this.currentSession) {
      return false
    }

    this.currentSession.status = 'paused'
    this.saveSessionToStorage()
    return true
  }

  /**
   * Resume a paused session
   */
  resumeSession(): boolean {
    if (!this.currentSession) {
      return false
    }

    if (this.currentSession.status === 'paused') {
      this.currentSession.status = 'in-progress'
      this.saveSessionToStorage()
      return true
    }
    return false
  }

  /**
   * Complete the current session
   */
  completeSession(): boolean {
    if (!this.currentSession) {
      return false
    }

    this.currentSession.status = 'completed'
    this.currentSession.endTime = new Date()
    this.saveSessionToStorage()
    
    // Move to session history
    this.saveToHistory(this.currentSession)
    
    return true
  }

  /**
   * Update remaining time
   */
  updateTimeRemaining(seconds: number): void {
    if (this.currentSession) {
      this.currentSession.timeRemaining = Math.max(0, seconds)
      this.saveSessionToStorage()
    }
  }

  /**
   * Get answer for specific question
   */
  getAnswerForQuestion(questionId: string): StudentAnswer | undefined {
    if (!this.currentSession) {
      return undefined
    }

    return this.currentSession.answers.find(answer => answer.questionId === questionId)
  }

  /**
   * Check if session has expired
   */
  isSessionExpired(): boolean {
    if (!this.currentSession) {
      return true
    }

    return this.currentSession.timeRemaining <= 0
  }

  /**
   * Clear current session
   */
  clearSession(): void {
    this.currentSession = null
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }

  /**
   * Get session progress percentage
   */
  getProgressPercentage(totalQuestions: number): number {
    if (!this.currentSession) {
      return 0
    }

    return Math.round((this.currentSession.answers.length / totalQuestions) * 100)
  }

  // Private helper methods

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private saveSessionToStorage(): void {
    if (this.currentSession) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.currentSession))
    }
  }

  private loadSessionFromStorage(): void {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY)
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        // Convert date strings back to Date objects
        session.startTime = new Date(session.startTime)
        if (session.endTime) {
          session.endTime = new Date(session.endTime)
        }
        session.answers = session.answers.map((answer: any) => ({
          ...answer,
          timestamp: new Date(answer.timestamp)
        }))
        
        this.currentSession = session
      } catch (error) {
        console.error('Error loading session from storage:', error)
        this.clearSession()
      }
    }
  }

  private saveToHistory(session: TestSession): void {
    const historyData = localStorage.getItem(SESSIONS_HISTORY_KEY)
    let history: TestSession[] = []
    
    if (historyData) {
      try {
        history = JSON.parse(historyData)
      } catch (error) {
        console.error('Error loading session history:', error)
      }
    }
    
    history.push(session)
    
    // Keep only last 50 sessions to prevent storage bloat
    if (history.length > 50) {
      history = history.slice(-50)
    }
    
    localStorage.setItem(SESSIONS_HISTORY_KEY, JSON.stringify(history))
  }

  private getDeviceInfo(): string {
    const userAgent = navigator.userAgent
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'mobile'
    } else if (/Tablet/.test(userAgent)) {
      return 'tablet'
    }
    return 'desktop'
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  private getAccessibilityFeatures(): string[] {
    const features: string[] = []
    
    // Check for high contrast mode
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      features.push('high-contrast')
    }
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      features.push('reduced-motion')
    }
    
    // Check for screen reader (basic detection)
    if (navigator.userAgent.includes('NVDA') || navigator.userAgent.includes('JAWS')) {
      features.push('screen-reader')
    }
    
    return features
  }
}

// Export singleton instance
export const sessionManager = new SessionManager()