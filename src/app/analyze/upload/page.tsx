'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import UploadButton from '@/app/new/upload/UploadButton'
import DocumentPreview from '@/app/new/upload/DocumentPreview'
import { useRouter } from 'next/navigation'
import ReadingDocumentOverlay from '@/components/ReadingDocumentOverlay'
import api from '@/lib/api'

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

  const handleNext = async () => {
    if (!selectedFile) return

    setLoading(true)

    try {
      const response = await api.form.uploadForm(selectedFile)
      console.log('업로드 성공:', response.data)
      router.push('/analyze/result')
    } catch (error) {
      console.error('파일 업로드 실패:', error)
      alert('파일 업로드에 실패했습니다.')
    } finally {
      setLoading(false)
    }
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
