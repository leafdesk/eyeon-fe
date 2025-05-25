import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, X } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { residentInfoAtom, signupFormAtom } from '@/atoms/residentInfoAtom'
import api from '@/lib/api'
import { SignUpRequest } from '@/lib/api-types'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  state: {
    userType: 'regular' | 'visuallyImpaired' | null
    idImage?: File
    formData?: {
      name: string
      email: string
      // ... 추가 필드
    }
    kakaoId?: number
    profileImageUrl?: string
    usedCamera?: boolean
  }
  setState: Dispatch<SetStateAction<any>>
  onPrev: () => void
  onNext: () => void
  onRetakePhoto?: () => void
}

export default function Step3FormAuto({
  state,
  setState,
  onPrev,
  onNext,
  onRetakePhoto,
}: Props) {
  // Jotai atom 값 가져오기
  const residentInfo = useAtomValue(residentInfoAtom)
  const signupForm = useAtomValue(signupFormAtom)

  // 라우터 가져오기
  const router = useRouter()
  // URL 파라미터 가져오기
  const searchParams = useSearchParams()

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false)

  // 로컬 폼 상태 관리
  const [formValues, setFormValues] = useState({
    address: '',
    detailAddress: '',
    residentNumber: '',
    name: '',
    phoneNumber: '',
    email: '',
  })

  // URL에서 파라미터 가져오기
  const emailParam = searchParams.get('email') || ''
  const kakaoIdParam = searchParams.get('kakaoId')
    ? Number(searchParams.get('kakaoId'))
    : undefined
  const profileImageUrlParam = searchParams.get('profileImageUrl') || ''

  // 신분증 인식 결과가 있으면 폼 자동 채우기
  useEffect(() => {
    if (signupForm) {
      setFormValues({
        address: signupForm.address || '서울 성북구 동소문로 11',
        detailAddress: signupForm.detailAddress || '상세 주소',
        residentNumber: signupForm.residentNumber || '000000-0000000',
        name: signupForm.name || '홍길동',
        phoneNumber: signupForm.phoneNumber || '',
        email: emailParam || signupForm.email || '',
      })
    } else {
      // signupForm이 없을 경우 기본값 설정
      setFormValues({
        address: '서울 성북구 동소문로 11',
        detailAddress: '상세 주소',
        residentNumber: '000000-0000000',
        name: '홍길동',
        phoneNumber: '',
        email: emailParam || '',
      })
    }
  }, [signupForm, emailParam])

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 회원가입 API 호출
  const handleSignUp = async () => {
    try {
      setIsLoading(true)

      // 필수 필드 검증
      if (
        !formValues.name ||
        !formValues.residentNumber ||
        !formValues.address ||
        !formValues.phoneNumber ||
        !formValues.email
      ) {
        alert('모든 필수 정보를 입력해주세요.')
        return
      }

      // kakaoId와 프로필 이미지가 없으면 에러
      if (!kakaoIdParam || !profileImageUrlParam) {
        alert('카카오 인증 정보가 없습니다. 처음부터 다시 시도해주세요.')
        return
      }

      // 회원가입 요청 데이터 구성
      const signUpData: SignUpRequest = {
        name: formValues.name,
        kakaoId: kakaoIdParam,
        residentNumber: formValues.residentNumber,
        residentDate: residentInfo?.residentDate || '2001-01-01',
        phoneNumber: formValues.phoneNumber,
        address:
          formValues.address +
          (formValues.detailAddress ? ` ${formValues.detailAddress}` : ''),
        email: formValues.email,
        profileImageUrl: profileImageUrlParam,
        isBlind: state.userType === 'visuallyImpaired' ? 'TRUE' : 'FALSE',
      }

      console.log('signUpData:', signUpData)
      // 회원가입 API 호출
      const response = await api.auth.signUp(signUpData)
      console.log('response:', response)

      // 응답 처리
      if (response.data.isSuccess) {
        // 토큰 저장
        if (response.data.data.token) {
          localStorage.setItem('token', response.data.data.token)
        }

        // 회원가입 성공 메시지
        alert('회원가입이 완료되었습니다.')

        // 메인 페이지로 이동
        router.push('/main')
      } else {
        // 서버에서 반환한 오류 메시지 표시
        alert(response.data.message || '회원가입 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  // 다음 단계로 이동 시 상태 저장
  const handleNext = () => {
    // 현재 폼 데이터를 상위 컴포넌트 상태에 저장
    setState((prev: any) => ({
      ...prev,
      formData: formValues,
    }))

    // 다음 단계로 이동
    onNext()
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <section className="w-full fixed top-0 flex items-center justify-between h-[56px] px-5 bg-[#0F1626] z-10">
        <button onClick={onPrev}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-semibold text-[20px]">회원가입</h1>
        <button>
          <X size={24} />
        </button>
      </section>

      <div className="h-[56px]" />

      {/* ID Card Preview */}
      <div className="px-5 pt-4 pb-6">
        <div className="bg-[#D3D3D3] rounded-lg h-32 flex items-center justify-center">
          <span className="text-gray-600 text-sm">신분증 촬영본</span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col px-5 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm mb-2">성명</label>
          <div className="relative">
            <Input
              type="text"
              name="name"
              placeholder="홍길동"
              className="w-full bg-[#1e2738] text-white p-4 pr-16 rounded-md"
              value={formValues.name}
              onChange={handleChange}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#FFD700] text-[#0F1626] px-3 py-1 rounded-[4px] font-semibold text-xs">
              수정
            </button>
          </div>
        </div>

        {/* Resident Registration Number */}
        <div>
          <label className="block text-sm mb-2">주민등록번호</label>
          <div className="relative">
            <Input
              type="text"
              name="residentNumber"
              placeholder="000000-0000000"
              className="w-full bg-[#1e2738] text-white p-4 pr-16 rounded-md"
              value={formValues.residentNumber}
              onChange={handleChange}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#FFD700] text-[#0F1626] px-3 py-1 rounded-[4px] font-semibold text-xs">
              수정
            </button>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm mb-2">주소</label>
          <div className="relative mb-3">
            <Input
              type="text"
              name="address"
              placeholder="서울 성북구 동소문로 11"
              className="w-full bg-[#1e2738] text-white p-4 pr-16 rounded-md"
              value={formValues.address}
              onChange={handleChange}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#FFD700] text-[#0F1626] px-3 py-1 rounded-[4px] font-semibold text-xs">
              수정
            </button>
          </div>
          <Input
            type="text"
            name="detailAddress"
            placeholder="상세 주소"
            className="w-full bg-[#1e2738] text-white p-4 rounded-md"
            value={formValues.detailAddress}
            onChange={handleChange}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm mb-2">휴대폰 번호</label>
          <Input
            type="tel"
            name="phoneNumber"
            placeholder="010-0000-0000"
            className="w-full bg-[#1e2738] text-white p-4 rounded-md"
            value={formValues.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {/* Issue Date */}
        <div>
          <label className="block text-sm mb-2">발급일자</label>
          <div className="relative">
            <Input
              type="text"
              name="issueDate"
              placeholder="0000.00.00"
              className="w-full bg-[#1e2738] text-white p-4 pr-16 rounded-md"
              value="0000.00.00"
              readOnly
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#FFD700] text-[#0F1626] px-3 py-1 rounded-[4px] font-semibold text-xs">
              수정
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <section className="px-5 py-6 space-y-3">
        <Button
          onClick={onRetakePhoto}
          className="w-full bg-[#2A3441] text-white border border-gray-600 hover:bg-[#3A4451]"
        >
          다시 찍을래요
        </Button>
        <Button
          onClick={handleSignUp}
          disabled={isLoading}
          className="w-full bg-[#FFD700] text-[#0F1626] hover:bg-[#E6C200]"
        >
          {isLoading ? '처리 중...' : '다음'}
        </Button>
      </section>
    </main>
  )
}
