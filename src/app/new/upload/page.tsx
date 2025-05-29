'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import UploadButton from './UploadButton'
import DocumentPreview from './DocumentPreview'
import { useRouter } from 'next/navigation'
import ReadingDocumentOverlay from '@/components/ReadingDocumentOverlay'
import api from '@/lib/api'
import { FieldAnalyzeData, UploadFormResponseData } from '@/lib/api-types'
import { base64ToFile } from '@/lib/utils'
import { useVoiceGuide } from '@/hooks/useVoiceGuide'

export default function NewUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [formData, setFormData] = useState<UploadFormResponseData | null>(null)
  const [isFromScan, setIsFromScan] = useState(false)
  const router = useRouter()
  const { VoiceGuideComponent } = useVoiceGuide(
    '문서 업로드 페이지입니다. 가운데 버튼을 클릭하면 작성할 문서를 업로드할 수 있습니다.',
  )

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setUploadLoading(true)

    try {
      const response = await api.form.uploadForm(file)
      console.log('업로드 성공:', response.data)
      setFormData(response.data.data)
    } catch (error) {
      console.error('파일 업로드 실패:', error)
      alert('파일 업로드에 실패했습니다.')
      setSelectedFile(null)
      setIsFromScan(false)
    } finally {
      setUploadLoading(false)
    }
  }

  // 페이지 로드 시 스캔 데이터 확인
  useEffect(() => {
    const scanDataStr = sessionStorage.getItem('scanData')

    if (scanDataStr) {
      try {
        const scanData = JSON.parse(scanDataStr)

        if (scanData.base64) {
          // base64 데이터를 File로 변환
          const file = base64ToFile(
            scanData.base64,
            scanData.filename || 'scanned-document.png',
            'image/png',
          )

          setIsFromScan(true)
          handleFileSelect(file)

          // 사용한 스캔 데이터 제거
          sessionStorage.removeItem('scanData')
          sessionStorage.removeItem('originalFile')
        }
      } catch (error) {
        console.error('스캔 데이터 파싱 실패:', error)
        // 잘못된 데이터 제거
        sessionStorage.removeItem('scanData')
        sessionStorage.removeItem('originalFile')
      }
    }
  }, [])

  const handleFileChange = async (file: File) => {
    // 파일이 변경되면 다시 업로드
    setIsFromScan(false)
    handleFileSelect(file)
  }

  const handleNext = async () => {
    if (!selectedFile || !formData) return

    setLoading(true)

    try {
      const response = await api.form.analyzeField(selectedFile)
      console.log('필드 분석 성공:', response.data)

      // 분석된 필드 데이터를 로컬 스토리지에 저장 (formId는 URL로 전달)
      localStorage.setItem('analyzedFields', JSON.stringify(response.data.data))

      router.push(`/new/write?formId=${formData.formId}`)
    } catch (error) {
      console.error('필드 분석 실패:', error)
      alert('문서 필드 분석에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
      {/* 문서 읽는 중... */}
      {loading && <ReadingDocumentOverlay />}

      {/* Voice Guide Component */}
      {VoiceGuideComponent}

      {/* Header */}
      <Header title="문서 업로드" left="/new" leftIconType="x" right="voice" />

      {/* Main Content */}
      {selectedFile ? (
        <DocumentPreview
          file={selectedFile}
          onFileChange={handleFileChange}
          isFromScan={isFromScan}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center px-6">
          <UploadButton
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            isLoading={uploadLoading}
          />
        </div>
      )}

      {/* blank */}
      <div className="h-20" />

      {/* Bottom Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button
          disabled={!selectedFile || loading || uploadLoading || !formData}
          onClick={handleNext}
        >
          다음
        </Button>
      </section>
    </main>
  )
}
