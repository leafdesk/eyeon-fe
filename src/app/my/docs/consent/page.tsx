'use client'

import Header from '@/components/Header'
import MyDocItem from '../MyDocItem'
import { useRouter } from 'next/navigation'

// 문서 데이터 샘플
const documents = [
  {
    id: 1,
    title: '문서 이름',
    date: '0000.00.00',
    size: '00.0MB',
  },
  {
    id: 2,
    title: '문서 이름',
    date: '0000.00.00',
    size: '00.0MB',
  },
  {
    id: 3,
    title: '문서 이름',
    date: '0000.00.00',
    size: '00.0MB',
  },
]

export default function ConsentPage() {
  const router = useRouter()

  const handleDocClick = (id: number) => {
    router.push(`/my/docs/consent/${id}`)
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/my/docs" title="내 문서 양식" right="voice" />

      {/* Title */}
      <div className="px-6 pt-9 pb-6">
        <h1 className="text-[28px] font-semibold">위임장</h1>
      </div>

      {/* Document List */}
      <div className="space-y-3 px-5">
        {documents.map((doc) => (
          <MyDocItem
            key={doc.id}
            title={doc.title}
            date={doc.date}
            size={doc.size}
            onClick={() => handleDocClick(doc.id)}
          />
        ))}
      </div>

      {/* blank */}
      <div className="h-[80px]" />
    </main>
  )
}
