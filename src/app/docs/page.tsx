'use client'

import Header from '@/components/Header'
import DocItem from './DocItem'

// 문서 데이터
const documents = [
  {
    id: 1,
    category: '근로계약서',
    title: '문서 이름',
    date: '0000.00.00',
    size: '00.0MB',
  },
  {
    id: 2,
    category: '근로계약서',
    title: '문서 이름',
    date: '0000.00.00',
    size: '00.0MB',
  },
  {
    id: 3,
    category: '이력서',
    title: '문서 이름',
    date: '0000.00.00',
    size: '00.0MB',
  },
  {
    id: 4,
    category: '임대차계약서',
    title: '문서 이름',
    date: '0000.00.00',
    size: '00.0MB',
  },
  {
    id: 5,
    category: '택배송장',
    title: '문서 이름',
    date: '0000.00.00',
    size: '00.0MB',
  },
]

/**
 * 문서 보관함 페이지.
 */
export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/main" title="문서 보관함" right="voice" />

      {/* Document List */}
      <div className="px-5 pt-6 pb-20 space-y-3">
        {documents.map((doc) => (
          <DocItem
            key={doc.id}
            id={doc.id}
            category={doc.category}
            title={doc.title}
            date={doc.date}
            size={doc.size}
          />
        ))}
      </div>
    </main>
  )
}
