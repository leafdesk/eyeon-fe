'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import VoiceGuideToggle from '@/components/VoiceGuideToggle'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import WritingDocumentOverlay from '@/components/WritingDocumentOverlay'

export default function NewWritePage() {
  const router = useRouter()
  const [isWriting, setIsWriting] = useState(false)

  const handleNext = () => {
    setIsWriting(true)
    // TODO: API 요청 로직 추가
    setTimeout(() => {
      router.push('/new/complete')
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
      {/* Header */}
      <Header
        title="문서 작성"
        left="/new" // TODO: router.back (capture | upload | template)
        leftIconType="x"
        right={<VoiceGuideToggle />}
      />

      {/* Heading */}
      <h1 className="text-[24px] font-normal px-6 mt-9 mb-7">
        아이온에서 기본 정보는
        <br />
        미리 가져왔어요
      </h1>

      {/* Form Fields */}
      <div className="px-5 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm mb-2">성명</label>
          <input
            type="text"
            defaultValue="홍길동"
            className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
            readOnly
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm mb-2">휴대폰 번호</label>
          <input
            type="tel"
            defaultValue="010-0000-0000"
            className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
            readOnly
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-2">이메일</label>
          <input
            type="email"
            defaultValue="abc1234@naver.com"
            className="w-full bg-[#252932] text-white px-4 rounded-[6px] h-[48px]"
            readOnly
          />
        </div>
      </div>

      {/* Bottom Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button onClick={handleNext}>다음</Button>
      </section>

      {/* Writing Overlay */}
      {isWriting && <WritingDocumentOverlay />}
    </main>
  )
}
