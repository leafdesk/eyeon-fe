'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import VoiceGuideToggle from '@/components/VoiceGuideToggle'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTemplatePage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#0e1525] text-white flex flex-col">
      {/* Header */}
      <Header title="문서 작성" left="/new" right={<VoiceGuideToggle />} />

      {/* Heading */}
      <h1 className="text-[28px] font-normal px-6 mt-9 mb-8">
        <strong className="font-semibold">문서 양식</strong>
        을
        <br />
        선택해 주세요
      </h1>

      {/* Template Options */}
      <div className="space-y-3 px-5">
        {['이력서', '근로계약서', '택배송장', '임대차계약서'].map(
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

      {/* Bottom Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button
          disabled={!selectedTemplate}
          onClick={() => router.push('/new/write')}
        >
          다음
        </Button>
      </section>
    </div>
  )
}
