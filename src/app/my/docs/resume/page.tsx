'use client'

import Header from '@/components/Header'
import MyDocItem from '../MyDocItem'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { FormData } from '@/lib/api-types'
import { FORM_TYPES } from '@/lib/constants'

export default function ResumePage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<FormData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // API에서 이력서 목록 가져오기
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await api.form.getList(FORM_TYPES.RESUME)

        if (response.data.isSuccess) {
          setDocuments(response.data.data)
        } else {
          setError(
            response.data.message || '데이터를 불러오는 데 실패했습니다.',
          )
        }
      } catch (err) {
        console.error('이력서 목록 조회 오류:', err)
        setError('이력서 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleDocClick = (id: number) => {
    router.push(`/my/docs/resume/${id}`)
  }

  // 파일 크기를 MB 단위로 변환하는 함수
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(1) + 'MB'
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/my/docs" title="내 문서 양식" right="voice" />

      {/* Title */}
      <div className="px-6 pt-9 pb-6">
        <h1 className="text-[28px] font-semibold">이력서</h1>
      </div>

      {/* Document List */}
      <div className="space-y-3 px-5">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-400">{error}</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            문서가 없습니다.
          </div>
        ) : (
          documents.map((doc) => (
            <MyDocItem
              key={doc.formId}
              title={doc.name}
              date={formatDate(doc.createdAt)}
              size={formatFileSize(doc.formSize)}
              onClick={() => handleDocClick(doc.formId)}
            />
          ))
        )}
      </div>

      {/* blank */}
      <div className="h-[80px]" />
    </main>
  )
}
