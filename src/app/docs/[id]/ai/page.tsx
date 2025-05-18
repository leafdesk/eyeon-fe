'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import CustomToast from '@/components/CustomToast'
import { useRouter, useParams } from 'next/navigation'
import api from '@/lib/api'
import { DocumentSummaryData } from '@/lib/api-types'
import { Skeleton } from '@/components/ui/skeleton'

export default function DocAISummaryPage() {
  const router = useRouter()
  const params = useParams()
  const docId = params.id as string
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<DocumentSummaryData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)
        const response = await api.document.getSummary(parseInt(docId))
        setSummary(response.data.data)
      } catch (err) {
        console.error('문서 요약을 불러오는 중 오류가 발생했습니다:', err)
        setError('문서 요약을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [docId])

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
        <Header title="AI 문서 요약본" left={`/docs/${docId}`} right="voice" />
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
        <Header title="AI 문서 요약본" left={`/docs/${docId}`} right="voice" />
        <div className="flex-1 px-6 pt-6 flex flex-col items-center justify-center">
          <p className="text-red-400 text-center">{error}</p>
          <Button
            className="mt-4 bg-white text-black py-2 px-4 rounded-md font-medium"
            onClick={() => router.push(`/docs/${docId}`)}
          >
            문서로 돌아가기
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
      <Header title="AI 문서 요약본" left={`/docs/${docId}`} right="voice" />

      {/* Content */}
      <div className="flex-1 px-6 pt-2 pb-6 flex flex-col">
        {/* Document Title */}
        <p className="text-gray-400 mb-6">문서 제목</p>

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
          onClick={() => router.push(`/docs/${docId}`)}
        >
          확인
        </Button>
      </section>
    </main>
  )
}
