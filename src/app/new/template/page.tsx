'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReadingDocumentOverlay from '@/components/ReadingDocumentOverlay'
import api from '@/lib/api'
import { FieldAnalyzeData, UploadFormResponseData } from '@/lib/api-types'
import { useVoiceGuide } from '@/hooks/useVoiceGuide'

export default function NewTemplatePage() {
  const router = useRouter()
  const { VoiceGuideComponent } = useVoiceGuide(
    '문서 작성 페이지입니다. 어떤 방식으로 문서를 작성할까요? 첫 번째 메뉴는 문서 촬영하기, 두 번째 메뉴는 문서 파일 업로드하기, 세 번째 메뉴는 아이온 양식 사용하기 입니다.',
  )

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 템플릿 이름을 파일명으로 변환하는 함수
  const getTemplateFileName = (templateName: string): string => {
    const templateMap: Record<string, string> = {
      위임장: 'form_consent.png',
      이력서: 'form_resume.png',
      일일업무보고서: 'form_report.png',
      자기소개서: 'form_self_intro.png',
      재직증명서: 'form_certificate.png',
    }
    return templateMap[templateName] || 'form_resume.png'
  }

  // public 폴더의 이미지를 File 객체로 변환하는 함수
  const loadTemplateFile = async (fileName: string): Promise<File> => {
    const response = await fetch(`/images/${fileName}`)
    const blob = await response.blob()
    return new File([blob], fileName, { type: 'image/png' })
  }

  const handleNext = async () => {
    if (!selectedTemplate) return

    setLoading(true)

    try {
      // 1. 선택된 템플릿에 해당하는 파일 로드
      const fileName = getTemplateFileName(selectedTemplate)
      const templateFile = await loadTemplateFile(fileName)

      // 2. 템플릿 파일 업로드하여 formId 획득
      const uploadResponse = await api.form.uploadForm(templateFile)
      console.log('템플릿 업로드 성공:', uploadResponse.data)
      const formData = uploadResponse.data.data

      // 3. 동일한 파일로 필드 분석 진행
      const analyzeResponse = await api.form.analyzeField(templateFile)
      console.log('필드 분석 성공:', analyzeResponse.data)

      // 4. 분석된 필드 데이터와 formId를 로컬 스토리지에 저장
      localStorage.setItem(
        'analyzedFields',
        JSON.stringify(analyzeResponse.data.data),
      )
      localStorage.setItem('formId', formData.formId.toString())

      // 5. write 페이지로 이동
      router.push('/new/write')
    } catch (error) {
      console.error('템플릿 처리 실패:', error)
      alert('템플릿 처리에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e1525] text-white flex flex-col">
      {/* 문서 읽는 중... */}
      {loading && <ReadingDocumentOverlay />}

      {/* Voice Guide Component */}
      {VoiceGuideComponent}

      {/* Header */}
      <Header title="문서 작성" left="/new" right="voice" />

      {/* Heading */}
      <h1 className="text-[28px] font-normal px-6 mt-9 mb-8">
        <strong className="font-semibold">문서 양식</strong>
        을
        <br />
        선택해 주세요
      </h1>

      {/* Template Options */}
      <div className="space-y-3 px-5">
        {['위임장', '이력서', '일일업무보고서', '자기소개서', '재직증명서'].map(
          (template) => (
            <button
              key={template}
              onClick={() => setSelectedTemplate(template)}
              className={`w-full h-[76px] rounded-lg text-center text-[20px] font-semibold ${
                selectedTemplate === template
                  ? 'ring-2 ring-white bg-white/20'
                  : 'bg-[#1E2436]'
              }`}
            >
              {template}
            </button>
          ),
        )}
      </div>

      {/* blank */}
      <div className="h-[120px]" />

      {/* Bottom Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button disabled={!selectedTemplate || loading} onClick={handleNext}>
          다음
        </Button>
      </section>
    </div>
  )
}
