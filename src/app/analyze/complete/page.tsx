'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import CustomToast from '@/components/CustomToast'
import api from '@/lib/api'
import type { DocumentModifyRequest } from '@/lib/api-types'

function AnalyzeCompleteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(false)
  const [documentInfo, setDocumentInfo] = useState<{
    name: string
    date: string
    pdfUrl?: string
    imgUrl?: string
  }>({
    name: '문서 제목',
    date: new Date().toLocaleDateString('ko-KR'),
  })

  console.log('documentInfo', documentInfo)

  useEffect(() => {
    const documentIdFromUrl = searchParams.get('documentId')

    // localStorage에서 저장된 문서 정보 확인
    const savedDocumentInfo = localStorage.getItem('documentInfo')
    if (savedDocumentInfo) {
      try {
        const parsedInfo = JSON.parse(savedDocumentInfo)
        setDocumentInfo(parsedInfo)
      } catch (error) {
        console.error('저장된 문서 정보 파싱 실패:', error)
      }
    }

    // 페이지 로드 시 수정된 데이터를 API로 전송
    const submitModifiedData = async () => {
      const modifiedDataStr = sessionStorage.getItem('modifiedData')
      const documentIdStr =
        sessionStorage.getItem('documentId') || documentIdFromUrl

      if (modifiedDataStr && documentIdStr) {
        setLoading(true)
        try {
          const modifiedData: DocumentModifyRequest['data'] =
            JSON.parse(modifiedDataStr)
          const documentId = parseInt(documentIdStr)

          const response = await api.document.modifyDocument(documentId, {
            data: modifiedData,
          })
          console.log('문서 수정 성공:', response.data)

          // 응답에서 문서 정보 업데이트
          if (response.data.data) {
            const newDocumentInfo = {
              name: response.data.data.documentName,
              date: new Date(response.data.data.createdDate).toLocaleDateString(
                'ko-KR',
              ),
              pdfUrl: response.data.data.pdfUrl,
              imgUrl: response.data.data.imageUrl,
            }
            setDocumentInfo(newDocumentInfo)

            // localStorage에 문서 정보 저장 (새로고침 시 유지를 위해)
            localStorage.setItem(
              'documentInfo',
              JSON.stringify(newDocumentInfo),
            )
          }

          // sessionStorage 정리
          sessionStorage.removeItem('modifiedData')
          sessionStorage.removeItem('documentId')
          sessionStorage.removeItem('adviceData')
        } catch (error) {
          console.error('문서 수정 실패:', error)
          alert('문서 수정에 실패했습니다.')
        } finally {
          setLoading(false)
        }
      }
    }

    submitModifiedData()
  }, [searchParams])

  const handleDownload = () => {
    if (documentInfo.pdfUrl) {
      // 실제 다운로드 로직
      const link = document.createElement('a')
      link.href = documentInfo.pdfUrl
      link.download = documentInfo.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    setShowToast(true)
  }

  const handleGoHome = () => {
    // localStorage 정리
    localStorage.removeItem('documentInfo')
    router.push('/main')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0e1525] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>문서를 처리하는 중...</p>
        </div>
      </main>
    )
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
        <p className="text-[#9B9B9B] text-sm">{documentInfo.name}</p>
        <p className="text-[#9B9B9B] text-sm">{documentInfo.date}</p>
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
          {documentInfo.imgUrl ? (
            <Image
              src={documentInfo.imgUrl}
              alt="문서 미리보기"
              width={300}
              height={400}
              className="w-full aspect-[7/10] object-contain"
            />
          ) : (
            <div className="w-full aspect-[7/10] bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500 text-sm">문서 이미지 로딩 중...</p>
            </div>
          )}
        </div>
      </section>

      {/* blank */}
      <div className="h-[148px]" />

      {/* Action Buttons */}
      <section className="fixed bottom-0 px-5 py-3 w-full space-y-3">
        <Button
          className="bg-[#FFD700] h-[48px] text-sm"
          onClick={handleDownload}
          disabled={!documentInfo.pdfUrl}
        >
          문서 다운로드
        </Button>
        <Button className="h-[48px] text-sm" onClick={handleGoHome}>
          홈으로
        </Button>
      </section>
    </main>
  )
}

export default function AnalyzeCompletePage() {
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
      <AnalyzeCompleteContent />
    </Suspense>
  )
}
