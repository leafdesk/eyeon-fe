'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CustomToast from '@/components/CustomToast'

// 문서 응답 데이터 타입 정의
interface DocumentData {
  id: number
  documentName: string
  createdAt: string
  imageUrl: string
  pdfUrl: string
}

export default function NewCompletePage() {
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)
  const [documentData, setDocumentData] = useState<DocumentData | null>(null)
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    // 로컬 스토리지에서 문서 데이터 가져오기
    const storedData = localStorage.getItem('documentData')
    if (storedData) {
      const data = JSON.parse(storedData) as DocumentData
      setDocumentData(data)

      // 날짜 포맷팅 (YYYY. MM. DD)
      if (data.createdAt) {
        const date = new Date(data.createdAt)
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
    router.push('/main')
  }

  const handleDownload = () => {
    if (documentData?.pdfUrl) {
      // PDF 다운로드 링크 생성 및 클릭
      const link = document.createElement('a')
      link.href = documentData.pdfUrl
      link.download = documentData.documentName || '문서.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 다운로드 완료 토스트 표시
      setShowToast(true)
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
          onClick={() => router.push('/new/ai')}
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
