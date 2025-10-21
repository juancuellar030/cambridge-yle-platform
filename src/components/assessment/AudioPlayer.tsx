import React, { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
  audioUrl: string
  title?: string
  allowReplay?: boolean
  maxReplays?: number
  onPlayStart?: () => void
  onPlayEnd?: () => void
  onError?: (error: string) => void
  className?: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title = "Audio",
  allowReplay = true,
  maxReplays = 3,
  onPlayStart,
  onPlayEnd,
  onError,
  className = ""
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playCount, setPlayCount] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => {
      setIsLoading(true)
      setHasError(false)
    }

    const handleLoadedData = () => {
      setIsLoading(false)
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      onPlayStart?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      onPlayEnd?.()
    }

    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
      setIsPlaying(false)
      const errorMsg = 'Failed to load audio file. Please check your internet connection.'
      setErrorMessage(errorMsg)
      onError?.(errorMsg)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      // Cleanup event listeners
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [onPlayStart, onPlayEnd, onError])

  const handlePlayPause = async () => {
    const audio = audioRef.current
    if (!audio || hasError) return

    try {
      if (isPlaying) {
        audio.pause()
      } else {
        // Check replay limit
        if (!allowReplay && playCount > 0) {
          return
        }
        
        if (allowReplay && maxReplays > 0 && playCount >= maxReplays) {
          return
        }

        await audio.play()
        
        // Increment play count only when starting from beginning
        if (currentTime === 0) {
          setPlayCount(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Audio play error:', error)
      setHasError(true)
      setErrorMessage('Unable to play audio. Please try again.')
      onError?.('Unable to play audio. Please try again.')
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
  }

  const handleRestart = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    setCurrentTime(0)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const canPlay = (): boolean => {
    if (hasError) return false
    if (!allowReplay && playCount > 0) return false
    if (allowReplay && maxReplays > 0 && playCount >= maxReplays) return false
    return true
  }

  const getRemainingPlays = (): number => {
    if (!allowReplay) return playCount > 0 ? 0 : 1
    if (maxReplays <= 0) return Infinity
    return Math.max(0, maxReplays - playCount)
  }

  return (
    <div className={`bg-white border border-gray-300 rounded-lg p-4 ${className}`}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        aria-label={title}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.824zM15 8a3 3 0 000 6V8zM16.5 6c0 2.315-.932 4.41-2.443 5.93l-.707-.708C14.747 10.825 15.5 9.463 15.5 8s-.753-2.825-2.15-3.222l.707-.708C15.568 1.59 16.5 3.685 16.5 6z" clipRule="evenodd" />
          </svg>
          <h4 className="font-medium text-gray-900">{title}</h4>
        </div>
        
        {/* Play count indicator */}
        <div className="text-sm text-gray-600">
          {allowReplay ? (
            maxReplays > 0 ? (
              <span>
                Plays: {playCount}/{maxReplays}
              </span>
            ) : (
              <span>Plays: {playCount}</span>
            )
          ) : (
            playCount > 0 ? (
              <span className="text-red-600">Played</span>
            ) : (
              <span>One play only</span>
            )
          )}
        </div>
      </div>

      {/* Error Display */}
      {hasError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center space-x-4 mb-3">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          disabled={!canPlay() || isLoading}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
            canPlay() && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Restart Button */}
        <button
          onClick={handleRestart}
          disabled={!canPlay() || currentTime === 0}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Restart audio"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Time Display */}
        <div className="text-sm text-gray-600 font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          disabled={!duration || hasError}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          aria-label="Audio progress"
        />
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.824zM15 8a3 3 0 000 6V8z" clipRule="evenodd" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          aria-label="Volume control"
        />
        <span className="text-xs text-gray-600 w-8">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Replay Warning */}
      {!allowReplay && playCount === 0 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-700">
            ⚠️ You can only play this audio once. Listen carefully!
          </p>
        </div>
      )}

      {/* Remaining Plays */}
      {allowReplay && maxReplays > 0 && getRemainingPlays() <= 2 && getRemainingPlays() > 0 && (
        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
          <p className="text-xs text-orange-700">
            {getRemainingPlays() === 1 
              ? '⚠️ Last play remaining!'
              : `⚠️ ${getRemainingPlays()} plays remaining`
            }
          </p>
        </div>
      )}

      {/* No More Plays */}
      {((allowReplay && maxReplays > 0 && playCount >= maxReplays) || (!allowReplay && playCount > 0)) && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-700">
            🚫 No more plays available for this audio.
          </p>
        </div>
      )}
    </div>
  )
}

export default AudioPlayer