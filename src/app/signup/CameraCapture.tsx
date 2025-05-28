import { Button } from '@/components/ui/button'
import { ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import api from '@/lib/api'
import { ResidentResponseData } from '@/lib/api-types'
import { useSetAtom } from 'jotai'
import { residentInfoAtom, signupFormAtom } from '@/atoms/residentInfoAtom'

export default function CameraCapture({
  onNext,
  onCancel,
  onCapture,
}: {
  onNext: () => void
  onCancel: () => void
  onCapture: (file: File) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [streamActive, setStreamActive] = useState(false)
  const [frameRect, setFrameRect] = useState<DOMRect | null>(null)
  // Jotai atom setter
  const setResidentInfo = useSetAtom(residentInfoAtom)
  const setSignupForm = useSetAtom(signupFormAtom)
  // 네모 UI 테두리 두께와 border-radius 값
  const borderWidth = 4
  const borderRadius = 6
  // Content 영역을 위로 올리는 오프셋 값
  const contentOffsetY = -100 // 원하는 만큼 조정 가능

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
  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current || !streamActive || !frameRect)
      return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // 비디오의 실제 크기와 화면에 표시되는 크기
    const videoActualWidth = video.videoWidth
    const videoActualHeight = video.videoHeight
    const videoDisplayWidth = video.offsetWidth
    const videoDisplayHeight = video.offsetHeight

    // object-cover로 인한 비디오의 실제 표시 영역 계산
    const videoAspectRatio = videoActualWidth / videoActualHeight
    const displayAspectRatio = videoDisplayWidth / videoDisplayHeight

    let scaledVideoWidth, scaledVideoHeight, offsetX, offsetY

    if (videoAspectRatio > displayAspectRatio) {
      // 비디오가 가로로 잘림
      scaledVideoHeight = videoDisplayHeight
      scaledVideoWidth = videoDisplayHeight * videoAspectRatio
      offsetX = (scaledVideoWidth - videoDisplayWidth) / 2
      offsetY = 0
    } else {
      // 비디오가 세로로 잘림
      scaledVideoWidth = videoDisplayWidth
      scaledVideoHeight = videoDisplayWidth / videoAspectRatio
      offsetX = 0
      offsetY = (scaledVideoHeight - videoDisplayHeight) / 2
    }

    // 프레임 영역의 비디오 내 실제 좌표 계산
    const scaleX = videoActualWidth / scaledVideoWidth
    const scaleY = videoActualHeight / scaledVideoHeight

    // 비디오 엘리먼트의 화면상 위치
    const videoRect = video.getBoundingClientRect()

    // 프레임 영역의 비디오 내 상대적 위치 계산
    const frameRelativeX = frameRect.left - videoRect.left + offsetX
    const frameRelativeY = frameRect.top - videoRect.top + offsetY

    // 실제 비디오 해상도에서의 좌표
    const cropX = frameRelativeX * scaleX
    const cropY = frameRelativeY * scaleY
    const cropWidth = frameRect.width * scaleX
    const cropHeight = frameRect.height * scaleY

    // 캔버스를 프레임 크기로 설정
    canvas.width = cropWidth
    canvas.height = cropHeight

    // 프레임 영역만 잘라서 캔버스에 그리기
    context.drawImage(
      video,
      cropX,
      cropY,
      cropWidth,
      cropHeight, // 소스 영역 (잘라낼 부분)
      0,
      0,
      cropWidth,
      cropHeight, // 대상 영역 (캔버스 전체)
    )

    // 이미지를 파일로 변환
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'id-card.jpg', { type: 'image/jpeg' })

          console.log('실제 캡처된 이미지로 API 호출 시작')
          console.log('캡처 영역:', { cropX, cropY, cropWidth, cropHeight })

          api.auth
            .getResidentInfo(file)
            .then((response) => {
              console.log('주민등록증 인식 성공:', response.data)

              // 실제 API 응답 데이터 사용
              const residentData = response.data.data

              // 인식된 데이터 저장
              setResidentInfo(residentData)

              // 회원가입 폼에 필요한 데이터 설정
              setSignupForm({
                name: residentData.name,
                residentNumber: residentData.residentNumber,
                address: residentData.address,
                detailAddress: '',
                phoneNumber: '',
                email: '',
              })

              // API 호출이 성공했을 때만 onCapture 호출
              onCapture(file)
            })
            .catch((error) => {
              console.error('주민등록증 인식 실패:', error)
              // API 실패 시에는 onCapture를 호출하지 않음
            })
        }
      },
      'image/jpeg',
      0.95,
    )
  }

  return (
    <main
      className="flex flex-col min-h-screen relative overflow-hidden"
      onClick={takePicture}
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
              <mask id="card-mask">
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
              mask="url(#card-mask)"
            />
          </svg>
        ) : (
          <div className="w-full h-full bg-black/60" />
        )}
      </div>

      {/* UI 레이어 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <section className="w-full fixed top-0 flex items-center justify-between h-[56px] px-5 z-10">
          <div className="w-6 h-6" />
          <h1 className="font-semibold text-[20px] text-white">신분증 촬영</h1>
          <button
            onClick={(e) => {
              e.stopPropagation() // 버블링 방지
              onCancel()
            }}
          >
            <X size={24} color="white" />
          </button>
        </section>

        <div className="h-[56px]" />

        {/* Content - 위로 올리기 위해 transform 사용 */}
        <div
          ref={containerRef}
          className="flex-1 flex flex-col items-center justify-center px-5 relative"
          style={{ transform: `translateY(${contentOffsetY}px)` }}
        >
          {/* Instruction text */}
          <p className="text-lg font-normal text-center mb-8 text-white">
            신분증을 사각형 모양 안에 맞춰주세요.
          </p>

          {/* ID card frame - z-index를 높여서 오버레이 위에 표시 */}
          <div
            ref={frameRef}
            className="w-full aspect-[3/2] border-4 border-white rounded-[6px] max-w-[375px] relative z-[2]"
          >
            {/* ID 카드 프레임 내부는 투명하게 처리 */}
            <div className="absolute inset-0 bg-transparent"></div>
          </div>
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
