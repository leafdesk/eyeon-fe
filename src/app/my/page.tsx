'use client'

import { User, FileText } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/Header'
import MenuItem from './MenuItem'
import { useRouter } from 'next/navigation'

export default function MyPage() {
  const router = useRouter()

  const handleMyInfoClick = () => {
    router.push('/my/info')
  }

  const handleMyDocumentsClick = () => {
    router.push('/my/docs')
  }

  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/main" leftIconType="x" title="마이페이지" right="voice" />

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-6 mb-9">
        {/* Profile Image */}
        <div className="w-[91px] h-[117px]">
          <Image
            src="/images/my_profile.png"
            alt="Profile"
            width={91}
            height={117}
            className="w-full h-full object-cover"
          />
        </div>
        {/* <div className="w-[91px] h-[117px] rounded-[4px] overflow-hidden border border-[#E0E0E0] mb-3 shadow-[0_2px_12px_0_rgba(255,255,255,0.5)]">
        </div> */}
        <h1 className="text-[28px] font-semibold mb-1">홍길서</h1>
        {/* 男, 女 */}
        <p className="text-white">
          0000.00.00 <span className="text-[#363C4E]">|</span> 女
        </p>
      </div>

      {/* Menu Options */}
      <div className="px-6 space-y-3">
        {/* My Information */}
        <MenuItem
          icon="/icons/my_person.svg"
          label="내 정보"
          onClick={handleMyInfoClick}
        />

        {/* My Document Templates */}
        <MenuItem
          icon="/icons/my_document.svg"
          label="내 문서 양식"
          onClick={handleMyDocumentsClick}
        />
      </div>

      {/* Logout Button */}
      <section className="w-full fixed bottom-6 flex justify-center">
        <button className="w-20 h-[38px] bg-[#1E2436] font-semibold text-[13px] text-[#EA7C7C] flex items-center justify-center rounded-md">
          로그아웃
        </button>
      </section>
    </main>
  )
}
