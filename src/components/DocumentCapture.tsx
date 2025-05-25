import { Button } from '@/components/ui/button'
import { ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import VoiceGuideToggle from './VoiceGuideToggle'
import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import api from '@/lib/api'
import { useRouter, usePathname } from 'next/navigation'

export default function DocumentCapture({
  onNext,
  onCancel,
  onCapture,
}: {
  onNext: () => void
  onCancel: () => void
  onCapture: (file: File) => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [streamActive, setStreamActive] = useState(false)
  const [frameRect, setFrameRect] = useState<DOMRect | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 네모 UI 테두리 두께와 border-radius 값
  const borderWidth = 4
  const borderRadius = 6
  // Content 영역을 위로 올리는 오프셋 값
  const contentOffsetY = -50

  // 프레임 크기 측정 - useLayoutEffect 사용하여 DOM 업데이트 후 즉시 실행
  useLayoutEffect(() => {
    // 프레임 위치와 크기 업데이트 함수
    const updateFrameRect = () => {
      if (frameRef.current) {
        // getBoundingClientRect는 viewport 기준 위치를 반환
        const rect = frameRef.current.getBoundingClientRect()
        setFrameRect(rect)
      }
    }

    // 초기 업데이트
    updateFrameRect()

    // 리사이즈 이벤트 처리
    window.addEventListener('resize', updateFrameRect)

    // 스크롤 이벤트도 처리
    window.addEventListener('scroll', updateFrameRect)

    return () => {
      window.removeEventListener('resize', updateFrameRect)
      window.removeEventListener('scroll', updateFrameRect)
    }
  }, [])

  // 카메라 스트림 초기화
  useEffect(() => {
    let stream: MediaStream | null = null

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setStreamActive(true)
        }
      } catch (err) {
        console.error('카메라 접근 실패:', err)
      }
    }

    initCamera()

    // 컴포넌트 언마운트 시 스트림 정리
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      setStreamActive(false)
    }
  }, [])

  // 사진 촬영 함수 - 화면 탭 시 호출
  const takePicture = async () => {
    if (!videoRef.current || !canvasRef.current || !streamActive || isLoading)
      return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // 비디오 크기에 맞게 캔버스 설정
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // 캔버스에 현재 비디오 프레임 그리기
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // 이미지를 파일로 변환
    canvas.toBlob(
      async (blob) => {
        if (blob) {
          const file = new File([blob], 'document.jpg', { type: 'image/jpeg' })

          try {
            setIsLoading(true)

            // AI 스캔 API 호출
            const response = await api.ai.scan(file)
            console.log('AI 스캔 성공:', response.data)

            // 현재 경로에 따라 적절한 페이지로 이동
            const scanData = response.data

            if (pathname.includes('/new')) {
              // /new에서 온 경우 -> /new/upload로 이동
              router.push('/new/upload', {
                state: { scanData, originalFile: file },
              })
            } else if (pathname.includes('/analyze')) {
              // /analyze에서 온 경우 -> /analyze/upload로 이동
              router.push('/analyze/upload', {
                state: { scanData, originalFile: file },
              })
            }
          } catch (error) {
            console.error('AI 스캔 실패:', error)
            // 에러 발생 시에도 원본 파일은 전달
            onCapture(file)
          } finally {
            setIsLoading(false)
          }
        }
      },
      'image/jpeg',
      0.95,
    )
  }

  return (
    <main
      className="flex flex-col min-h-screen relative overflow-hidden"
      onClick={!isLoading ? takePicture : undefined}
    >
      {/* 카메라 비디오 배경 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute w-full h-full object-cover"
      />

      {/* 숨겨진 캔버스 (사진 촬영용) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 어두운 오버레이 - 네모 영역만 투명하게 */}
      <div className="absolute inset-0 z-[1]">
        {frameRect ? (
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="document-mask">
                <rect width="100%" height="100%" fill="white" />
                {/* 
                  투명 영역에도 contentOffsetY 적용
                  테두리 두께를 고려하여 실제 투명 영역을 계산 
                */}
                <rect
                  x={frameRect.left + borderWidth / 2}
                  y={frameRect.top + borderWidth / 2}
                  width={frameRect.width - borderWidth}
                  height={frameRect.height - borderWidth}
                  rx={borderRadius}
                  ry={borderRadius}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.6)"
              mask="url(#document-mask)"
            />
          </svg>
        ) : (
          <div className="w-full h-full bg-black/60" />
        )}
      </div>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 z-[20] bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg font-medium">문서를 분석하고 있습니다...</p>
          </div>
        </div>
      )}

      {/* UI 레이어 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <section className="w-full fixed top-0 flex items-center justify-between h-[56px] px-5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation() // 버블링 방지
              onCancel()
            }}
          >
            <Image src="/icons/header_x.svg" alt="x" width={28} height={28} />
          </button>
          <h1 className="font-semibold text-[20px] text-white">문서 촬영</h1>
          <VoiceGuideToggle />
        </section>

        <div className="h-[56px]" />

        {/* Content - 위로 올리기 위해 transform 사용 */}
        <div
          ref={containerRef}
          className="flex-1 flex flex-col items-center justify-center px-5 relative"
          style={{ transform: `translateY(${contentOffsetY}px)` }}
        >
          {/* Document frame - z-index를 높여서 오버레이 위에 표시, 3/4 비율 유지 */}
          <div
            ref={frameRef}
            className="w-full aspect-[3/4] border-4 border-white rounded-[6px] max-w-[375px] relative z-[2]"
          >
            {/* 문서 프레임 내부는 투명하게 처리 */}
            <div className="absolute inset-0 bg-transparent"></div>
          </div>

          {/* Instruction text */}
          <p className="text-lg font-normal text-center mt-8 text-white">
            문서를 사각형 모양 안에 맞춰주세요.
          </p>
        </div>

        {/* Next */}
        <section className="fixed bottom-0 px-5 pb-8 w-full space-y-5">
          <div
            onClick={(e) => {
              e.stopPropagation() // 버블링 방지
              onNext()
            }}
            className="flex items-center justify-center text-white text-sm font-semibold"
          >
            직접 입력할래요 <ChevronRight size={16} />
          </div>
        </section>
      </div>
    </main>
  )
}
