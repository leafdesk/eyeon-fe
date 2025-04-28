'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import VoiceGuideToggle from '@/components/VoiceGuideToggle'
import { useState } from 'react'
import UploadButton from './UploadButton'
import DocumentPreview from './DocumentPreview'

export default function NewUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleFileChange = (file: File) => {
    setSelectedFile(file)
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header
        title="문서 업로드"
        left="/new"
        leftIconType="x"
        right={<VoiceGuideToggle />}
      />

      {/* Main Content */}
      {selectedFile ? (
        <DocumentPreview file={selectedFile} onFileChange={handleFileChange} />
      ) : (
        <div className="flex-1 flex items-center justify-center px-6">
          <UploadButton
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
        </div>
      )}

      {/* blank */}
      <div className="h-20" />

      {/* Bottom Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button disabled={!selectedFile}>다음</Button>
      </section>
    </main>
  )
}
