'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import CustomToast from '@/components/CustomToast'
import api from '@/lib/api'
import { FormData } from '@/lib/api-types'

export default function CertificateDocPage() {
  const router = useRouter()
  const params = useParams()
  const formId = parseInt(params.id as string, 10)

  const [document, setDocument] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)

  console.log(document)

  // API에서 문서 상세 정보 가져오기
  useEffect(() => {
    const fetchDocumentDetail = async () => {
      if (isNaN(formId)) {
        setError('유효하지 않은 문서 ID입니다.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const response = await api.form.getDetail(formId)

        if (response.data.isSuccess) {
          setDocument(response.data.data)
        } else {
          setError(
            response.data.message || '문서 정보를 불러오는 데 실패했습니다.',
          )
        }
      } catch (err) {
        console.error('문서 상세 조회 오류:', err)
        setError('문서 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocumentDetail()
  }, [formId])

  const handleDownload = () => {
    // 실제 다운로드 로직을 구현할 수 있습니다
    // 예: document?.formUrl이 있다면 해당 URL로 다운로드
    if (document?.formUrl) {
      window.open(document.formUrl, '_blank')
    }
    setShowToast(true)
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString?: string) => {
    if (!dateString) return '0000.00.00'
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  // 파일 크기를 MB 단위로 변환하는 함수
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0.0MB'
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(1) + 'MB'
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white flex flex-col">
      <CustomToast
        message="문서 다운로드 완료!"
        isVisible={showToast}
        duration={1500}
        onClose={() => setShowToast(false)}
      />

      {/* Header */}
      <Header title="내 문서 양식" right="voice" left="/my/docs/certificate" />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <>
          {/* Title */}
          <div className="text-center pt-6 pb-4">
            <h1 className="text-lg font-semibold mb-4">재직증명서</h1>
            <p className="text-white text-sm mb-1">
              {document?.name || '문서 제목'}
            </p>
            <p className="text-[#9B9B9B] text-sm">
              {formatDate(document?.createdAt)}{' '}
              <span className="mx-[4px] text-[#363C4E]">|</span>{' '}
              {formatFileSize(document?.formSize)}
            </p>
          </div>

          {/* Document Preview */}
          <section className="px-15 mb-8">
            <div className="bg-white rounded-sm flex items-center justify-center overflow-hidden">
              {document?.formUrl ? (
                <Image
                  src={document.formUrl}
                  alt="문서 미리보기"
                  width={800}
                  height={1143}
                  className="w-full aspect-[7/10] object-contain"
                />
              ) : (
                <div className="w-full aspect-[7/10] bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">
                    문서를 불러올 수 없습니다
                  </p>
                </div>
              )}
              {/* iframe 방식 (보관용) */}
              {/* {document?.formUrl ? (
                <iframe
                  src={document.formUrl}
                  className="w-full aspect-[7/10]"
                  title="문서 미리보기"
                />
              ) : (
                <div className="w-full aspect-[7/10] bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">문서를 불러올 수 없습니다</p>
                </div>
              )} */}
            </div>
          </section>

          {/* blank */}
          <div className="h-[148px]" />

          {/* Action Buttons */}
          <section className="fixed bottom-0 px-5 py-3 w-full space-y-3">
            <Button
              className="bg-[#FFD700] h-[48px] text-sm"
              onClick={handleDownload}
            >
              문서 다운로드
            </Button>
            <Button
              className="h-[48px] text-sm"
              onClick={() => router.push('/new/write')}
            >
              문서 작성하기
            </Button>
          </section>
        </>
      )}
    </main>
  )
}
