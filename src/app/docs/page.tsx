'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import DocItem from './DocItem'
import api from '@/lib/api'
import { DocumentData } from '@/lib/api-types'

/**
 * 문서 보관함 페이지.
 */
export default function DocsPage() {
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await api.document.getList()
        setDocuments(response.data.data)
      } catch (error) {
        console.error('문서 목록 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/main" title="문서 보관함" right="voice" />

      {/* Document List */}
      <div className="px-5 pt-6 pb-20 space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-40 text-gray-400">
            문서를 불러오는 중...
          </div>
        ) : documents.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-gray-400">
            보관된 문서가 없습니다.
          </div>
        ) : (
          documents.map((doc) => (
            <DocItem
              key={doc.documentId}
              id={doc.documentId}
              category={doc.documentType}
              title={doc.name}
              date={doc.createdAt}
              size={`${(doc.documentSize / 1024 / 1024).toFixed(1)}MB`}
            />
          ))
        )}
      </div>
    </main>
  )
}
