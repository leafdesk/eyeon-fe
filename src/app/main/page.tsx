'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import Header from '@/components/Header'
import { useVoiceGuide } from '@/hooks/useVoiceGuide'
import {
  userInfoAtom,
  userInfoLoadingAtom,
  userInfoErrorAtom,
} from '@/atoms/userAtom'
import api from '@/lib/api'

export default function MainPage() {
  const router = useRouter()
  const { VoiceGuideComponent } = useVoiceGuide(
    '메인 페이지입니다. 메뉴 좌측 상단은 문서 작성, 우측 상단은 문서 분석, 좌측 하단은 문서 보관함, 우측 하단은 마이페이지입니다.',
  )

  const [userInfo, setUserInfo] = useAtom(userInfoAtom)
  const [isLoading, setIsLoading] = useAtom(userInfoLoadingAtom)
  const [error, setError] = useAtom(userInfoErrorAtom)

  // 사용자 정보 가져오기
  useEffect(() => {
    // localStorage 초기화 (token과 voiceGuideEnabled 제외)
    const cleanupLocalStorage = () => {
      const keysToRemove = [
        'documentData',
        'documentInfo',
        'modifiedData',
        'adviceData',
        'documentId',
        'analyzedFields',
        'scanData',
      ]

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })
    }

    const fetchUserInfo = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await api.user.getInfo()

        if (response.data.isSuccess) {
          setUserInfo(response.data.data)
        } else {
          setError(
            response.data.message || '사용자 정보를 가져오는데 실패했습니다.',
          )
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error)
        setError('사용자 정보를 가져오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    // localStorage 초기화 실행
    cleanupLocalStorage()

    fetchUserInfo()
  }, [setUserInfo, setIsLoading, setError])

  return (
    <div className="min-h-screen bg-[#0e1525] text-white">
      {/* Header */}
      <Header
        left={
          <Image
            src="/images/main_logo.svg"
            alt="Eye On"
            width={116}
            height={32}
          />
        }
        right="voice"
      />

      {/* Voice Guide Component */}
      {VoiceGuideComponent}

      {/* Greeting */}
      <div className="text-white mt-7 mb-10 px-5">
        <h1 className="text-[24px] mb-0.5">
          <strong className="font-semibold">
            {isLoading
              ? '로딩 중...'
              : error
              ? '사용자'
              : userInfo?.username || '사용자'}
          </strong>
          님
        </h1>
        <p className="text-[20px] font-normal">어떤 서비스를 찾고 계신가요?</p>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-2 gap-3 px-5">
        {/* Document Creation */}
        <div
          onClick={() => router.push('/new')}
          className="bg-[#1E2436] rounded-[12px] px-4 pb-4 flex flex-col items-center justify-center aspect-[10/15] border border-[#363C4E]"
        >
          <Image
            src="/images/main_1.png"
            alt="문서 작성"
            width={114}
            height={114}
            className="mt-10"
            priority
          />
          <span className="text-[20px] font-semibold mt-auto mr-auto">
            문서 작성
          </span>
        </div>

        {/* Document Analysis */}
        <div
          onClick={() => router.push('/analyze')}
          className="bg-[#1E2436] rounded-[12px] px-4 pb-4 flex flex-col items-center justify-center aspect-[10/15] border border-[#363C4E]"
        >
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
        <div
          onClick={() => router.push('/docs')}
          className="bg-[#1E2436] rounded-[12px] px-4 pb-4 flex flex-col items-center justify-center aspect-[10/15] border border-[#363C4E]"
        >
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
        <div
          onClick={() => router.push('/my')}
          className="bg-[#1E2436] rounded-[12px] px-4 pb-4 flex flex-col items-center justify-center aspect-[10/15] border border-[#363C4E]"
        >
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

      {/* blank */}
      <div className="h-16" />
    </div>
  )
}
