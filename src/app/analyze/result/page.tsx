'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import VoiceGuideToggle from '@/components/VoiceGuideToggle'
import AnalysisCard from '../AnalysisCard'
import { useRouter } from 'next/navigation'

// 분석 결과 데이터 (실제로는 API에서 받아올 수 있음)
const analysisResults = [
  {
    id: 1,
    title: '문서 추출 내용',
    feedback:
      '땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님,',
  },
  {
    id: 2,
    title:
      '문서 추출 내용 (두 줄 이상인 경우) 문서 추출 내용 (두 줄 이상인 경우)',
    feedback:
      '땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님,',
  },
  {
    id: 3,
    title: '문서 추출 내용',
    feedback:
      '땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님,',
  },
  {
    id: 4,
    title:
      '문서 추출 내용 (두 줄 이상인 경우) 문서 추출 내용 (두 줄 이상인 경우)',
    feedback:
      '땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님,',
  },
  {
    id: 5,
    title: '문서 추출 내용',
    feedback:
      '땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님,',
  },
  {
    id: 6,
    title:
      '문서 추출 내용 (두 줄 이상인 경우) 문서 추출 내용 (두 줄 이상인 경우)',
    feedback:
      '땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님,',
  },
  {
    id: 7,
    title: '문서 추출 내용',
    feedback:
      '땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님,',
  },
  {
    id: 8,
    title:
      '문서 추출 내용 (두 줄 이상인 경우) 문서 추출 내용 (두 줄 이상인 경우)',
    feedback:
      '땅은 밭을 세워 우는 별들은 부끄러운 이름을 슬퍼하는 까닭입니다. 별 하나에 추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별 하나에 시와 별 하나에 어머니, 어머니, 어머님,',
  },
]

export default function AnalyzeResultPage() {
  const router = useRouter()

  return (
    <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header
        title="문서 분석 결과"
        left="/analyze/upload"
        right={<VoiceGuideToggle />}
      />

      {/* Title */}
      <div className="p-6">
        <h1 className="text-[24px] font-normal">
          주의가 필요한 항목{' '}
          <strong className="text-[#FFD700] font-semibold">
            {analysisResults.length}개
          </strong>
          가
          <br />
          감지되었습니다.
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 px-5 overflow-y-auto pb-[80px]">
        <div className="space-y-3">
          {analysisResults.map((result) => (
            <AnalysisCard
              key={result.id}
              title={result.title}
              feedback={result.feedback}
            />
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full bg-[#0F1626]">
        <Button onClick={() => router.push('/analyze/edit')}>
          문서 수정하기
        </Button>
      </section>
    </main>
  )
}
