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

function AISummaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<DocumentSummaryData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [documentInfo, setDocumentInfo] = useState<{
    name: string
    date: string
    pdfUrl: string
  }>({
    name: '문서 제목',
    date: '',
    pdfUrl: '',
  })

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)

        // URL params에서 문서 정보 가져오기
        const documentName = searchParams.get('documentName')
        const createdDate = searchParams.get('createdDate')
        const pdfUrl = searchParams.get('pdfUrl')
        const formIdStr = searchParams.get('formId')

        if (documentName && createdDate) {
          // 문서 정보 설정
          const date = new Date(createdDate)
          const formattedDate = date.toLocaleDateString('ko-KR')

          setDocumentInfo({
            name: documentName,
            date: formattedDate,
            pdfUrl: pdfUrl || '',
          })

          // formId가 있으면 실제 API 호출 시도
          if (formIdStr) {
            try {
              const formId = parseInt(formIdStr)
              // formId를 documentId로 사용하여 문서 요약 조회
              const response = await api.document.getSummary(formId)
              setSummary(response.data.data)
            } catch (apiError) {
              console.error('API 호출 실패:', apiError)
              // API 호출 실패 시 기본 요약 표시
              setSummary({
                summaryText: `${documentName}에 대한 AI 요약이 준비 중입니다.\n\n작성된 문서의 주요 내용과 핵심 포인트를 분석하여 요약본을 제공할 예정입니다.`,
                pdfFileUrl: pdfUrl || '',
              })
            }
          } else {
            // formId가 없으면 기본 요약 표시
            setSummary({
              summaryText: `${documentName}에 대한 AI 요약이 준비 중입니다.\n\n작성된 문서의 주요 내용과 핵심 포인트를 분석하여 요약본을 제공할 예정입니다.`,
              pdfFileUrl: pdfUrl || '',
            })
          }
        } else {
          setError('문서 정보를 찾을 수 없습니다.')
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
    if (documentInfo.pdfUrl) {
      // 실제 다운로드 로직
      window.open(documentInfo.pdfUrl, '_blank')
    }
    setShowToast(true)
  }

  // 로딩 UI
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
        <Header title="AI 문서 요약본" left="/new/complete" right="voice" />
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
        <Header title="AI 문서 요약본" left="/new/complete" right="voice" />
        <div className="flex-1 px-6 pt-6 flex flex-col items-center justify-center">
          <p className="text-red-400 text-center">{error}</p>
          <Button
            className="mt-4 bg-white text-black py-2 px-4 rounded-md font-medium"
            onClick={() => router.push('/new/complete')}
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
      <Header title="AI 문서 요약본" left="/new/complete" right="voice" />

      {/* Content */}
      <div className="flex-1 px-6 pt-2 pb-6 flex flex-col">
        {/* Document Title */}
        <p className="text-gray-400 mb-6">{documentInfo.name}</p>

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
          onClick={() => router.push('/new/complete')}
        >
          확인
        </Button>
      </section>
    </main>
  )
}

export default function AISummaryPage() {
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
      <AISummaryContent />
    </Suspense>
  )
}
