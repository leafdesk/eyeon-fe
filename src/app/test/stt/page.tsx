'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'

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

export default function STTTestPage() {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
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
          recognitionRef.current.lang = 'ko-KR'

          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript
              if (event.results[i].isFinal) {
                finalTranscript += transcript
              }
            }

            if (finalTranscript) {
              setText((prev) => prev + finalTranscript)
            }
          }

          recognitionRef.current.onerror = (
            event: SpeechRecognitionErrorEvent,
          ) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)
          }

          recognitionRef.current.onend = () => {
            setIsListening(false)
          }
        }
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto pt-20">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          STT 테스트
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <label
            htmlFor="text-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            음성 인식 결과
          </label>
          <input
            ref={inputRef}
            id="text-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="마이크 버튼을 눌러 음성을 입력하세요..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="mt-4 text-sm text-gray-600">
            {!isSupported && (
              <p className="text-red-500">
                이 브라우저는 음성 인식을 지원하지 않습니다.
              </p>
            )}
            {isSupported && (
              <p>상태: {isListening ? '음성 인식 중...' : '대기 중'}</p>
            )}
          </div>

          <button
            onClick={() => setText('')}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            텍스트 지우기
          </button>
        </div>
      </div>

      {/* 플로팅 마이크 버튼 */}
      {isSupported && (
        <button
          onClick={toggleListening}
          className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>
      )}
    </div>
  )
}
