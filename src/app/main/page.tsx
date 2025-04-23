'use client'

import Image from 'next/image'
import { useAtom } from 'jotai'
import { voiceGuideAtom } from '@/atoms/userSettingsAtom'

export default function MainPage() {
  const [voiceEnabled, setVoiceEnabled] = useAtom(voiceGuideAtom)

  return (
    <div className="min-h-screen bg-[#0e1525] text-white">
      {/* Header */}
      <div className="flex justify-between items-center h-[56px] px-5 mb-7">
        <Image
          src="/images/main_logo.svg"
          alt="Eye On"
          width={116}
          height={32}
        />
        <Image
          src={
            voiceEnabled
              ? '/icons/main_speaker_on.svg'
              : '/icons/main_speaker_off.svg'
          }
          alt="Menu"
          width={28}
          height={28}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
        />
      </div>

      {/* Greeting */}
      <div className="text-white mb-10 px-5">
        <h1 className="text-[24px] mb-0.5">
          <strong className="font-semibold">홍길동</strong>님
        </h1>
        <p className="text-[20px] font-normal">어떤 서비스를 찾고 계신가요?</p>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-2 gap-3 px-5">
        {/* Document Creation */}
        <div className="bg-[#1E2436] rounded-[12px] px-4 pb-4 flex flex-col items-center justify-center aspect-[10/15] border border-[#363C4E]">
          <Image
            src="/images/main_1.png"
            alt="문서 작성"
            width={114}
            height={114}
            className="mt-10"
          />
          <span className="text-[20px] font-semibold mt-auto mr-auto">
            문서 작성
          </span>
        </div>

        {/* Document Analysis */}
        <div className="bg-[#1E2436] rounded-[12px] px-4 pb-4 flex flex-col items-center justify-center aspect-[10/15] border border-[#363C4E]">
          <Image
            src="/images/main_2.png"
            alt="문서 분석"
            width={114}
            height={114}
            className="mt-10"
          />
          <span className="text-[20px] font-semibold mt-auto mr-auto">
            문서 분석
          </span>
        </div>

        {/* Document Storage */}
        <div className="bg-[#1E2436] rounded-[12px] px-4 pb-4 flex flex-col items-center justify-center aspect-[10/15] border border-[#363C4E]">
          <Image
            src="/images/main_3.png"
            alt="문서 보관함"
            width={114}
            height={114}
            className="mt-10"
          />
          <span className="text-[20px] font-semibold mt-auto mr-auto">
            문서 보관함
          </span>
        </div>

        {/* My Page */}
        <div className="bg-[#1E2436] rounded-[12px] px-4 pb-4 flex flex-col items-center justify-center aspect-[10/15] border border-[#363C4E]">
          <Image
            src="/images/main_4.png"
            alt="마이페이지"
            width={114}
            height={114}
            className="mt-10"
          />
          <span className="text-[20px] font-semibold mt-auto mr-auto">
            마이페이지
          </span>
        </div>
      </div>
    </div>
  )
}
