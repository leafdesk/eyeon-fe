'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useHorizontalScroll } from './hooks/use-horizontal-scroll'
import { ReactNode, useEffect, useState } from 'react'
import KakaoLoginButton from '@/components/KakaoLoginButton'

// 커스텀 타입 정의
interface OnboardingFrame {
  title: string
  description: ReactNode
  imagePath: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [windowHeight, setWindowHeight] = useState(0)

  // Onboarding data
  const onboardingFrames: OnboardingFrame[] = [
    {
      title: '누구에게나 쉬운 문서 작성',
      description: (
        <>
          시간적/공간적 장벽 없이{' '}
          <span className="font-semibold">사진 한 장</span>이면,
          <br />
          장애인도 비장애인도 모두 편리하게!
        </>
      ),
      imagePath: '/images/onboarding_1.png',
    },
    {
      title: 'AI가 잡아주는 문서 분석',
      description: (
        <>
          AI 조력자 <span className="font-semibold">아이라(AIRA)</span>의<br />
          문서 분석과 세심한 오류 안내!
        </>
      ),
      imagePath: '/images/onboarding_2.png',
    },
    {
      title: '필요한 순간, 언제든지',
      description: (
        <>
          언제든지 꺼내볼 수 있도록!
          <br />내 문서를 소중히 정리해놓은{' '}
          <span className="font-semibold">문서 보관함</span>
        </>
      ),
      imagePath: '/images/onboarding_3.png',
    },
  ]

  const {
    currentFrame,
    containerRef,
    scrollToFrame,
    isFirstFrame,
    isLastFrame,
  } = useHorizontalScroll({
    totalFrames: onboardingFrames.length,
    initialFrame: 0,
  })

  // 화면 높이를 계산
  useEffect(() => {
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight)
    }

    // 초기값 설정
    updateWindowHeight()

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', updateWindowHeight)

    // 클린업 함수
    return () => {
      window.removeEventListener('resize', updateWindowHeight)
    }
  }, [])

  // Force scroll to first frame on component mount
  useEffect(() => {
    scrollToFrame(0)
  }, [])

  // Function to handle the "Start" button click
  const handleStartClick = () => {
    // Navigate to the main app
    router.push('/')
  }

  // 버튼 영역 높이 (px)
  const BUTTON_AREA_HEIGHT = 80

  return (
    <div className="h-screen flex flex-col bg-[#0F1626] relative overflow-hidden">
      {/* State indicator */}
      <div className="pt-6 flex justify-center pb-4">
        <div className="flex gap-[6px]">
          {onboardingFrames.map((_, index) => (
            <div
              key={index}
              className={`h-[6px] rounded-full transition-all cursor-pointer ${
                index === currentFrame
                  ? 'bg-white w-[20px]'
                  : 'bg-[#4D4D4D] w-[6px]'
              }`}
              onClick={() => scrollToFrame(index)}
            />
          ))}
        </div>
      </div>

      {/* Scrollable frames */}
      <div
        ref={containerRef}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {onboardingFrames.map((frame, index) => {
          return (
            <div
              key={index}
              id={`frame-${index}`}
              className="min-w-full w-full h-full flex flex-col snap-center"
              style={{ scrollSnapAlign: 'center' }}
            >
              <div className="flex flex-col text-center mb-2 flex-shrink-0 px-4">
                <h2 className="text-white text-[24px] font-semibold mb-1">
                  {frame.title}
                </h2>
                <p className="text-[#ABABAB] text-[15px] font-normal">
                  {frame.description}
                </p>
              </div>

              {/* Image content - 여백 최소화 */}
              <div className="flex-1 flex items-center justify-center pb-[80px]">
                <div
                  className="relative transition-all duration-300"
                  style={{
                    width: '100%',
                    maxWidth:
                      windowHeight < 700
                        ? '300px'
                        : windowHeight < 800
                        ? '320px'
                        : '340px',
                    height: `calc(100% - ${BUTTON_AREA_HEIGHT / 2}px)`,
                    paddingTop: '0',
                    paddingBottom: '0',
                  }}
                >
                  <Image
                    src={frame.imagePath}
                    alt={frame.title}
                    fill
                    className="object-contain object-center"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 340px"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Fixed button at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-5 py-3 z-10 bg-[#0F1626]">
        <KakaoLoginButton />
      </div>

      {/* Custom styles for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
