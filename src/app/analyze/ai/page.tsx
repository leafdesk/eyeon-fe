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
import { useVoiceGuide } from '@/hooks/useVoiceGuide'

function AnalyzeAISummaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<DocumentSummaryData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [documentTitle, setDocumentTitle] = useState<string>('문서 제목')
  const [backUrl, setBackUrl] = useState('/analyze/complete')

  // API 요약 데이터가 있으면 그것을 읽어주고, 없으면 기본 안내 메시지
  const voiceGuideText = summary?.summaryText
    ? `AI 문서 요약입니다. ${summary.summaryText}`
    : 'AI 문서 요약 페이지입니다. 수정된 문서의 AI 요약 내용을 확인할 수 있습니다.'

  const { VoiceGuideComponent } = useVoiceGuide(voiceGuideText)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)

        // URL params에서 documentId 가져오기
        const documentIdStr = searchParams.get('documentId')

        // URL params에 documentId가 있으면 sessionStorage에 저장 (향후 재진입을 위해)
        if (documentIdStr) {
          sessionStorage.setItem('analyzeDocumentId', documentIdStr)
          setBackUrl(`/analyze/complete?documentId=${documentIdStr}`)
        }

        // localStorage에서 문서 정보 가져오기
        const savedDocumentInfo = localStorage.getItem('documentInfo')
        let documentInfo = null
        if (savedDocumentInfo) {
          try {
            documentInfo = JSON.parse(savedDocumentInfo)
            setDocumentTitle(documentInfo.name || '문서 제목')
          } catch (error) {
            console.error('저장된 문서 정보 파싱 실패:', error)
          }
        }

        // sessionStorage에서 documentId 가져오기 (analyze 플로우용)
        const sessionDocumentId = sessionStorage.getItem('documentId')
        const analyzeDocumentId = sessionStorage.getItem('analyzeDocumentId')

        let finalDocumentId = null

        // URL params 우선, 없으면 sessionStorage에서 가져오기
        if (documentIdStr) {
          finalDocumentId = parseInt(documentIdStr)
        } else if (analyzeDocumentId) {
          finalDocumentId = parseInt(analyzeDocumentId)
          setBackUrl(`/analyze/complete?documentId=${analyzeDocumentId}`)
        } else if (sessionDocumentId) {
          finalDocumentId = parseInt(sessionDocumentId)
        }

        // documentId가 있으면 API 호출
        if (finalDocumentId) {
          try {
            const response = await api.document.getSummary(finalDocumentId)
            setSummary(response.data.data)
          } catch (apiError) {
            console.error('API 호출 실패:', apiError)
            // API 호출 실패 시 기본 요약 표시
            setSummary({
              summaryText: `${
                documentInfo?.name || '문서'
              }에 대한 AI 요약이 준비 중입니다.\n\n작성된 문서의 주요 내용과 핵심 포인트를 분석하여 요약본을 제공할 예정입니다.`,
              pdfFileUrl: documentInfo?.pdfUrl || '',
            })
          }
        }
        // documentId를 찾을 수 없으면 에러 표시
        else {
          setError('문서 ID를 찾을 수 없습니다.')
          return
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
    let downloadUrl = summary?.pdfFileUrl

    // summary에 pdfFileUrl이 없으면 localStorage에서 가져오기
    if (!downloadUrl) {
      const savedDocumentInfo = localStorage.getItem('documentInfo')
      if (savedDocumentInfo) {
        try {
          const documentInfo = JSON.parse(savedDocumentInfo)
          downloadUrl = documentInfo.pdfUrl
        } catch (error) {
          console.error('저장된 문서 정보 파싱 실패:', error)
        }
      }
    }

    if (downloadUrl) {
      // 실제 다운로드 로직을 구현할 수 있습니다
      window.open(downloadUrl, '_blank')
    }
    setShowToast(true)
  }

  // 로딩 UI
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
        <Header title="AI 문서 요약본" left={backUrl} right="voice" />
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
        <Header title="AI 문서 요약본" left={backUrl} right="voice" />
        <div className="flex-1 px-6 pt-6 flex flex-col items-center justify-center">
          <p className="text-red-400 text-center">{error}</p>
          <Button
            className="mt-4 bg-white text-black py-2 px-4 rounded-md font-medium"
            onClick={() => router.push(backUrl)}
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
      <Header title="AI 문서 요약본" left={backUrl} right="voice" />

      {/* Voice Guide Component */}
      {VoiceGuideComponent}

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
          onClick={() => router.push(backUrl)}
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
