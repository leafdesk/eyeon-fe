'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import WritingDocumentOverlay from '@/components/WritingDocumentOverlay'
import { FieldAnalyzeData, DocumentWriteResponseData } from '@/lib/api-types'
import api from '@/lib/api'
import { UI_CONFIG } from '@/lib/constants'

// 필드 고유 키 생성 함수
const getFieldKey = (field: FieldAnalyzeData): string => {
  return `${field.field}-${field.index}`
}

export default function NewWritePage() {
  const router = useRouter()
  const [isWriting, setIsWriting] = useState(false)
  const [step, setStep] = useState<'basic' | 'additional'>('basic')
  const [analyzedFields, setAnalyzedFields] = useState<FieldAnalyzeData[]>([])
  const [formId, setFormId] = useState<number | null>(null)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  // 로컬 스토리지에서 분석된 필드 데이터와 formId 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFields = localStorage.getItem('analyzedFields')
      const storedFormId = localStorage.getItem('formId')

      if (storedFields) {
        const fields = JSON.parse(storedFields) as FieldAnalyzeData[]
        setAnalyzedFields(fields)

        // 초기 필드 값 설정 - field와 index로 구성된 고유 키 사용
        const initialValues: Record<string, string> = {}
        fields.forEach((field) => {
          const fieldKey = getFieldKey(field)
          initialValues[fieldKey] = field.value || ''
        })
        setFieldValues(initialValues)
      }

      if (storedFormId) {
        setFormId(parseInt(storedFormId))
      }
    }
  }, [])

  // 필드 값 변경 핸들러 - field와 index로 구성된 고유 키 사용
  const handleFieldChange = (fieldKey: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }))
  }

  const handleBasicNext = () => {
    // 기본 정보 단계에서 다음 버튼을 누르면 추가 입력 단계로 이동
    setStep('additional')

    // 이 단계에서 formId가 없으면 오류 메시지 표시
    if (!formId) {
      setError('비정상적인 접근입니다. 다시 시도해주세요.')
    }
  }

  const handleAdditionalNext = async () => {
    if (!formId) {
      setError('비정상적인 접근입니다. 다시 시도해주세요.')
      return
    }

    setIsWriting(true)

    // 사용자 입력값으로 필드 데이터 업데이트
    const updatedFields = analyzedFields.map((field) => {
      const fieldKey = getFieldKey(field)
      return {
        ...field,
        value: fieldValues[fieldKey] || field.value || '',
      }
    })

    // 문서 작성 API 요청 준비 (DocumentWriteRequest 타입에 맞게 구성)
    const documentData = {
      data: updatedFields,
    }

    try {
      // API 요청 실행
      const response = await api.document.writeDocument(formId, documentData)
      console.log('문서 작성 성공:', response.data)

      // 응답 데이터를 로컬 스토리지에 저장
      localStorage.setItem('documentData', JSON.stringify(response.data))

      // 기존 필드 데이터 정리
      localStorage.removeItem('analyzedFields')
      localStorage.removeItem('formId')

      // 완료 페이지로 이동
      router.push('/new/complete')
    } catch (error) {
      console.error('문서 작성 실패:', error)
      alert('문서 작성에 실패했습니다.')
      setIsWriting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col pb-24">
      {/* Header */}
      <Header
        title="문서 작성"
        left="/new" // TODO: router.back (capture | upload | template)
        leftIconType="x"
        right="voice"
      />

      {/* Heading */}
      <h1 className="text-[24px] font-normal px-6 mt-9 mb-7">
        {step === 'basic' ? (
          <>
            아이온에서 기본 정보는
            <br />
            미리 가져왔어요
          </>
        ) : (
          <>추가 입력이 필요해요</>
        )}
      </h1>

      {/* Form Fields */}
      <div className="px-5 space-y-5 overflow-auto">
        {step === 'basic' ? (
          <>
            {/* 기본 정보 필드 */}
            <div>
              <label className="block text-sm mb-2">성명</label>
              <input
                type="text"
                defaultValue="홍길동"
                className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
                readOnly
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm mb-2">휴대폰 번호</label>
              <input
                type="tel"
                defaultValue="010-0000-0000"
                className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
                readOnly
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2">이메일</label>
              <input
                type="email"
                defaultValue="abc1234@naver.com"
                className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
                readOnly
              />
            </div>
          </>
        ) : error ? (
          // 오류 메시지 표시
          <div className="flex flex-col items-center justify-center text-center py-10">
            <p className="text-red-400 mb-6">{error}</p>
          </div>
        ) : (
          <>
            {/* 분석된 필드 표시 */}
            {analyzedFields.length > 0 ? (
              analyzedFields.map((field) => {
                const fieldKey = getFieldKey(field)
                return (
                  <div key={fieldKey}>
                    <label className="block text-sm mb-2">
                      {field.displayName}
                      {UI_CONFIG.SHOW_FIELD_INDEX && ` (#${field.index})`}
                    </label>
                    <input
                      type="text"
                      value={fieldValues[fieldKey] || ''}
                      onChange={(e) =>
                        handleFieldChange(fieldKey, e.target.value)
                      }
                      className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
                    />
                  </div>
                )
              })
            ) : (
              <div className="text-center text-gray-400 py-8">
                분석된 필드가 없습니다
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full bg-[#0e1525]">
        {!error && (
          <Button
            onClick={step === 'basic' ? handleBasicNext : handleAdditionalNext}
            disabled={step === 'additional' && !formId}
          >
            다음
          </Button>
        )}
      </section>

      {/* Writing Overlay */}
      {isWriting && <WritingDocumentOverlay />}
    </main>
  )
}
