'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import CustomToast from '@/components/CustomToast'

export default function EmploymentDocPage() {
  const router = useRouter()
  const params = useParams()
  const docId = params.id as string
  const [showToast, setShowToast] = useState(false)

  const handleDownload = () => {
    setShowToast(true)
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white flex flex-col">
      <CustomToast
        message="문서 다운로드 완료!"
        isVisible={showToast}
        duration={1500}
        onClose={() => setShowToast(false)}
      />

      {/* Header */}
      <Header title="내 문서 양식" right="voice" left="/my/docs/employment" />

      {/* Title */}
      <div className="text-center pt-6 pb-4">
        <h1 className="text-lg font-semibold mb-4">근로계약서</h1>
        <p className="text-white text-sm mb-1">문서 제목</p>
        <p className="text-[#9B9B9B] text-sm">
          0000.00.00 <span className="mx-[4px] text-[#363C4E]">|</span> 00.0MB
        </p>
      </div>

      {/* Document Preview */}
      <section className="px-15 mb-8">
        <div className="bg-white rounded-sm flex items-center justify-center overflow-hidden">
          <div className="w-full aspect-[7/10] bg-white" />
        </div>
      </section>

      {/* blank */}
      <div className="h-[148px]" />

      {/* Action Buttons */}
      <section className="fixed bottom-0 px-5 py-3 w-full space-y-3">
        <Button
          className="bg-[#FFD700] h-[48px] text-sm"
          onClick={handleDownload}
        >
          문서 다운로드
        </Button>
        <Button
          className="h-[48px] text-sm"
          onClick={() => router.push(`/my/docs/employment/${docId}/ai`)}
        >
          AI 문서 요약본
        </Button>
      </section>
    </main>
  )
}
