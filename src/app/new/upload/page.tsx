import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import VoiceGuideToggle from '@/components/VoiceGuideToggle'
import { FileText } from 'lucide-react'

export default function NewUploadPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header
        title="문서 업로드"
        left="/new"
        leftIconType="x"
        right={<VoiceGuideToggle />}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full bg-[#1e2738] rounded-2xl p-6">
          <p className="text-lg font-semibold text-center mb-5">
            작성할 문서를 업로드해 주세요
          </p>

          <button className="w-full bg-[#FFD700] text-black py-4 rounded-[12px] flex flex-col items-center justify-center">
            <FileText size={24} className="mb-1" />
            <span>문서 업로드</span>
          </button>
        </div>
      </div>

      {/* Bottom Button */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button>다음</Button>
      </section>
    </main>
  )
}
