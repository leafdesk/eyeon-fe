'use client'

import { useState } from 'react'
import { FieldAnalyzeData } from '@/lib/api-types'
import { UI_CONFIG } from '@/lib/constants'
import { useVoiceInput } from '@/hooks/useVoiceInput'

// 필드 고유 키 생성 함수
const getFieldKey = (field: FieldAnalyzeData): string => {
  return `${field.field}-${field.index}`
}

export default function VoiceTestPage() {
  // 예시 데이터 (하드코딩)
  const [analyzedFields] = useState<FieldAnalyzeData[]>([
    {
      field: 'name',
      targetField: 'applicant_name',
      index: 1,
      bbox: [100, 200, 300, 250],
      displayName: '[인적사항] 성명',
      value: '홍길동',
    },
    {
      field: 'phone',
      targetField: 'phone_number',
      index: 2,
      bbox: [100, 260, 300, 310],
      displayName: '[인적사항] 휴대폰 번호',
      value: '010-1234-5678',
    },
    {
      field: 'email',
      targetField: 'email_address',
      index: 3,
      bbox: [100, 320, 300, 370],
      displayName: '[인적사항] 이메일',
      value: 'hongkildong@gmail.com',
    },
    {
      field: 'address',
      targetField: 'home_address',
      index: 4,
      bbox: [100, 380, 300, 430],
      displayName: '[인적사항] 주소',
      value: '서울시 강남구 테헤란로 123',
    },
    {
      field: 'birth_date',
      targetField: 'date_of_birth',
      index: 5,
      bbox: [100, 440, 300, 490],
      displayName: '[인적사항] 생년월일',
      value: '1990-01-01',
    },
    {
      field: 'education_period',
      targetField: 'education_duration',
      index: 6,
      bbox: [100, 500, 300, 550],
      displayName: '[학력사항] 재학기간',
      value: '2008.03 - 2012.02',
    },
    {
      field: 'university',
      targetField: 'university_name',
      index: 7,
      bbox: [100, 560, 300, 610],
      displayName: '[학력사항] 대학교명',
      value: '서울대학교',
    },
    {
      field: 'major',
      targetField: 'major_field',
      index: 8,
      bbox: [100, 620, 300, 670],
      displayName: '[학력사항] 전공',
      value: '컴퓨터공학과',
    },
  ])

  // useVoiceInput 훅 사용
  const {
    fieldValues,
    fieldRefs,
    handleFieldValueChange,
    handleFieldFocus,
    getUpdatedFields,
    FloatingMicButton,
  } = useVoiceInput({
    fields: analyzedFields,
    getFieldKey,
    lang: 'ko-KR',
  })

  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col pb-24">
      {/* Heading */}
      <h2 className="text-[24px] font-normal px-6 mt-9 mb-7">TTS/STT 테스트</h2>

      {/* Form Fields */}
      <div className="px-5 space-y-5 overflow-auto">
        {/* 분석된 필드 표시 */}
        {analyzedFields.length > 0 ? (
          analyzedFields.map((field, index) => {
            const fieldKey = getFieldKey(field)
            return (
              <div key={fieldKey}>
                <label className="block text-sm mb-2">
                  {field.displayName}
                  {UI_CONFIG.SHOW_FIELD_INDEX && ` (#${field.index})`}
                </label>
                <input
                  ref={fieldRefs[fieldKey]}
                  type="text"
                  value={fieldValues[fieldKey] || ''}
                  onChange={(e) =>
                    handleFieldValueChange(fieldKey, e.target.value)
                  }
                  onFocus={() => handleFieldFocus(index)}
                  className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
                  placeholder={`${field.displayName}을(를) 입력하세요`}
                />
                <div className="text-xs text-gray-400 mt-1">
                  필드: {field.field} | 타겟: {field.targetField}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center text-gray-400 py-8">
            분석된 필드가 없습니다
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="px-5 mt-8">
        <h3 className="text-lg font-semibold mb-4">현재 필드 값:</h3>
        <div className="bg-[#252932] p-4 rounded-[6px] text-sm">
          <pre className="text-gray-300 whitespace-pre-wrap">
            {JSON.stringify(fieldValues, null, 2)}
          </pre>
        </div>
      </div>

      {/* API 요청 테스트 버튼 */}
      <div className="px-5 mt-4">
        <button
          onClick={() => {
            const updatedFields = getUpdatedFields()
            console.log('API 요청용 데이터:', { data: updatedFields })
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-[6px]"
        >
          API 요청 데이터 확인 (콘솔 로그)
        </button>
      </div>

      {/* Floating Mic Button */}
      {FloatingMicButton}
    </main>
  )
}
