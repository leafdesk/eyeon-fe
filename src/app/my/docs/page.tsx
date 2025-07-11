'use client'

import Header from '@/components/Header'
import DocTemplateOption from './DocTemplateOption'
import { useRouter } from 'next/navigation'
import { useVoiceGuide } from '@/hooks/useVoiceGuide'

// 문서 양식 데이터
const docTemplates = [
  { id: 1, title: '이력서', route: '/my/docs/resume' },
  { id: 2, title: '재직증명서', route: '/my/docs/certificate' },
  { id: 3, title: '위임장', route: '/my/docs/consent' },
  { id: 4, title: '자기소개서', route: '/my/docs/self-intro' },
  { id: 5, title: '일일업무일지', route: '/my/docs/report' },
]

export default function MyDocsPage() {
  const router = useRouter()
  const { VoiceGuideComponent } = useVoiceGuide(
    '내 문서 양식 페이지입니다. 저장된 문서 양식들을 카테고리별로 확인할 수 있습니다. 이력서, 재직증명서, 위임장, 자기소개서, 일일업무일지 양식이 있습니다.',
  )

  const handleTemplateClick = (route: string) => {
    router.push(route)
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/my" title="내 문서 양식" right="voice" />

      {/* Voice Guide Component */}
      {VoiceGuideComponent}

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
