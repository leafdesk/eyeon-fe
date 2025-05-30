'use client'

import Header from '@/components/Header'
import AnalysisCard from '../AnalysisCard'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { DocumentAdviceData } from '@/lib/api-types'
import { useVoiceGuide } from '@/hooks/useVoiceGuide'

export default function AnalyzeEditPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [adviceData, setAdviceData] = useState<DocumentAdviceData[]>([])
  const [editedContents, setEditedContents] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  // 현재 AI 조언을 음성으로 읽어주는 훅
  const currentAdvice = adviceData[currentIndex]?.a || ''
  const { VoiceGuideComponent } = useVoiceGuide(
    currentAdvice,
    hasUserInteracted, // 사용자가 한 번 상호작용 후에는 자동 재생
  )

  useEffect(() => {
    // sessionStorage에서 조언 데이터 가져오기
    const storedAdviceData = sessionStorage.getItem('adviceData')
    if (storedAdviceData) {
      try {
        const parsedData: DocumentAdviceData[] = JSON.parse(storedAdviceData)
        setAdviceData(parsedData)
        // 초기 편집 내용을 현재 값으로 설정
        setEditedContents(parsedData.map((item) => item.v))
        setLoading(false)
      } catch (error) {
        console.error('조언 데이터 파싱 실패:', error)
        router.push('/analyze/upload')
      }
    } else {
      // 조언 데이터가 없으면 업로드 페이지로 리다이렉트
      router.push('/analyze/upload')
    }
  }, [router])

  // 사용자 상호작용 감지 (음성 오버레이 터치 또는 버튼 클릭)
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true)
    }

    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('touchstart', handleUserInteraction, {
      once: true,
    })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < adviceData.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // 마지막 인덱스에서는 완료 페이지로 이동
      // 수정된 데이터를 sessionStorage에 저장
      const modifiedData = adviceData.map((item, index) => ({
        i: item.i,
        v: editedContents[index],
      }))
      sessionStorage.setItem('modifiedData', JSON.stringify(modifiedData))

      // documentId를 URL 파라미터로 전달
      const documentId = sessionStorage.getItem('documentId')
      if (documentId) {
        router.push(`/analyze/complete?documentId=${documentId}`)
      } else {
        router.push('/analyze/complete')
      }
    }
  }

  const handleContentChange = (value: string) => {
    setEditedContents((prev) => {
      const newContents = [...prev]
      newContents[currentIndex] = value
      return newContents
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0e1525] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      </main>
    )
  }

  if (adviceData.length === 0) {
    return (
      <main className="min-h-screen bg-[#0e1525] text-white flex items-center justify-center">
        <div className="text-center">
          <p>분석할 데이터가 없습니다.</p>
          <Button
            onClick={() => router.push('/analyze/upload')}
            className="mt-4"
          >
            다시 업로드하기
          </Button>
        </div>
      </main>
    )
  }

  const currentData = adviceData[currentIndex]

  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
      {/* 음성 안내 오버레이 */}
      {VoiceGuideComponent}

      {/* Header */}
      <Header title="문서 수정" left="/analyze/upload" right="voice" />

      {/* Title with Pagination */}
      <section className="px-6 pt-6 pb-7 flex justify-between items-start">
        <h1 className="text-[20px] font-normal">
          AI 피드백을 참고하여
          <br />
          기존 내용을 수정할 수 있어요
        </h1>
        <div className="bg-[#1E2436] px-3 py-[5px] rounded-full w-[44px] text-center text-[13px] font-normal text-[#9B9B9B]">
          <span className="text-white font-semibold">{currentIndex + 1}</span>/
          {adviceData.length}
        </div>
      </section>

      {/* Content Editing Section */}
      <section className="px-5">
        <p className="text-sm font-normal mb-2">내용 수정란</p>

        {/* Original Content */}
        <textarea
          className="w-full bg-[#1E2436] rounded-xl px-4 py-[14px] mb-4 text-[#9B9B9B] font-normal text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white focus:text-white"
          value={editedContents[currentIndex] || ''}
          onChange={(e) => handleContentChange(e.target.value)}
          rows={4}
          placeholder="내용을 입력하세요..."
        />

        {/* AI Feedback */}
        <AnalysisCard title="AI 조언" feedback={currentData.a} />
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
          {currentIndex === adviceData.length - 1 ? '완료' : '다음'}
        </Button>
      </section>
    </main>
  )
}
