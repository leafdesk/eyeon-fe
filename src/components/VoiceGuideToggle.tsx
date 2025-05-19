'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAtom } from 'jotai'
import { voiceGuideAtom } from '@/atoms/userSettingsAtom'

export default function VoiceGuideToggle() {
  const [voiceEnabled, setVoiceEnabled] = useAtom(voiceGuideAtom)
  const [isClient, setIsClient] = useState(false)

  // 클라이언트 렌더링 확인
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 클라이언트 렌더링이 완료되기 전까지는 빈 div 표시
  if (!isClient) {
    return <div className="w-7 h-7" />
  }

  return (
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
  )
}
