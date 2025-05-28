'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CustomToast from '@/components/CustomToast'
import { DocumentWriteResponseData } from '@/lib/api-types'

export default function NewCompletePage() {
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)
  const [documentData, setDocumentData] =
    useState<DocumentWriteResponseData | null>(null)
  const [formattedDate, setFormattedDate] = useState<string>('')
  const [formId, setFormId] = useState<number | null>(null)

  useEffect(() => {
    // 로컬 스토리지에서 문서 데이터 가져오기
    const storedData = localStorage.getItem('documentData')
    if (storedData) {
      const responseData = JSON.parse(storedData)
      const data = responseData.data as DocumentWriteResponseData
      setDocumentData(data)

      // formId 설정 (write 페이지에서 추가로 저장한 경우)
      if (responseData.formId) {
        setFormId(responseData.formId)
      }

      // 날짜 포맷팅 (YYYY. MM. DD)
      if (data.createdDate) {
        const date = new Date(data.createdDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        setFormattedDate(`${year}. ${month}. ${day}`)
      }
    } else {
      // 문서 데이터가 없으면 메인 페이지로 리다이렉트
      router.push('/main')
    }
  }, [router])

  // 홈으로 이동 시 로컬 스토리지 정리
  const handleHomeClick = () => {
    // 문서 데이터 삭제
    localStorage.removeItem('documentData')
    localStorage.removeItem('formId') // formId도 정리
    router.push('/main')
  }

  const handleAISummaryClick = () => {
    if (documentData) {
      // AI 요약 페이지로 이동하면서 문서 정보를 URL params로 전달
      const params = new URLSearchParams({
        documentName: documentData.documentName,
        createdDate: documentData.createdDate,
        pdfUrl: documentData.pdfUrl || '',
      })

      // formId가 있으면 추가
      if (formId) {
        params.set('formId', formId.toString())
      }

      router.push(`/new/ai?${params.toString()}`)
    } else {
      router.push('/new/ai')
    }
  }

  const handleDownload = async () => {
    if (documentData?.pdfUrl) {
      try {
        // PDF 파일을 fetch로 가져오기
        const response = await fetch(documentData.pdfUrl)
        if (!response.ok) {
          throw new Error('PDF 다운로드에 실패했습니다.')
        }

        // Blob으로 변환
        const blob = await response.blob()

        // Blob URL 생성
        const blobUrl = window.URL.createObjectURL(blob)

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = documentData.documentName || '문서.pdf'
        document.body.appendChild(link)
        link.click()

        // 정리
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)

        // 다운로드 완료 토스트 표시
        setShowToast(true)
      } catch (error) {
        console.error('PDF 다운로드 오류:', error)
        // 실패 시 기존 방식으로 시도
        const link = document.createElement('a')
        link.href = documentData.pdfUrl
        link.download = documentData.documentName || '문서.pdf'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setShowToast(true)
      }
    }
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
        <h1 className="text-[24px] font-semibold">문서 작성 완료</h1>
        <p className="text-[#9B9B9B] text-sm">
          {documentData?.documentName || '문서 제목'}
        </p>
        <p className="text-[#9B9B9B] text-sm">
          {formattedDate || '날짜 정보 없음'}
        </p>
      </div>

      {/* AI Summary Button */}
      <section className="px-15">
        <button
          className="w-full bg-[#3F4551] text-white h-[34px] rounded-[6px] flex gap-1 items-center justify-center mb-4 border border-white"
          onClick={handleAISummaryClick}
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
          {documentData?.imageUrl ? (
            <Image
              src={documentData.imageUrl}
              alt="문서 미리보기"
              width={300}
              height={424}
              className="w-full h-auto"
            />
          ) : (
            <div className="w-full aspect-[7/10] bg-white" />
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
          disabled={!documentData?.pdfUrl}
        >
          문서 다운로드
        </Button>
        <Button className="h-[48px] text-sm" onClick={handleHomeClick}>
          홈으로
        </Button>
      </section>
    </main>
  )
}
