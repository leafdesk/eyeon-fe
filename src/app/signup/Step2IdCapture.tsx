import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { ChevronRight, ArrowLeft, X } from 'lucide-react'
import Image from 'next/image'
import { SetStateAction } from 'react'

import { Dispatch } from 'react'

interface Props {
  state: {
    userType: 'regular' | 'visuallyImpaired' | null
    voiceGuidance: boolean
  }
  setState: Dispatch<SetStateAction<any>>
  onPrev: () => void
  onNext: () => void
  onStartCapture: () => void
}

export default function Step2IdCapture({
  state,
  setState,
  onPrev,
  onNext,
  onStartCapture,
}: Props) {
  return (
    <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header
        title="회원가입"
        left={
          <button onClick={onPrev}>
            <Image
              src="/icons/header_back.svg"
              alt="x"
              width={28}
              height={28}
            />
          </button>
        }
        right={
          <button>
            <Image src="/icons/header_x.svg" alt="x" width={28} height={28} />
          </button>
        }
      />
      {/* <section className="w-full fixed top-0 flex items-center justify-between h-[56px] px-5">
        <button onClick={onPrev}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-semibold text-[20px]">회원가입</h1>
        <button>
          <X size={24} />
        </button>
      </section> */}

      <div className="h-[56px]" />

      {/* Main text */}
      <div className="text-center pt-8 mb-6">
        <h1 className="text-[28px] font-semibold mb-3">
          신분증 촬영 <span className="text-[#FFD700]">한 번</span>으로
          <br />
          끝나는 간편 회원가입!
        </h1>
        <p className="text-sm text-[#9B9B9B]">
          신분증 촬영을 통해
          <br />내 정보를 간편하게 입력해 보세요!
        </p>
      </div>

      {/* Camera icon */}
      <div className="w-full flex items-center justify-center">
        <Image
          src="/images/signup_camera.png"
          alt="camera"
          width={300}
          height={300}
        />
      </div>

      {/* Next */}
      <section className="fixed bottom-0 px-5 pb-8 w-full space-y-5">
        <Button onClick={onStartCapture}>사진 촬영으로 간편 입력하기</Button>

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
