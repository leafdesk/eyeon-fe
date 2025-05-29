'use client'

import Image from 'next/image'
import Header from '@/components/Header'
import DocumentCapture from '@/components/DocumentCapture'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useVoiceGuide } from '@/hooks/useVoiceGuide'
import api from '@/lib/api'
import ReadingDocumentOverlay from '@/components/ReadingDocumentOverlay'

/**
 * 문서 작성 페이지.
 */
export default function NewPage() {
  const [showCapture, setShowCapture] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { VoiceGuideComponent } = useVoiceGuide(
    '문서 작성 페이지입니다. 첫 번째는 문서 촬영하기, 두 번째는 문서 파일 업로드하기, 세 번째는 아이온 양식 사용하기입니다.',
  )

  const handleCapture = async (file: File) => {
    console.log('Captured file:', file)
    setShowCapture(false)
    setLoading(true)

    try {
      // 1. 스캔 API 호출 (실패해도 계속 진행)
      let scanData = null
      try {
        console.log('스캔 API 호출 중...')
        const scanResponse = await api.ai.scan(file)
        console.log('스캔 API 응답:', scanResponse.data)
        scanData = scanResponse.data
      } catch (scanError) {
        console.warn('스캔 API 실패, 분석 API로 계속 진행:', scanError)
      }

      // 2. 분석 API 호출
      console.log('분석 API 호출 중...')
      const analyzeResponse = await api.form.analyzeField(file)
      console.log('분석 API 응답:', analyzeResponse.data)

      // 3. 분석된 필드 데이터를 localStorage에 저장
      localStorage.setItem(
        'analyzedFields',
        JSON.stringify(analyzeResponse.data.data),
      )

      // 4. 스캔 데이터와 원본 파일을 sessionStorage에 저장
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string

        // 스캔 API 성공 시 그 결과를 사용하고, 실패 시 원본 파일의 base64 사용
        const finalScanData = {
          base64: scanData?.base64 || base64,
          filename: scanData?.filename || file.name,
        }

        sessionStorage.setItem('scanData', JSON.stringify(finalScanData))
        sessionStorage.setItem(
          'originalFile',
          JSON.stringify({
            name: file.name,
            size: file.size,
            type: file.type,
          }),
        )

        // 5. 현재 위치에 따라 적절한 페이지로 이동
        if (pathname.includes('/analyze')) {
          router.push('/analyze/write')
        } else {
          // 기본 formId 사용
          const formId = 1
          router.push(`/new/write?formId=${formId}`)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('문서 분석 실패:', error)
      alert('문서 분석에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#0F1626] text-white">
        {/* 문서 읽는 중... */}
        {loading && <ReadingDocumentOverlay />}

        {/* Header */}
        <Header left="/main" title="문서 작성" right="voice" />

        {/* Voice Guide Component */}
        {VoiceGuideComponent}

        {/* Question */}
        <div className="px-6 mt-9 mb-8">
          <p className="text-[24px] font-normal">
            어떤 방식으로
            <br />
            <strong className="font-semibold">문서를 작성</strong>
            할까요?
          </p>
        </div>

        {/* Options */}
        <div className="px-5 space-y-4">
          {/* Take Photo Option */}
          <div
            onClick={() => setShowCapture(true)}
            className="bg-[#FFD700] text-black rounded-xl p-5 flex justify-between h-[160px] cursor-pointer"
          >
            <div className="text-[#0F1626] text-[24px] font-semibold mt-auto pl-2 pb-1">
              문서
              <br />
              촬영하기
            </div>
            <Image
              src="/icons/new_camera.svg"
              alt="Camera"
              width={100}
              height={100}
              className="mb-auto"
            />
          </div>

          {/* Upload File Option */}
          <div
            className="bg-white text-black rounded-xl p-5 flex justify-between h-[160px] cursor-pointer"
            onClick={() => router.push('/new/upload')}
          >
            <div className="text-[#0F1626] text-[24px] font-semibold mt-auto pl-2 pb-1">
              문서 파일
              <br />
              업로드하기
            </div>
            <Image
              src="/icons/new_upload.svg"
              alt="File Upload"
              width={100}
              height={100}
              className="mb-auto"
            />
          </div>

          {/* Use Template Option */}
          <div
            className="bg-[#FFD700] text-black rounded-xl p-5 flex justify-between h-[160px] cursor-pointer"
            onClick={() => router.push('/new/template')}
          >
            <div className="text-[#0F1626] text-[24px] font-semibold mt-auto pl-2 pb-1">
              아이온
              <br />
              양식 사용하기
            </div>
            <Image
              src="/icons/new_form.svg"
              alt="Form"
              width={100}
              height={100}
              className="mb-auto"
            />
          </div>
        </div>

        {/* blank */}
        <div className="h-16" />
      </main>

      {/* Document Capture Overlay */}
      {showCapture && (
        <div className="fixed inset-0 z-50">
          <DocumentCapture
            onNext={() => setShowCapture(false)}
            onCancel={() => setShowCapture(false)}
            onCapture={handleCapture}
          />
        </div>
      )}
    </>
  )
}
