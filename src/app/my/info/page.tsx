'use client'

import Image from 'next/image'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function MyInfoPage() {
  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/my" title="내 정보" right="voice" />

      {/* Profile Section */}
      <div className="flex flex-col items-center my-4">
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

        {/* 사진 변경 버튼 */}
        <button className="px-6 bg-[#363C4E] rounded-md text-sm h-[42px] font-semibold text-[15px]">
          사진 변경
        </button>
      </div>

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

        {/* Name */}
        <div className="">
          <label className="block text-sm mb-2">성명</label>
          <Input
            type="text"
            placeholder="홍길동"
            className="w-full bg-[#1e2738] text-white p-4 rounded-md"
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

      {/* blank */}
      <div className="h-[160px]" />

      {/* Next */}
      <section className="fixed bottom-0 px-5 py-3 w-full">
        <Button>저장하기</Button>
      </section>
    </main>
  )
}
