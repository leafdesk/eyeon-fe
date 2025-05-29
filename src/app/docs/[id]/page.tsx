/**
 * 문서 페이지. (단일 문서)
 */
'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import CustomToast from '@/components/CustomToast'
import api from '@/lib/api'
import { DocumentData } from '@/lib/api-types'

export default function DocPage() {
  const router = useRouter()
  const params = useParams()
  const docId = params.id as string
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [document, setDocument] = useState<DocumentData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocumentDetail = async () => {
      try {
        setIsLoading(true)
        const response = await api.document.getDetail(Number(docId))
        setDocument(response.data.data)
      } catch (err) {
        console.error('문서 상세 정보를 불러오는데 실패했습니다:', err)
        setError('문서를 불러올 수 없습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocumentDetail()
  }, [docId])

  const handleDownload = async () => {
    if (document?.documentUrl) {
      try {
        // PDF 파일을 fetch로 가져오기
        const response = await fetch(document.documentUrl)
        if (!response.ok) {
          throw new Error('PDF 다운로드에 실패했습니다.')
        }

        // Blob으로 변환
        const blob = await response.blob()

        // Blob URL 생성
        const blobUrl = window.URL.createObjectURL(blob)

        // 다운로드 링크 생성 및 클릭
        const link = window.document.createElement('a')
        link.href = blobUrl
        link.download = document.name || '문서.pdf'
        window.document.body.appendChild(link)
        link.click()

        // 정리
        window.document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)

        // 다운로드 완료 토스트 표시
        setShowToast(true)
      } catch (error) {
        console.error('PDF 다운로드 오류:', error)
        // 실패 시 기존 방식으로 시도
        const link = window.document.createElement('a')
        link.href = document.documentUrl
        link.download = document.name || '문서.pdf'
        link.target = '_blank'
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)

        setShowToast(true)
      }
    }
  }

  console.log('document', document)

  return (
    <main className="min-h-screen bg-[#0e1525] text-white flex flex-col">
      <CustomToast
        message="문서 다운로드 완료!"
        isVisible={showToast}
        duration={1500}
        onClose={() => setShowToast(false)}
      />

      {/* Header */}
      <Header title="문서 보관함" right="voice" left="/docs" />

      {/* Title */}
      {isLoading ? (
        <div className="text-center pt-6 pb-4">
          <div className="h-6 w-32 bg-gray-700 animate-pulse rounded mx-auto mb-4"></div>
          <div className="h-4 w-24 bg-gray-700 animate-pulse rounded mx-auto mb-1"></div>
          <div className="h-4 w-40 bg-gray-700 animate-pulse rounded mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-center pt-6 pb-4">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="text-center pt-6 pb-4">
          <h1 className="text-lg font-semibold mb-4">
            {document?.name || '제목 없음'}
          </h1>
          <p className="text-white text-sm mb-1">
            {document?.documentType || '문서 제목'}
          </p>
          <p className="text-[#9B9B9B] text-sm">
            {document?.createdAt?.substring(0, 10) || '0000.00.00'}
            <span className="mx-[4px] text-[#363C4E]">|</span>
            {document?.documentSize
              ? `${(document.documentSize / (1024 * 1024)).toFixed(1)}MB`
              : '00.0MB'}
          </p>
        </div>
      )}

      {/* Document Preview */}
      <section className="px-15 mb-8">
        {isLoading ? (
          <div className="bg-gray-800 rounded-sm flex items-center justify-center overflow-hidden">
            <div className="w-full aspect-[7/10] animate-pulse" />
          </div>
        ) : error ? (
          <div className="bg-gray-800 rounded-sm flex items-center justify-center overflow-hidden p-4">
            <p className="text-red-500">문서를 불러올 수 없습니다</p>
          </div>
        ) : (
          <div className="bg-white rounded-sm flex items-center justify-center overflow-hidden">
            {document?.documentImgUrl ? (
              <Image
                src={document.documentImgUrl}
                alt={document.name || '문서 미리보기'}
                width={500}
                height={700}
                className="w-full object-contain aspect-[7/10]"
              />
            ) : (
              <div className="w-full aspect-[7/10] bg-white" />
            )}
          </div>
        )}
      </section>

      {/* blank */}
      <div className="h-[148px]" />

      {/* Action Buttons */}
      <section className="fixed bottom-0 px-5 py-3 w-full space-y-3">
        <Button
          className="bg-[#FFD700] h-[48px] text-sm"
          onClick={handleDownload}
          disabled={!document?.documentUrl}
        >
          문서 다운로드
        </Button>
        <Button
          className="h-[48px] text-sm"
          onClick={() => router.push(`/docs/${docId}/ai`)}
        >
          AI 문서 요약본
        </Button>
      </section>
    </main>
  )
}
