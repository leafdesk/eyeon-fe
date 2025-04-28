'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import UploadButton from '@/components/UploadButton'
import DocumentPreview from '@/components/DocumentPreview'
import { useRouter } from 'next/navigation'
import ReadingDocumentOverlay from '@/components/ReadingDocumentOverlay'

export default function AnalyzeUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleFileChange = (file: File) => {
    setSelectedFile(file)
  }

  const handleNext = () => {
    // TODO: API 연동
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // 분석 결과 페이지로 이동 (추후 변경 가능)
      router.push('/analyze/result')
    }, 1500)
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
      {/* 문서 읽는 중... */}
      {loading && <ReadingDocumentOverlay />}

      {/* Header */}
      <Header
        title="문서 업로드"
        left="/analyze"
        leftIconType="x"
        right="voice"
      />

      {/* Main Content */}
      {selectedFile ? (
        <DocumentPreview file={selectedFile} onFileChange={handleFileChange} />
      ) : (
        <div className="flex-1 flex items-center justify-center px-6">
          <UploadButton
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            text="분석할 문서를 업로드해 주세요"
          />
        </div>
      )}

      {/* blank */}
      <div className="h-20" />

      {/* Bottom Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button disabled={!selectedFile || loading} onClick={handleNext}>
          다음
        </Button>
      </section>
    </main>
  )
}
