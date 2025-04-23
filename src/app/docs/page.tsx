import Header from '@/components/Header'

/**
 * 문서 보관함 페이지.
 */
export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/main" title="문서 보관함" right="voice" />
    </main>
  )
}
