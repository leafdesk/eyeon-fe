'use client'

import { useState, useRef } from 'react'
import FloatingMicButton from '@/components/FloatingMicButton'

export default function STTTestPage() {
  const [text, setText] = useState('')
  const [text2, setText2] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [currentField, setCurrentField] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const input2Ref = useRef<HTMLInputElement>(null)

  const inputFields = [
    {
      ref: inputRef,
      setValue: setText,
      label: '이름',
    },
    {
      ref: input2Ref,
      setValue: setText2,
      label: '생년월일',
    },
  ]

  const handleStatusChange = (listening: boolean, fieldIndex: number) => {
    setIsListening(listening)
    setCurrentField(inputFields[fieldIndex]?.label || '')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto pt-20">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          STT 테스트
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* 첫 번째 입력 필드 */}
          <div>
            <label
              htmlFor="text-input-1"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              첫 번째 입력 필드
            </label>
            <input
              ref={inputRef}
              id="text-input-1"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="마이크 버튼을 눌러 음성을 입력하세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 두 번째 입력 필드 */}
          <div>
            <label
              htmlFor="text-input-2"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              두 번째 입력 필드
            </label>
            <input
              ref={input2Ref}
              id="text-input-2"
              type="text"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="마이크 버튼을 눌러 음성을 입력하세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 상태 표시 */}
          <div className="mt-4 text-sm text-gray-600">
            <p>
              상태: {isListening ? `음성 인식 중 (${currentField})` : '대기 중'}
            </p>
          </div>

          {/* 텍스트 지우기 버튼들 */}
          <div className="flex gap-2">
            <button
              onClick={() => setText('')}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              첫 번째 지우기
            </button>
            <button
              onClick={() => setText2('')}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              두 번째 지우기
            </button>
          </div>
        </div>
      </div>

      {/* 플로팅 마이크 버튼 */}
      <FloatingMicButton
        inputFields={inputFields}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
