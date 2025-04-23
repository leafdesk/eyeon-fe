'use client'

import Image from 'next/image'
import { useAtom } from 'jotai'
import { voiceGuideAtom } from '@/atoms/userSettingsAtom'

export default function VoiceGuideToggle() {
  const [voiceEnabled, setVoiceEnabled] = useAtom(voiceGuideAtom)

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
