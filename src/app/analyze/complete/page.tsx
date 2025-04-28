'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import CustomToast from '@/components/CustomToast'

export default function AnalyzeCompletePage() {
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)

  const handleDownload = () => {
    setShowToast(true)
  }

  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
      <CustomToast
        message="문서 다운로드 완료!"
        isVisible={showToast}
        duration={1500}
        onClose={() => setShowToast(false)}
      />

      {/* Header */}
      <Header right="voice" />

      {/* Title */}
      <div className="text-center mt-3 mb-5 space-y-1">
        <h1 className="text-[24px] font-semibold">문서 수정 완료</h1>
        <p className="text-[#9B9B9B] text-sm">문서 제목</p>
        <p className="text-[#9B9B9B] text-sm">0000. 00. 00</p>
      </div>

      {/* AI Summary Button */}
      <section className="px-15">
        <button
          className="w-full bg-[#3F4551] text-white h-[34px] rounded-[6px] flex gap-1 items-center justify-center mb-4 border border-white"
          onClick={() => router.push('/analyze/ai')}
        >
          <Image
            src="/icons/new_ai.svg"
            alt="AI 문서 요약본 보러가기"
            width={16}
            height={16}
          />
          <span className="font-semibold text-sm">AI 문서 요약본 보러가기</span>
        </button>
      </section>

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
          onClick={() => router.push('/main')}
        >
          홈으로
        </Button>
      </section>
    </main>
  )
}
