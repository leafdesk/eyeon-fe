'use client'

import { useState, useRef, useEffect, RefObject } from 'react'
import { Mic, MicOff, ChevronUp, ChevronDown } from 'lucide-react'

// Web Speech API 타입 정의
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic
    webkitSpeechRecognition?: SpeechRecognitionStatic
  }
}

interface InputField {
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  setValue: (value: string | ((prev: string) => string)) => void
  label?: string
}

interface FloatingMicButtonProps {
  inputFields: InputField[]
  lang?: string
  onStatusChange?: (isListening: boolean, currentFieldIndex: number) => void
  className?: string
}

export default function FloatingMicButton({
  inputFields,
  lang = 'ko-KR',
  onStatusChange,
  className = '',
}: FloatingMicButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // 브라우저 지원 확인
    if (
      typeof window !== 'undefined' &&
      (window.webkitSpeechRecognition || window.SpeechRecognition)
    ) {
      setIsSupported(true)

      // SpeechRecognition 초기화
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()

        if (recognitionRef.current) {
          recognitionRef.current.continuous = true
          recognitionRef.current.interimResults = true
          recognitionRef.current.lang = lang

          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript
              if (event.results[i].isFinal) {
                finalTranscript += transcript
              }
            }

            if (finalTranscript && inputFields[currentFieldIndex]) {
              const currentField = inputFields[currentFieldIndex]
              currentField.setValue((prev) => prev + finalTranscript)
            }
          }

          recognitionRef.current.onerror = (
            event: SpeechRecognitionErrorEvent,
          ) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)
            onStatusChange?.(false, currentFieldIndex)
          }

          recognitionRef.current.onend = () => {
            setIsListening(false)
            onStatusChange?.(false, currentFieldIndex)
          }
        }
      }
    }
  }, [lang, currentFieldIndex, inputFields, onStatusChange])

  const focusCurrentField = () => {
    const currentField = inputFields[currentFieldIndex]
    if (currentField?.ref.current) {
      currentField.ref.current.focus()
      // 커서를 텍스트 끝으로 이동
      const element = currentField.ref.current
      const length = element.value.length
      element.setSelectionRange(length, length)
    }
  }

  const moveToNextField = () => {
    if (currentFieldIndex < inputFields.length - 1) {
      const nextIndex = currentFieldIndex + 1
      setCurrentFieldIndex(nextIndex)
      setTimeout(() => {
        const nextField = inputFields[nextIndex]
        if (nextField?.ref.current) {
          nextField.ref.current.focus()
          const element = nextField.ref.current
          const length = element.value.length
          element.setSelectionRange(length, length)
        }
      }, 100)
    }
  }

  const moveToPrevField = () => {
    if (currentFieldIndex > 0) {
      const prevIndex = currentFieldIndex - 1
      setCurrentFieldIndex(prevIndex)
      setTimeout(() => {
        const prevField = inputFields[prevIndex]
        if (prevField?.ref.current) {
          prevField.ref.current.focus()
          const element = prevField.ref.current
          const length = element.value.length
          element.setSelectionRange(length, length)
        }
      }, 100)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current || inputFields.length === 0) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      onStatusChange?.(false, currentFieldIndex)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      focusCurrentField()
      onStatusChange?.(true, currentFieldIndex)
    }
  }

  // 입력 필드가 없거나 지원하지 않는 브라우저인 경우 렌더링하지 않음
  if (!isSupported || inputFields.length === 0) {
    return null
  }

  return (
    <div
      className={`fixed bottom-6 right-6 flex flex-col items-end gap-2 ${className}`}
    >
      {/* 필드 네비게이션 버튼들 (음성 인식 중일 때만 표시) */}
      {isListening && inputFields.length > 1 && (
        <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg p-3">
          <button
            onClick={moveToPrevField}
            disabled={currentFieldIndex === 0}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
            aria-label="이전 필드로 이동"
          >
            <ChevronUp className="w-8 h-8 text-gray-700" />
          </button>

          {/* 현재 필드 표시 (큰 점 표시) */}
          <div className="flex flex-col items-center gap-1 py-2">
            {inputFields.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentFieldIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                aria-label={`필드 ${index + 1}${
                  index === currentFieldIndex ? ' (현재)' : ''
                }`}
              />
            ))}
          </div>

          <button
            onClick={moveToNextField}
            disabled={currentFieldIndex === inputFields.length - 1}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
            aria-label="다음 필드로 이동"
          >
            <ChevronDown className="w-8 h-8 text-gray-700" />
          </button>
        </div>
      )}

      {/* 메인 마이크 버튼 */}
      <button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-[#FFD700] hover:bg-[#FFD700]/90'
        }`}
        aria-label={isListening ? '음성 인식 중지' : '음성 인식 시작'}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-[#0F1626]" />
        )}
      </button>
    </div>
  )
}
