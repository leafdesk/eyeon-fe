import { Button } from '@/components/ui/button'
import { ArrowLeft, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Props {
  onPrev: () => void
}

export default function Step4Complete({ onPrev }: Props) {
  const router = useRouter()

  return (
    <div className="flex flex-col h-screen bg-[#0e1525] text-white relative overflow-hidden">
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

      {/* Content */}
      <div className="flex flex-col px-5 pt-[80px] mb-12">
        <h1 className="text-[32px] font-semibold mb-3">
          홍길동님,
          <br />
          회원가입을 축하합니다!
        </h1>
        <p className="text-sm text-[#ABABAB]">
          EyeOn(아이온)의 유용한 기능들을 이제 사용해보세요!
        </p>
      </div>

      {/* Eye Logo (SVG) */}
      <div className="w-full">
        <Image
          src="/images/signup_eye.png"
          alt="Eye Logo"
          width={375}
          height={335}
          className="ml-auto"
        />
      </div>

      {/* Next */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button onClick={() => router.push('/main')}>바로 시작하기</Button>
      </section>
    </div>
  )
}
