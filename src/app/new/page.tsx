'use client'

import Image from 'next/image'
import Header from '@/components/Header'

/**
 * 문서 작성 페이지.
 */
export default function NewPage() {
  return (
    <main className="min-h-screen bg-[#0F1626] text-white">
      {/* Header */}
      <Header left="/main" title="문서 작성" right="voice" />

      {/* Question */}
      <div className="px-6 mt-9 mb-8">
        <p className="text-[24px] font-normal">
          어떤 방식으로
          <br />
          <strong className="font-semibold">문서를 작성</strong>
          할까요?
        </p>
      </div>

      {/* Options */}
      <div className="px-5 space-y-4">
        {/* Take Photo Option */}
        <div className="bg-[#FFD700] text-black rounded-xl p-5 flex justify-between h-[160px]">
          <div className="text-[#0F1626] text-[24px] font-semibold mt-auto pl-2 pb-1">
            문서
            <br />
            촬영하기
          </div>
          <Image
            src="/icons/new_camera.svg"
            alt="Camera"
            width={100}
            height={100}
            className="mb-auto"
          />
        </div>

        {/* Upload File Option */}
        <div className="bg-white text-black rounded-xl p-5 flex justify-between h-[160px]">
          <div className="text-[#0F1626] text-[24px] font-semibold mt-auto pl-2 pb-1">
            문서 파일
            <br />
            업로드하기
          </div>
          <Image
            src="/icons/new_upload.svg"
            alt="File Upload"
            width={100}
            height={100}
            className="mb-auto"
          />
        </div>

        {/* Use Template Option */}
        <div className="bg-[#FFD700] text-black rounded-xl p-5 flex justify-between h-[160px]">
          <div className="text-[#0F1626] text-[24px] font-semibold mt-auto pl-2 pb-1">
            아이온
            <br />
            양식 사용하기
          </div>
          <Image
            src="/icons/new_form.svg"
            alt="Form"
            width={100}
            height={100}
            className="mb-auto"
          />
        </div>
      </div>

      {/* blank */}
      <div className="h-16" />
    </main>
  )
}
