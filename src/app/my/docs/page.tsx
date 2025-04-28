'use client'

import Header from '@/components/Header'
import DocTemplateOption from './DocTemplateOption'
import { useRouter } from 'next/navigation'

// 문서 양식 데이터
const docTemplates = [
  { id: 1, title: '이력서', route: '/my/docs/resume' },
  { id: 2, title: '근로계약서', route: '/my/docs/employment' },
  { id: 3, title: '택배송장', route: '/my/docs/delivery' },
  { id: 4, title: '임대차계약서', route: '/my/docs/lease' },
]

export default function MyDocsPage() {
  const router = useRouter()

  const handleTemplateClick = (route: string) => {
    router.push(route)
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/my" title="내 문서 양식" right="voice" />

      {/* Title */}
      <div className="px-6 pt-9 pb-6">
        <h1 className="text-[28px] font-semibold">
          내 문서 양식을
          <br />
          선택해주세요
        </h1>
      </div>

      {/* Document Template Options */}
      <div className="space-y-3 px-5">
        {docTemplates.map((template) => (
          <DocTemplateOption
            key={template.id}
            title={template.title}
            onClick={() => handleTemplateClick(template.route)}
          />
        ))}
      </div>
    </main>
  )
}
