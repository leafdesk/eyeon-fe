import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  state: {
    userType: 'regular' | 'visuallyImpaired' | null
    idImage?: File
    formData?: {
      name: string
      email: string
      // ... 추가 필드
    }
  }
  setState: Dispatch<SetStateAction<any>>
  onPrev: () => void
  onNext: () => void
}

export default function Step3Form({ state, setState, onPrev, onNext }: Props) {
  return (
    <main className="flex flex-col min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <section className="w-full fixed top-0 flex items-center justify-between h-[56px] px-5">
        <button onClick={onPrev}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-semibold text-[20px]">회원가입</h1>
        <button>
          <X size={24} />
        </button>
      </section>

      <div className="h-[56px]" />

      {/* Form */}
      <div className="flex-1 flex flex-col pt-4 px-5 space-y-5">
        {/* Address */}
        <div className="">
          <label className="block text-sm mb-2">주소</label>
          <div className="relative mb-3">
            <Input
              type="text"
              placeholder="주소를 검색해 입력해 주세요"
              className="w-full bg-[#1e2738] text-gray-300 p-4 pr-20 rounded-md"
              readOnly
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#FFD700] text-[#0F1626] px-2 h-6 rounded-[4px] font-semibold text-xs">
              주소 검색
            </button>
          </div>
          <Input
            type="text"
            placeholder="상세 주소를 입력해 주세요"
            className="w-full bg-[#1e2738] text-gray-300 p-4 rounded-md"
          />
        </div>

        {/* Resident Registration Number */}
        <div className="">
          <label className="block text-sm mb-2">주민등록번호</label>
          <Input
            type="text"
            placeholder="주민등록번호를 입력해 주세요"
            className="w-full bg-[#1e2738] text-gray-300 p-4 rounded-md"
          />
        </div>

        {/* Name */}
        <div className="">
          <label className="block text-sm mb-2">성명</label>
          <Input
            type="text"
            placeholder="홍길동"
            className="w-full bg-[#1e2738] text-white p-4 rounded-md"
          />
        </div>

        {/* Phone Number */}
        <div className="">
          <label className="block text-sm mb-2">휴대폰 번호</label>
          <Input
            type="tel"
            placeholder="010-0000-0000"
            className="w-full bg-[#1e2738] text-white p-4 rounded-md"
          />
        </div>

        {/* Email */}
        <div className="">
          <label className="block text-sm mb-2">이메일</label>
          <Input
            type="email"
            placeholder="abc1234@naver.com"
            className="w-full bg-[#1e2738] text-white p-4 rounded-md"
          />
        </div>
      </div>

      {/* Next */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button onClick={onNext}>다음</Button>
      </section>
    </main>
  )
}
