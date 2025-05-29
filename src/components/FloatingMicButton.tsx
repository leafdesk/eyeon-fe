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
  onFieldChange?: (newFieldIndex: number) => void
  currentFieldIndex?: number
  className?: string
}

export default function FloatingMicButton({
  inputFields,
  lang = 'ko-KR',
  onStatusChange,
  onFieldChange,
  currentFieldIndex: externalCurrentFieldIndex = 0,
  className = '',
}: FloatingMicButtonProps) {
  // 입력 필드가 없는 경우 조기 return
  if (inputFields.length === 0) {
    return null
  }

  const [isListening, setIsListening] = useState(false)
  const [currentFieldIndex, setCurrentFieldIndex] = useState(
    externalCurrentFieldIndex,
  )
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // 외부에서 전달받은 currentFieldIndex와 동기화
  useEffect(() => {
    setCurrentFieldIndex(externalCurrentFieldIndex)
  }, [externalCurrentFieldIndex])

  useEffect(() => {
    // 브라우저 지원 확인
    if (
      typeof window !== 'undefined' &&
      (window.webkitSpeechRecognition || window.SpeechRecognition)
    ) {
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
              console.log(`🎤 [FloatingMicButton] STT 입력 감지:`)
              console.log(`   - 현재 인덱스: ${currentFieldIndex}`)
              console.log(`   - 현재 필드 라벨: ${currentField.label}`)
              console.log(`   - 인식된 텍스트: "${finalTranscript}"`)
              console.log(`   - 입력 필드들 총 개수: ${inputFields.length}`)

              currentField.setValue((prev) => {
                const newValue = prev + finalTranscript
                console.log(
                  `📝 [FloatingMicButton] setValue 실행: "${prev}" → "${newValue}"`,
                )
                return newValue
              })
            }
          }

          recognitionRef.current.onerror = (
            event: SpeechRecognitionErrorEvent,
          ) => {
            // no-speech는 정상적인 동작이므로 에러로 처리하지 않음
            if (event.error === 'no-speech') {
              console.log(
                '🔇 [FloatingMicButton] 음성이 감지되지 않아 자동 종료됨 (정상)',
              )
            } else {
              console.error(
                '❌ [FloatingMicButton] 음성 인식 오류:',
                event.error,
              )
            }
            setIsListening(false)
            onStatusChange?.(false, currentFieldIndex)
          }

          recognitionRef.current.onend = () => {
            setIsListening(false)
            onStatusChange?.(false, currentFieldIndex)
          }
        }
      }
    } else {
      console.log(
        'FloatingMicButton: 브라우저가 음성 인식을 지원하지 않습니다. UI는 렌더링되지만 음성 기능은 비활성화됩니다.',
      )
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
      console.log(
        `\n\n\n🔄 [FloatingMicButton] 다음 필드로 이동: ${currentFieldIndex} → ${nextIndex}`,
      )
      setCurrentFieldIndex(nextIndex)
      onFieldChange?.(nextIndex)
      setTimeout(() => {
        const nextField = inputFields[nextIndex]
        if (nextField?.ref.current) {
          nextField.ref.current.focus()
          const element = nextField.ref.current
          const length = element.value.length
          element.setSelectionRange(length, length)
          console.log(
            `✅ [FloatingMicButton] 다음 필드 포커스 완료: index ${nextIndex}, label: ${nextField.label}`,
          )
        }
      }, 100)
    }
  }

  const moveToPrevField = () => {
    if (currentFieldIndex > 0) {
      const prevIndex = currentFieldIndex - 1
      console.log(
        `🔄 [FloatingMicButton] 이전 필드로 이동: ${currentFieldIndex} → ${prevIndex}`,
      )
      setCurrentFieldIndex(prevIndex)
      onFieldChange?.(prevIndex)
      setTimeout(() => {
        const prevField = inputFields[prevIndex]
        if (prevField?.ref.current) {
          prevField.ref.current.focus()
          const element = prevField.ref.current
          const length = element.value.length
          element.setSelectionRange(length, length)
          console.log(
            `✅ [FloatingMicButton] 이전 필드 포커스 완료: index ${prevIndex}, label: ${prevField.label}`,
          )
        }
      }, 100)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.log(
        'FloatingMicButton: 음성 인식이 초기화되지 않았습니다. 브라우저 지원을 확인해주세요.',
      )
      return
    }

    if (isListening) {
      console.log(
        `🔴 [FloatingMicButton] 음성 인식 중지 (현재 필드: ${currentFieldIndex})`,
      )
      recognitionRef.current.stop()
      setIsListening(false)
      onStatusChange?.(false, currentFieldIndex)
    } else {
      console.log(
        `🟢 [FloatingMicButton] 음성 인식 시작 (현재 필드: ${currentFieldIndex})`,
      )
      recognitionRef.current.start()
      setIsListening(true)
      focusCurrentField()
      onStatusChange?.(true, currentFieldIndex)
    }
  }

  return (
    <div
      className={`fixed bottom-6 right-6 flex flex-col items-end gap-2 ${className}`}
    >
      {/* 필드 네비게이션 버튼들 (음성 인식 중일 때만 표시) */}
      {isListening && inputFields.length > 1 && (
        <div className="flex flex-col gap-2 bg-[#0e1525] rounded-lg shadow-lg p-3 border border-[#FFD700]/20">
          <button
            onClick={moveToPrevField}
            disabled={currentFieldIndex === 0}
            className="w-12 h-12 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center border border-[#FFD700]/30"
            aria-label="이전 필드로 이동"
          >
            <ChevronUp className="w-8 h-8 text-[#FFD700]" />
          </button>

          {/* 현재 필드 표시 (숫자로 표시) */}
          <div className="flex items-center justify-center py-2">
            <div className="text-sm font-medium text-[#FFD700]">
              {currentFieldIndex + 1}/{inputFields.length}
            </div>
          </div>

          <button
            onClick={moveToNextField}
            disabled={currentFieldIndex === inputFields.length - 1}
            className="w-12 h-12 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center border border-[#FFD700]/30"
            aria-label="다음 필드로 이동"
          >
            <ChevronDown className="w-8 h-8 text-[#FFD700]" />
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
