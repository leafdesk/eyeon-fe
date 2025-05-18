'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Square } from 'lucide-react'

interface TTSOverlayProps {
  text: string
  className?: string
  autoPlay?: boolean
}

export function TTSOverlay({
  text,
  className = '',
  autoPlay = false,
}: TTSOverlayProps) {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(true)
  const [isPermissionGranted, setIsPermissionGranted] = useState<
    boolean | null
  >(null)

  const synthRef = useRef<SpeechSynthesis | null>(null)
  const initializedRef = useRef<boolean>(false)

  // 음성 합성 시작 함수를 useCallback으로 메모이제이션
  const handleSpeak = useCallback(() => {
    if (!synthRef.current) return

    if (!isPermissionGranted) {
      console.error('오디오 권한이 필요합니다.')
      return
    }

    // 이미 말하고 있다면 중지
    if (synthRef.current.speaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    // 이벤트 리스너 설정
    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = (event) => {
      console.error('TTS 오류:', event)
      setIsSpeaking(false)
    }

    // 음성 합성 시작
    synthRef.current.speak(utterance)
  }, [isPermissionGranted, text])

  // 오버레이 클릭 핸들러
  const handleOverlayClick = useCallback(() => {
    setIsOverlayVisible(false) // 오버레이 숨기기
    handleSpeak() // TTS 시작
  }, [handleSpeak])

  // 권한 요청
  const requestPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsPermissionGranted(true)
      console.log('오디오 권한이 허용되었습니다.')
    } catch (error) {
      console.error('오디오 권한 오류:', error)
      setIsPermissionGranted(false)
    }
  }, [])

  // 브라우저 환경 및 음성 합성 초기화 (최초 1회만 실행)
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.speechSynthesis &&
      !initializedRef.current
    ) {
      initializedRef.current = true
      synthRef.current = window.speechSynthesis

      // 오디오 권한 확인
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setIsPermissionGranted(true)
          console.log('오디오 권한이 허용되었습니다.')
        })
        .catch(() => {
          setIsPermissionGranted(false)
          console.error(
            '오디오 권한이 필요합니다. 브라우저에서 마이크 권한을 허용해주세요.',
          )
        })

      // 정리 함수
      return () => {
        if (synthRef.current?.speaking) {
          synthRef.current.cancel()
        }
      }
    }
  }, [])

  // 자동 재생 처리를 위한 별도의 useEffect
  useEffect(() => {
    // 권한이 있고 autoPlay가 true인 경우에만 자동 재생
    if (isPermissionGranted === true && autoPlay && synthRef.current) {
      // 자동재생 시 오버레이를 바로 숨김
      setIsOverlayVisible(false)

      // 이미 말하고 있다면 취소 후 새로 시작
      if (synthRef.current.speaking) {
        synthRef.current.cancel()
      }

      // 약간의 딜레이 후 실행
      const timer = setTimeout(() => {
        handleSpeak()
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isPermissionGranted, autoPlay, handleSpeak])

  return (
    <>
      {isOverlayVisible && (
        <div
          onClick={handleOverlayClick}
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 ${className}`}
          style={{ touchAction: 'none' }}
        >
          <div className="text-white text-2xl font-bold text-center p-6">
            화면을 터치해주세요!
          </div>
        </div>
      )}

      {/* {isSpeaking && (
        <button
          onClick={handleSpeak}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center focus:outline-none shadow-lg transition-all bg-red-500 hover:bg-red-600 text-white z-40"
          aria-label="음성 중지"
        >
          <Square size={24} className="text-white" />
        </button>
      )} */}
    </>
  )
}
