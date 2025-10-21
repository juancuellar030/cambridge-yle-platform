import React, { useState, useRef } from 'react'
import { Question } from '../../types/assessment'

interface DragDropQuestionProps {
  question: Question
  currentAnswer?: string | string[]
  onAnswerChange: (answer: string[]) => void
  isReadOnly?: boolean
  showCorrectAnswer?: boolean
}

interface DragItem {
  id: string
  content: string
  originalIndex: number
}

interface DropZone {
  id: string
  label: string
  acceptedItem?: DragItem
}

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  showCorrectAnswer = false
}) => {
  // Parse drag-drop data from question content
  // For this implementation, we'll assume options are draggable items
  // and the question text contains drop zones marked with [DROP_ZONE_1], [DROP_ZONE_2], etc.
  
  const dragItems: DragItem[] = (question.content.options || []).map((option, index) => ({
    id: `item-${index}`,
    content: option,
    originalIndex: index
  }))

  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
  const [dropZones, setDropZones] = useState<DropZone[]>(() => {
    // Initialize drop zones based on question text
    const zones: DropZone[] = []
    const dropZoneRegex = /\[DROP_ZONE_(\d+)\]/g
    let match
    
    while ((match = dropZoneRegex.exec(question.content.text)) !== null) {
      zones.push({
        id: `zone-${match[1]}`,
        label: `Drop Zone ${match[1]}`,
        acceptedItem: undefined
      })
    }
    
    // If no drop zones found in text, create default ones
    if (zones.length === 0) {
      dragItems.forEach((_, index) => {
        zones.push({
          id: `zone-${index}`,
          label: `Position ${index + 1}`,
          acceptedItem: undefined
        })
      })
    }
    
    return zones
  })

  // Load current answer into drop zones
  React.useEffect(() => {
    if (currentAnswer && Array.isArray(currentAnswer)) {
      setDropZones(prevZones => 
        prevZones.map((zone, index) => ({
          ...zone,
          acceptedItem: currentAnswer[index] 
            ? dragItems.find(item => item.content === currentAnswer[index])
            : undefined
        }))
      )
    }
  }, [currentAnswer])

  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    if (isReadOnly) return
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', item.content)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetZoneId: string) => {
    e.preventDefault()
    
    if (!draggedItem || isReadOnly) return

    setDropZones(prevZones => {
      const newZones = prevZones.map(zone => {
        // Remove item from its current zone
        if (zone.acceptedItem?.id === draggedItem.id) {
          return { ...zone, acceptedItem: undefined }
        }
        // Add item to target zone
        if (zone.id === targetZoneId) {
          return { ...zone, acceptedItem: draggedItem }
        }
        return zone
      })
      
      // Update answer
      const answer = newZones.map(zone => zone.acceptedItem?.content || '')
      onAnswerChange(answer)
      
      return newZones
    })
    
    setDraggedItem(null)
  }

  const handleKeyboardDrop = (item: DragItem, targetZoneId: string) => {
    if (isReadOnly) return
    
    setDropZones(prevZones => {
      const newZones = prevZones.map(zone => {
        // Remove item from its current zone
        if (zone.acceptedItem?.id === item.id) {
          return { ...zone, acceptedItem: undefined }
        }
        // Add item to target zone
        if (zone.id === targetZoneId) {
          return { ...zone, acceptedItem: item }
        }
        return zone
      })
      
      // Update answer
      const answer = newZones.map(zone => zone.acceptedItem?.content || '')
      onAnswerChange(answer)
      
      return newZones
    })
  }

  const getAvailableItems = (): DragItem[] => {
    const usedItemIds = dropZones
      .map(zone => zone.acceptedItem?.id)
      .filter(Boolean) as string[]
    
    return dragItems.filter(item => !usedItemIds.includes(item.id))
  }

  const renderQuestionText = () => {
    let text = question.content.text
    
    // Replace drop zone placeholders with actual drop zones
    dropZones.forEach(zone => {
      const placeholder = `[DROP_ZONE_${zone.id.split('-')[1]}]`
      const dropZoneHtml = `<span class="drop-zone-placeholder" data-zone-id="${zone.id}">[${zone.label}]</span>`
      text = text.replace(placeholder, dropZoneHtml)
    })
    
    return text
  }

  const isCorrectAnswer = (): boolean => {
    if (!Array.isArray(question.correctAnswer)) return false
    
    const currentAnswerArray = dropZones.map(zone => zone.acceptedItem?.content || '')
    return JSON.stringify(currentAnswerArray) === JSON.stringify(question.correctAnswer)
  }

  return (
    <div className="space-y-6">
      {/* Question Text with Drop Zones */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {question.content.text.includes('[DROP_ZONE') ? (
            <div dangerouslySetInnerHTML={{ __html: renderQuestionText() }} />
          ) : (
            question.content.text
          )}
        </h3>
        
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

      {/* Drop Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {dropZones.map((zone, index) => (
          <div
            key={zone.id}
            className={`min-h-[80px] p-4 border-2 border-dashed rounded-lg transition-all duration-200 ${
              draggedItem 
                ? 'border-blue-400 bg-blue-50' 
                : zone.acceptedItem 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, zone.id)}
            role="button"
            tabIndex={0}
            aria-label={`Drop zone: ${zone.label}`}
          >
            <div className="text-sm font-medium text-gray-600 mb-2">
              {zone.label}
            </div>
            
            {zone.acceptedItem ? (
              <div 
                className={`p-2 bg-white border rounded shadow-sm cursor-move ${
                  showCorrectAnswer 
                    ? question.correctAnswer[index] === zone.acceptedItem.content
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
                draggable={!isReadOnly}
                onDragStart={(e) => handleDragStart(e, zone.acceptedItem!)}
              >
                {zone.acceptedItem.content}
                
                {showCorrectAnswer && (
                  <div className="mt-1 text-xs">
                    {question.correctAnswer[index] === zone.acceptedItem.content ? (
                      <span className="text-green-600">✓ Correct</span>
                    ) : (
                      <span className="text-red-600">✗ Should be: {question.correctAnswer[index]}</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-sm italic">
                Drop an item here
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Available Items */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Available Items:</h4>
        <div className="flex flex-wrap gap-3">
          {getAvailableItems().map((item) => (
            <div
              key={item.id}
              className="p-3 bg-blue-100 border border-blue-300 rounded-lg cursor-move hover:bg-blue-200 transition-colors duration-200"
              draggable={!isReadOnly}
              onDragStart={(e) => handleDragStart(e, item)}
              role="button"
              tabIndex={0}
              aria-label={`Draggable item: ${item.content}`}
            >
              {item.content}
            </div>
          ))}
        </div>
        
        {getAvailableItems().length === 0 && (
          <p className="text-gray-500 text-sm italic">
            All items have been placed
          </p>
        )}
      </div>

      {/* Keyboard Instructions */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>Instructions:</strong> Drag items from the "Available Items" section to the drop zones above. 
          You can also drag items between drop zones to rearrange them.
        </p>
      </div>

      {/* Answer Feedback */}
      {showCorrectAnswer && (
        <div className={`mt-4 p-3 rounded-md border ${
          isCorrectAnswer() 
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isCorrectAnswer() ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Correct arrangement!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Incorrect arrangement.</span>
              </>
            )}
          </div>
          
          {!isCorrectAnswer() && (
            <div className="text-sm">
              <p className="mb-1">Correct order:</p>
              <ol className="list-decimal list-inside">
                {(question.correctAnswer as string[]).map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DragDropQuestion