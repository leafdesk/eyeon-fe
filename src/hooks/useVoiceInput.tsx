'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { FieldAnalyzeData } from '@/lib/api-types'
import FloatingMicButton from '@/components/FloatingMicButton'

interface UseVoiceInputProps {
  fields: FieldAnalyzeData[]
  getFieldKey: (field: FieldAnalyzeData) => string
  lang?: string
}

export function useVoiceInput({
  fields,
  getFieldKey,
  lang = 'ko-KR',
}: UseVoiceInputProps) {
  // 현재 포커스된 필드 인덱스
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)

  // 필드 값 상태 관리
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {}
    fields.forEach((field) => {
      const fieldKey = getFieldKey(field)
      initialValues[fieldKey] = field.value || ''
    })
    return initialValues
  })

  // TTS 관련 상태
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const initializedRef = useRef<boolean>(false)

  // 각 필드에 대한 ref 생성 (Hook 규칙 준수)
  const fieldRefs = useMemo(() => {
    const refs: Record<string, React.RefObject<any>> = {}
    fields.forEach((field) => {
      const fieldKey = getFieldKey(field)
      refs[fieldKey] = { current: null }
    })
    return refs
  }, [fields, getFieldKey])

  // 특수문자 제거 함수
  const removeSpecialCharacters = useCallback((text: string): string => {
    // 대괄호와 기타 특수문자 제거, 한글, 영문, 숫자, 공백만 유지
    return text
      .replace(/[^\w\s가-힣]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }, [])

  // TTS 초기화
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.speechSynthesis &&
      !initializedRef.current
    ) {
      initializedRef.current = true
      synthRef.current = window.speechSynthesis
      console.log('useVoiceInput: TTS 초기화 완료')
    }
  }, [])

  // TTS 실행 함수
  const speakFieldLabel = useCallback(
    (fieldLabel: string) => {
      if (!synthRef.current) {
        console.log('useVoiceInput: TTS가 초기화되지 않았습니다.')
        return
      }

      // 이미 말하고 있다면 중지하고 약간 대기
      if (synthRef.current.speaking) {
        synthRef.current.cancel()
        // 이전 음성이 완전히 정지될 때까지 짧은 딜레이
        setTimeout(() => {
          startSpeech(fieldLabel)
        }, 50)
        return
      }

      startSpeech(fieldLabel)
    },
    [lang, removeSpecialCharacters],
  )

  // 실제 음성 합성 실행 함수
  const startSpeech = useCallback(
    (fieldLabel: string) => {
      if (!synthRef.current) return

      const cleanText = removeSpecialCharacters(fieldLabel)
      if (!cleanText.trim()) return

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.lang = lang
      utterance.rate = 1.0
      utterance.pitch = 1.0

      utterance.onstart = () => {
        console.log('useVoiceInput: TTS 시작 -', cleanText)
      }

      utterance.onend = () => {
        console.log('useVoiceInput: TTS 완료 -', cleanText)
      }

      utterance.onerror = (event) => {
        // 'interrupted' 오류는 정상적인 중단이므로 무시
        if (event.error === 'interrupted') {
          console.log('useVoiceInput: TTS 중단됨 (정상) -', cleanText)
        } else {
          console.error(
            'useVoiceInput: TTS 오류 -',
            event.error,
            '-',
            cleanText,
          )
        }
      }

      synthRef.current.speak(utterance)
    },
    [lang, removeSpecialCharacters],
  )

  // 필드 값 변경 핸들러
  const handleFieldValueChange = useCallback(
    (fieldKey: string, value: string) => {
      setFieldValues((prev) => ({
        ...prev,
        [fieldKey]: value,
      }))
    },
    [],
  )

  // 필드 포커스 핸들러 (직접 클릭시)
  const handleFieldFocus = useCallback(
    (fieldIndex: number) => {
      // 이미 같은 필드가 선택되어 있으면 중복 처리 방지
      if (fieldIndex === currentFieldIndex) {
        return
      }

      setCurrentFieldIndex(fieldIndex)
      if (fieldIndex < fields.length) {
        const currentField = fields[fieldIndex]
        console.log('현재 선택된 필드 라벨:', currentField.displayName)
        speakFieldLabel(currentField.displayName)
      }
    },
    [fields, speakFieldLabel, currentFieldIndex],
  )

  // 필드 변경 핸들러 (FloatingMicButton에서 호출)
  const handleFieldChange = useCallback(
    (newFieldIndex: number) => {
      // 이미 같은 필드가 선택되어 있으면 중복 처리 방지
      if (newFieldIndex === currentFieldIndex) {
        return
      }

      setCurrentFieldIndex(newFieldIndex)
      if (newFieldIndex < fields.length) {
        const currentField = fields[newFieldIndex]
        console.log('현재 선택된 필드 라벨:', currentField.displayName)
        speakFieldLabel(currentField.displayName)
      }
    },
    [fields, speakFieldLabel, currentFieldIndex],
  )

  // 음성 인식 상태 변경 핸들러
  const handleVoiceStatusChange = useCallback(
    (isListening: boolean, fieldIndex: number) => {
      // 음성 인식 시작시에만 TTS 실행 (중복 방지)
      if (
        isListening &&
        fieldIndex < fields.length &&
        fieldIndex !== currentFieldIndex
      ) {
        const currentField = fields[fieldIndex]
        console.log('현재 선택된 필드 라벨:', currentField.displayName)
        speakFieldLabel(currentField.displayName)
      }
    },
    [fields, speakFieldLabel, currentFieldIndex],
  )

  // FloatingMicButton을 위한 inputFields 배열 생성
  const inputFields = useMemo(() => {
    return fields.map((field, index) => {
      const fieldKey = getFieldKey(field)
      return {
        ref: fieldRefs[fieldKey],
        setValue: (value: string | ((prev: string) => string)) => {
          // 현재 실제 선택된 필드의 키를 동적으로 가져오기
          const actualCurrentIndex = currentFieldIndex
          const actualField = fields[actualCurrentIndex]
          const actualFieldKey = actualField
            ? getFieldKey(actualField)
            : fieldKey

          // 디버깅 로그 추가
          console.log(
            `STT 입력: 요청된 필드 인덱스 ${index} → 실제 입력될 필드 인덱스 ${actualCurrentIndex}`,
          )
          console.log(
            `STT 입력: ${
              actualField?.displayName || 'Unknown'
            } 필드에 입력됩니다.`,
          )

          if (typeof value === 'function') {
            setFieldValues((prev) => ({
              ...prev,
              [actualFieldKey]: value(prev[actualFieldKey] || ''),
            }))
          } else {
            setFieldValues((prev) => ({
              ...prev,
              [actualFieldKey]: value,
            }))
          }
        },
        label: field.displayName,
        fieldIndex: index, // 디버깅용 인덱스 추가
      }
    })
  }, [fields, fieldRefs, getFieldKey, currentFieldIndex]) // currentFieldIndex 의존성 추가

  // API 요청용 헬퍼 함수 - FieldAnalyzeData[] 반환
  const getUpdatedFields = useCallback((): FieldAnalyzeData[] => {
    return fields.map((field) => {
      const fieldKey = getFieldKey(field)
      return {
        ...field,
        value: fieldValues[fieldKey] || field.value || '',
      }
    })
  }, [fields, fieldValues, getFieldKey])

  // FloatingMicButton 컴포넌트 생성
  const FloatingMicButtonComponent = useMemo(
    () => (
      <FloatingMicButton
        inputFields={inputFields}
        lang={lang}
        currentFieldIndex={currentFieldIndex}
        onStatusChange={handleVoiceStatusChange}
        onFieldChange={handleFieldChange}
      />
    ),
    [
      inputFields,
      lang,
      currentFieldIndex,
      handleVoiceStatusChange,
      handleFieldChange,
    ],
  )

  // 정리 함수
  useEffect(() => {
    return () => {
      if (synthRef.current?.speaking) {
        synthRef.current.cancel()
      }
    }
  }, [])

  return {
    // 상태
    fieldValues,
    setFieldValues,
    currentFieldIndex,

    // refs
    fieldRefs,

    // 핸들러
    handleFieldValueChange,
    handleFieldFocus,
    handleFieldChange,
    handleVoiceStatusChange,

    // 헬퍼
    getUpdatedFields,

    // 컴포넌트
    FloatingMicButton: FloatingMicButtonComponent,
  }
}
