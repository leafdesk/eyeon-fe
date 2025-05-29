'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useAtom } from 'jotai'
import WritingDocumentOverlay from '@/components/WritingDocumentOverlay'
import { FieldAnalyzeData, DocumentWriteResponseData } from '@/lib/api-types'
import { userInfoAtom } from '@/atoms/userAtom'
import api from '@/lib/api'
import { UI_CONFIG } from '@/lib/constants'
import { useVoiceInput } from '@/hooks/useVoiceInput'

// 필드 고유 키 생성 함수
const getFieldKey = (field: FieldAnalyzeData): string => {
  return `${field.field}-${field.index}`
}

// useSearchParams를 사용하는 내부 컴포넌트
function WritePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userInfo] = useAtom(userInfoAtom)
  const [isWriting, setIsWriting] = useState(false)
  const [step, setStep] = useState<'basic' | 'additional'>('basic')
  const [analyzedFields, setAnalyzedFields] = useState<FieldAnalyzeData[]>([])
  const [formId, setFormId] = useState<number | null>(null)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  console.log('userInfo (/new/write)', userInfo)

  // 추가 정보 단계에서만 useVoiceInput 사용
  const {
    fieldValues: voiceFieldValues,
    fieldRefs,
    handleFieldValueChange,
    handleFieldFocus,
    getUpdatedFields,
    FloatingMicButton,
  } = useVoiceInput({
    fields: step === 'additional' ? analyzedFields : [],
    getFieldKey,
    lang: 'ko-KR',
  })

  // URL 매개변수에서 formId를 가져오고 로컬 스토리지에서 분석된 필드 데이터 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // URL 매개변수에서 formId 가져오기
      const formIdParam = searchParams.get('formId')
      if (formIdParam) {
        setFormId(parseInt(formIdParam))
      }

      const storedFields = localStorage.getItem('analyzedFields')

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
    }
  }, [searchParams])

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

    // 추가 정보 단계에서는 음성 입력값 사용, 그 외에는 기존 로직
    const updatedFields =
      step === 'additional' && analyzedFields.length > 0
        ? getUpdatedFields()
        : analyzedFields.map((field) => {
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

      // 응답 데이터를 로컬 스토리지에 저장 (formId도 함께 저장)
      const dataToStore = {
        ...response.data,
        formId: formId, // formId 추가
      }
      localStorage.setItem('documentData', JSON.stringify(dataToStore))

      // 기존 필드 데이터 정리
      localStorage.removeItem('analyzedFields')
      // formId는 complete 페이지에서 사용할 수 있도록 유지

      // 완료 페이지로 이동
      router.push('/new/complete')
    } catch (error) {
      console.error('문서 작성 실패:', error)
      alert('문서 작성에 실패했습니다.')
      setIsWriting(false)
    }
  }

  return (
    <>
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
                defaultValue={userInfo?.username || ''}
                className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
                // readOnly
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm mb-2">휴대폰 번호</label>
              <input
                type="tel"
                defaultValue={userInfo?.phoneNumber || ''}
                className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
                // readOnly
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2">이메일</label>
              <input
                type="email"
                defaultValue={userInfo?.email || ''}
                className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
                // readOnly
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
            {/* 분석된 필드 표시 - 음성 입력 기능 적용 */}
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
                      value={
                        voiceFieldValues[fieldKey] ||
                        fieldValues[fieldKey] ||
                        ''
                      }
                      onChange={(e) => {
                        handleFieldChange(fieldKey, e.target.value)
                        handleFieldValueChange(fieldKey, e.target.value)
                      }}
                      onFocus={() => handleFieldFocus(index)}
                      className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
                      placeholder={`${field.displayName}을(를) 입력하세요`}
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

      {/* Floating Mic Button - 추가 정보 단계에서만 표시 */}
      {step === 'additional' && FloatingMicButton}
    </>
  )
}

// 로딩 상태 컴포넌트
function WritePageLoading() {
  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col pb-24">
      <Header title="문서 작성" left="/new" leftIconType="x" right="voice" />
      <div className="flex items-center justify-center flex-1">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    </main>
  )
}

// 메인 페이지 컴포넌트
export default function NewWritePage() {
  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col pb-24">
      <Suspense fallback={<WritePageLoading />}>
        <WritePageContent />
      </Suspense>
    </main>
  )
}
