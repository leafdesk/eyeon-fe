'use client'

import { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'
import { X } from 'lucide-react'
import Header from '@/components/Header'
import { useAtom } from 'jotai'
import { voiceGuideAtom } from '@/atoms/userSettingsAtom'

interface Props {
  state: {
    userType: 'regular' | 'visuallyImpaired' | null
  }
  setState: Dispatch<SetStateAction<any>>
  onNext: () => void
}

export default function Step1UserType({ state, setState, onNext }: Props) {
  const { userType } = state
  const [voiceGuidance, setVoiceGuidance] = useAtom(voiceGuideAtom)

  const handleUserTypeChange = (type: 'regular' | 'visuallyImpaired') => {
    setState((prev: any) => ({ ...prev, userType: type }))
  }

  // Voice guidance is now handled by the global atom
  const handleVoiceChange = (val: boolean) => {
    setVoiceGuidance(val)
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header
        title="회원가입"
        right={
          <button>
            <Image src="/icons/header_x.svg" alt="x" width={28} height={28} />
          </button>
        }
      />

      {/* Welcome text */}
      <div className="flex flex-col gap-1 px-5 mb-8 pt-8">
        <p className="text-[#ABABAB] text-sm">
          EyeOn(아이온)에 오신 것을 환영해요!
        </p>
        <h2 className="text-[24px] text-white font-normal">
          어떤 사용자로 가입하실
          <br />
          예정이신가요?
        </h2>
      </div>

      {/* User type selection */}
      <div className="flex gap-3 px-5 mb-3">
        {(['regular', 'visuallyImpaired'] as const).map((type) => (
          <button
            key={type}
            className={`flex-1 h-[234px] rounded-[24px] gap-9 flex flex-col items-center justify-center ${
              userType === type
                ? 'ring-3 ring-white bg-white/20'
                : 'bg-[#1E2436]'
            }`}
            onClick={() => handleUserTypeChange(type)}
          >
            <Image
              src={
                type === 'regular'
                  ? userType === 'regular'
                    ? '/icons/signup_sun_selected.svg'
                    : '/icons/signup_sun.svg'
                  : userType === 'visuallyImpaired'
                  ? '/icons/signup_moon_selected.svg'
                  : '/icons/signup_moon.svg'
              }
              alt={type}
              width={60}
              height={60}
            />
            <span className="font-semibold text-base">
              {type === 'regular' ? '비장애인' : '시각 장애인'}
            </span>
          </button>
        ))}
      </div>

      {/* Voice guidance */}
      <section className="px-5">
        <div className="bg-[#1E2436] rounded-[16px] py-3 px-4 flex items-start">
          <Image
            src="/icons/signup_speaker.svg"
            alt="speaker"
            width={24}
            height={24}
            className="mr-1"
          />
          <div className="flex flex-col gap-2">
            <span className="text-white text-base font-semibold">
              음성 안내
            </span>
            <p className="text-[11px] text-[#9B9B9B]">
              미디어페이지에서 음성 안내를 변경할 수 있습니다.
            </p>
          </div>
          <Switch
            checked={voiceGuidance}
            onCheckedChange={handleVoiceChange}
            className="data-[state=checked]:bg-[#E4BD00] data-[state=checked]:border-[#E4BD00] ml-auto"
          />
        </div>
      </section>

      {/* Next */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button disabled={userType == null} onClick={onNext}>
          다음
        </Button>
      </section>
    </main>
  )
}
