'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import CustomToast from '@/components/CustomToast'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import type { DocumentSummaryData } from '@/lib/api-types'
import { Skeleton } from '@/components/ui/skeleton'

function AnalyzeAISummaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<DocumentSummaryData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [documentTitle, setDocumentTitle] = useState<string>('문서 제목')

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)

        // URL params에서 documentId 가져오기
        const documentIdStr = searchParams.get('documentId')
        if (!documentIdStr) {
          setError('문서 ID를 찾을 수 없습니다.')
          return
        }

        const documentId = parseInt(documentIdStr)
        const response = await api.document.getSummary(documentId)
        setSummary(response.data.data)

        // localStorage에서 문서 정보 가져오기 (제목 표시용)
        const savedDocumentInfo = localStorage.getItem('documentInfo')
        if (savedDocumentInfo) {
          try {
            const parsedInfo = JSON.parse(savedDocumentInfo)
            setDocumentTitle(parsedInfo.name || '문서 제목')
          } catch (error) {
            console.error('저장된 문서 정보 파싱 실패:', error)
          }
        }
      } catch (err) {
        console.error('문서 요약을 불러오는 중 오류가 발생했습니다:', err)
        setError('문서 요약을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [searchParams])

  const handleDownload = () => {
    if (summary?.pdfFileUrl) {
      // 실제 다운로드 로직을 구현할 수 있습니다
      window.open(summary.pdfFileUrl, '_blank')
    }
    setShowToast(true)
  }

  // 로딩 UI
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
        <Header title="AI 문서 요약본" left="/analyze/complete" right="voice" />
        <div className="flex-1 px-6 pt-2 pb-6 flex flex-col">
          <Skeleton className="h-6 w-1/2 bg-gray-700 mb-6" />
          <div className="space-y-5">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-40 bg-gray-700 mb-2" />
                  <div className="space-y-2">
                    {Array(3)
                      .fill(0)
                      .map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full bg-gray-700" />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    )
  }

  // 에러 UI
  if (error) {
    return (
      <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
        <Header title="AI 문서 요약본" left="/analyze/complete" right="voice" />
        <div className="flex-1 px-6 pt-6 flex flex-col items-center justify-center">
          <p className="text-red-400 text-center">{error}</p>
          <Button
            className="mt-4 bg-white text-black py-2 px-4 rounded-md font-medium"
            onClick={() => router.push('/analyze/complete')}
          >
            이전 페이지로 돌아가기
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
      <CustomToast
        message="요약본 다운로드 완료!"
        isVisible={showToast}
        duration={1500}
        onClose={() => setShowToast(false)}
      />

      {/* Header */}
      <Header title="AI 문서 요약본" left="/analyze/complete" right="voice" />

      {/* Content */}
      <div className="flex-1 px-6 pt-2 pb-6 flex flex-col">
        {/* Document Title */}
        <p className="text-gray-400 mb-6">{documentTitle}</p>

        {/* API로부터 받은 요약 정보 표시 */}
        {summary && (
          <div className="space-y-5 text-sm mb-8">
            <div className="whitespace-pre-line">{summary.summaryText}</div>
          </div>
        )}
      </div>

      {/* blank */}
      <div className="h-[80px]" />

      {/* Bottom Buttons */}
      <section className="fixed bottom-0 px-5 py-3 w-full flex space-x-2">
        <button
          className="bg-[#ffd426] p-4 rounded-md"
          onClick={handleDownload}
        >
          <Download size={20} className="text-black" />
        </button>
        <Button
          className="flex-1 bg-white text-black py-4 rounded-md font-medium"
          onClick={() => router.push('/analyze/complete')}
        >
          확인
        </Button>
      </section>
    </main>
  )
}

export default function AnalyzeAISummaryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0e1525] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>페이지를 불러오는 중...</p>
          </div>
        </main>
      }
    >
      <AnalyzeAISummaryContent />
    </Suspense>
  )
}
