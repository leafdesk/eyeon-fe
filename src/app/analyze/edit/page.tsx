'use client'

import Header from '@/components/Header'
import AnalysisCard from '../AnalysisCard'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// 임시 데이터 (실제로는 API에서 받아올 예정)
const analysisData = [
  {
    originalContent:
      '이것은 첫 번째 인덱스입니다. 땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님,',
    feedback:
      '문장이 너무 길고 복잡합니다. 쉼표로 구분된 여러 문장으로 나누는 것이 좋겠습니다.',
  },
  {
    originalContent:
      '두 번째 인덱스입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님, 땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. ',
    feedback:
      '반복되는 표현이 많습니다. "별 하나에"라는 표현을 다양하게 바꾸어 보세요.',
  },
  {
    originalContent:
      '세 번째 인덱스입니다. 세 번째 인덱스입니다. 세 번째 인덱스입니다. 세 번째 인덱스입니다. ',
    feedback:
      '문장의 주어와 서술어가 명확하지 않습니다. 주어를 명확히 하고 서술어를 적절히 배치해보세요.',
  },
]

export default function AnalyzeEditPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [editedContents, setEditedContents] = useState(
    analysisData.map((item) => item.originalContent),
  )

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < analysisData.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // 마지막 인덱스에서는 완료 페이지로 이동
      router.push('/analyze/complete')
    }
  }

  const handleContentChange = (value: string) => {
    setEditedContents((prev) => {
      const newContents = [...prev]
      newContents[currentIndex] = value
      return newContents
    })
  }

  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
      {/* Header */}
      <Header title="문서 수정" left="/analyze/result" right="voice" />

      {/* Title with Pagination */}
      <section className="px-6 pt-6 pb-7 flex justify-between items-start">
        <h1 className="text-[20px] font-normal">
          AI 피드백을 참고하여
          <br />
          기존 내용을 수정할 수 있어요
        </h1>
        <div className="bg-[#1E2436] px-3 py-[5px] rounded-full w-[44px] text-center text-[13px] font-normal text-[#9B9B9B]">
          <span className="text-white font-semibold">{currentIndex + 1}</span>/
          {analysisData.length}
        </div>
      </section>

      {/* Content Editing Section */}
      <section className="px-5">
        <p className="text-sm font-normal mb-2">내용 수정란</p>

        {/* Original Content */}
        <textarea
          className="w-full bg-[#1E2436] rounded-xl px-4 py-[14px] mb-4 text-[#9B9B9B] font-normal text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white focus:text-white"
          value={editedContents[currentIndex]}
          onChange={(e) => handleContentChange(e.target.value)}
          rows={4}
        />

        {/* AI Feedback */}
        <AnalysisCard
          title="문서 추출 내용"
          feedback={analysisData[currentIndex].feedback}
        />
      </section>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Bottom Buttons */}
      <section className="fixed bottom-0 px-5 py-3 w-full bg-[#0F1626] flex gap-2">
        <Button
          className="flex-1 bg-white/40 text-white"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          이전
        </Button>
        <Button className="flex-[1.5]" onClick={handleNext}>
          다음
        </Button>
      </section>
    </main>
  )
}
