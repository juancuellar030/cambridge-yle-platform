# Assessment Engine Design Document

## Overview

The Cambridge YLE Assessment Engine is designed as a modular, scalable system that delivers interactive English language assessments. The architecture emphasizes real-time feedback, accessibility, and seamless integration with the broader educational platform.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Student UI    │    │   Teacher UI    │    │   Admin UI      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │    Assessment Engine      │
                    │      (React Frontend)     │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │     API Gateway          │
                    │   (Express.js Backend)   │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
    ┌─────┴─────┐         ┌───────┴───────┐       ┌───────┴───────┐
    │ Question  │         │   Session     │       │   Progress    │
    │   Bank    │         │  Management   │       │   Tracking    │
    │ (MongoDB) │         │  (Redis)      │       │  (MongoDB)    │
    └───────────┘         └───────────────┘       └───────────────┘
```

### Component Architecture

The Assessment Engine consists of four main components:

1. **Question Delivery System** - Renders questions and manages user interactions
2. **Session Manager** - Tracks test progress and maintains state
3. **Scoring Engine** - Calculates results and provides feedback
4. **Progress Analytics** - Stores and analyzes performance data

## Components and Interfaces

### 1. Question Delivery System

**Purpose**: Renders different question types and handles user interactions

**Key Components**:
- `QuestionRenderer` - Displays questions based on type
- `AudioPlayer` - Handles listening exercises with playback controls
- `InteractionHandler` - Manages drag-and-drop, multiple choice, and text input
- `AccessibilityWrapper` - Ensures WCAG 2.1 AA compliance

**Interfaces**:
```typescript
interface Question {
  id: string
  type: 'multiple-choice' | 'drag-drop' | 'listening' | 'reading'
  level: 'starters' | 'movers' | 'flyers'
  content: QuestionContent
  correctAnswer: Answer
  points: number
  timeLimit?: number
}

interface QuestionContent {
  text: string
  audioUrl?: string
  imageUrl?: string
  options?: string[]
  instructions: string
}
```

### 2. Session Manager

**Purpose**: Maintains test state and progress throughout the assessment

**Key Components**:
- `SessionController` - Manages test lifecycle
- `TimerService` - Tracks time spent on questions and overall test
- `StateManager` - Persists progress for resume capability
- `NavigationController` - Handles question progression

**Interfaces**:
```typescript
interface TestSession {
  id: string
  studentId: string
  assessmentId: string
  startTime: Date
  currentQuestionIndex: number
  answers: StudentAnswer[]
  timeRemaining: number
  status: 'in-progress' | 'completed' | 'paused'
}

interface StudentAnswer {
  questionId: string
  response: string | string[]
  timeSpent: number
  timestamp: Date
}
```

### 3. Scoring Engine

**Purpose**: Evaluates responses and provides immediate feedback

**Key Components**:
- `AnswerValidator` - Checks correctness of responses
- `ScoreCalculator` - Computes overall and section scores
- `FeedbackGenerator` - Creates age-appropriate feedback messages
- `PerformanceAnalyzer` - Identifies strengths and improvement areas

**Interfaces**:
```typescript
interface AssessmentResult {
  sessionId: string
  totalScore: number
  maxScore: number
  percentage: number
  skillBreakdown: SkillScore[]
  feedback: FeedbackMessage[]
  completionTime: number
}

interface SkillScore {
  skill: 'listening' | 'reading' | 'vocabulary' | 'grammar'
  score: number
  maxScore: number
  questions: number
}
```

### 4. Progress Analytics

**Purpose**: Tracks long-term student progress and generates insights

**Key Components**:
- `ProgressTracker` - Records assessment attempts and scores
- `TrendAnalyzer` - Identifies improvement patterns
- `ReportGenerator` - Creates visual progress reports
- `RecommendationEngine` - Suggests next steps for learning

## Data Models

### Question Bank Schema
```typescript
interface QuestionDocument {
  _id: ObjectId
  questionId: string
  level: YLELevel
  skillArea: SkillArea
  difficulty: 1 | 2 | 3 | 4 | 5
  content: QuestionContent
  metadata: {
    createdBy: string
    createdAt: Date
    lastModified: Date
    version: number
    tags: string[]
  }
}
```

### Student Progress Schema
```typescript
interface StudentProgress {
  _id: ObjectId
  studentId: string
  assessmentHistory: AssessmentAttempt[]
  skillProgression: SkillProgression[]
  achievements: Achievement[]
  lastActivity: Date
}

interface AssessmentAttempt {
  sessionId: string
  assessmentId: string
  completedAt: Date
  score: number
  timeSpent: number
  skillScores: SkillScore[]
}
```

## Error Handling

### Client-Side Error Handling
- **Network Failures**: Automatic retry with exponential backoff
- **Audio Loading Errors**: Fallback to text-based alternatives
- **Session Timeouts**: Auto-save progress and graceful recovery
- **Invalid Responses**: Real-time validation with helpful error messages

### Server-Side Error Handling
- **Database Failures**: Circuit breaker pattern with fallback responses
- **File Storage Issues**: Multiple CDN endpoints for media files
- **Concurrent Access**: Optimistic locking for session updates
- **Data Validation**: Comprehensive input sanitization and validation

## Testing Strategy

### Unit Testing
- **Question Rendering**: Test all question types render correctly
- **Scoring Logic**: Verify accurate score calculations
- **Session Management**: Test state persistence and recovery
- **Accessibility**: Automated a11y testing with axe-core

### Integration Testing
- **API Endpoints**: Test all assessment-related endpoints
- **Database Operations**: Verify data integrity and performance
- **File Upload/Download**: Test media file handling
- **Real-time Features**: Test session synchronization

### End-to-End Testing
- **Complete Assessment Flow**: Student takes full assessment
- **Teacher Assignment Workflow**: Teacher assigns and reviews results
- **Multi-device Testing**: Ensure consistent experience across devices
- **Performance Testing**: Load testing with concurrent users

### Accessibility Testing
- **Screen Reader Compatibility**: Test with NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Ensure full functionality without mouse
- **Color Contrast**: Verify WCAG AA compliance
- **Text Scaling**: Test up to 200% zoom levels

## Performance Considerations

### Frontend Optimization
- **Lazy Loading**: Load questions on-demand to reduce initial bundle size
- **Image Optimization**: WebP format with fallbacks, responsive images
- **Audio Preloading**: Intelligent preloading of next audio files
- **Caching Strategy**: Service worker for offline capability

### Backend Optimization
- **Database Indexing**: Optimized queries for question retrieval
- **CDN Integration**: Global content delivery for media files
- **Session Caching**: Redis for fast session state access
- **API Rate Limiting**: Prevent abuse while maintaining performance

### Scalability Design
- **Horizontal Scaling**: Stateless API design for easy scaling
- **Database Sharding**: Partition data by school or region
- **Microservices Ready**: Modular design for future service separation
- **Monitoring**: Comprehensive logging and performance metrics