import { Button } from '@/components/ui/button'
import { ChevronRight, X } from 'lucide-react'

export default function CameraCapture({
  onNext,
  onCancel,
  onCapture,
}: {
  onNext: () => void
  onCancel: () => void
  onCapture: (file: File) => void
}) {
  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <section className="w-full fixed top-0 flex items-center justify-between h-[56px] px-5 z-10">
        <div className="w-6 h-6" />
        <h1 className="font-semibold text-[20px]">신분증 촬영</h1>
        <button onClick={onCancel}>
          <X size={24} />
        </button>
      </section>

      <div className="h-[56px]" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 relative -top-12">
        {/* Instruction text */}
        <p className="text-lg font-normal text-center mb-8">
          신분증을 사각형 모양 안에 맞춰주세요.
        </p>

        {/* ID card frame */}
        <div className="w-full aspect-[3/2] border-4 border-white rounded-[6px]">
          {/* Empty frame where user would position ID card */}
        </div>
      </div>

      {/* Next */}
      <section className="fixed bottom-0 px-5 pb-8 w-full space-y-5">
        <div
          onClick={onNext}
          className="flex items-center justify-center text-[#E0E0E0] text-sm font-semibold"
        >
          직접 입력할래요 <ChevronRight size={16} />
        </div>
      </section>
    </main>
  )
}
