'use client'

import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { voiceGuideAtom } from '@/atoms/userSettingsAtom'
import { TTSOverlay } from '@/app/test/tts/TTSOverlay'

/**
 * 음성 안내를 위한 커스텀 훅
 * @param text 음성 안내 메시지 (기본값 제공)
 * @returns VoiceGuideComponent - 음성 안내 오버레이 컴포넌트
 */
export function useVoiceGuide(
  text: string = 'Eye On에 오신 것을 환영합니다. 필요한 기능을 선택해 주세요.',
) {
  const [voiceGuideEnabled] = useAtom(voiceGuideAtom)
  const [showOverlay, setShowOverlay] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // 클라이언트 환경 확인 및 하이드레이션 완료 확인
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 컴포넌트 마운트 시 오버레이 표시
  useEffect(() => {
    setShowOverlay(true)
    return () => setShowOverlay(false)
  }, [])

  return {
    VoiceGuideComponent:
      isClient && voiceGuideEnabled && showOverlay ? (
        <TTSOverlay text={text} />
      ) : null,
  }
}
