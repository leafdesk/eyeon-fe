import Header from '@/components/Header'

/**
 * 마이 페이지.
 */
export default function MyPage() {
  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/main" leftIconType="x" title="마이페이지" right="voice" />
    </main>
  )
}
