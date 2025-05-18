'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface Voice {
  name: string
  lang: string
  voiceURI: string
}

export default function BackupTTS() {
  const [text, setText] = useState<string>(
    '안녕하세요. 음성 합성 테스트입니다.',
  )
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(1)
  const [rate, setRate] = useState<number>(1)
  const [pitch, setPitch] = useState<number>(1)
  const [isPermissionGranted, setIsPermissionGranted] = useState<
    boolean | null
  >(null)

  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis

      // 음성 목록을 가져오는 함수
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || []

        // 한국어 음성을 우선 정렬
        const sortedVoices = [...availableVoices].sort((a, b) => {
          if (a.lang.includes('ko') && !b.lang.includes('ko')) return -1
          if (!a.lang.includes('ko') && b.lang.includes('ko')) return 1
          return 0
        })

        const voicesList = sortedVoices.map((voice) => ({
          name: voice.name,
          lang: voice.lang,
          voiceURI: voice.voiceURI,
        }))

        setVoices(voicesList)

        // 한국어 음성이 있으면 기본으로 선택
        const koreanVoice = voicesList.find((v) => v.lang.includes('ko'))
        if (koreanVoice) {
          setSelectedVoice(koreanVoice.voiceURI)
        } else if (voicesList.length > 0) {
          setSelectedVoice(voicesList[0].voiceURI)
        }
      }

      // 음성 목록이 변경될 때 이벤트 리스너
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices
      }

      loadVoices()

      // 오디오 권한 확인 (마이크 권한을 확인하는 것이 간접적인 방법)
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setIsPermissionGranted(true)
        })
        .catch(() => {
          setIsPermissionGranted(false)
        })

      // 정리 함수
      return () => {
        if (synthRef.current?.speaking) {
          synthRef.current.cancel()
        }
      }
    }
  }, [])

  // 음성 합성 시작 함수
  const handleSpeak = () => {
    if (!synthRef.current) return

    // 이미 말하고 있다면 중지
    if (synthRef.current.speaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    // 선택된 음성 설정
    const voice = voices.find((v) => v.voiceURI === selectedVoice)
    if (voice) {
      const synthVoice = synthRef.current
        .getVoices()
        .find((v) => v.voiceURI === voice.voiceURI)
      if (synthVoice) utterance.voice = synthVoice
    }

    // 음성 매개변수 설정
    utterance.volume = volume
    utterance.rate = rate
    utterance.pitch = pitch

    // 이벤트 리스너 설정
    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = (event) => {
      console.error('TTS 오류:', event)
      toast.error('음성 합성 중 오류가 발생했습니다.')
      setIsSpeaking(false)
    }

    // 음성 합성 시작
    synthRef.current.speak(utterance)
  }

  // 일시 정지/재개 토글
  const togglePause = () => {
    if (!synthRef.current) return

    if (synthRef.current.speaking) {
      if (isPaused) {
        synthRef.current.resume()
      } else {
        synthRef.current.pause()
      }
      setIsPaused(!isPaused)
    }
  }

  // 권한 요청
  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsPermissionGranted(true)
      toast.success('오디오 권한이 허용되었습니다.')
    } catch (error) {
      console.error('오디오 권한 오류:', error)
      toast.error('오디오 권한이 거부되었습니다.')
      setIsPermissionGranted(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">텍스트 음성 변환(TTS) 테스트</h1>

      {isPermissionGranted === false && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                오디오 권한이 필요합니다. 브라우저에서 마이크 권한을
                허용해주세요.
              </p>
              <div className="mt-2">
                <Button onClick={requestPermission} variant="sub">
                  권한 요청
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="tts-text" className="block text-sm font-medium">
            텍스트 입력
          </label>
          <div className="flex items-start gap-2">
            <textarea
              id="tts-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[100px] px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="음성으로 변환할 텍스트를 입력하세요."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="voice-select" className="block text-sm font-medium">
            음성 선택
          </label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {voices.length === 0 ? (
              <option value="">로드 중...</option>
            ) : (
              voices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="volume" className="block text-sm font-medium">
              볼륨: {volume.toFixed(1)}
            </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="rate" className="block text-sm font-medium">
              속도: {rate.toFixed(1)}
            </label>
            <input
              id="rate"
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="pitch" className="block text-sm font-medium">
              피치: {pitch.toFixed(1)}
            </label>
            <input
              id="pitch"
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleSpeak}
            disabled={!isPermissionGranted || !text.trim()}
            className={isSpeaking ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {isSpeaking ? '중지' : '음성 합성'}
          </Button>

          <Button onClick={togglePause} disabled={!isSpeaking} variant="sub">
            {isPaused ? '계속하기' : '일시정지'}
          </Button>
        </div>
      </div>
    </div>
  )
}
