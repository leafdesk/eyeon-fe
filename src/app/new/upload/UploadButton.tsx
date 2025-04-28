'use client'

import Image from 'next/image'

interface UploadButtonProps {
  selectedFile: File | null
  onFileSelect: (file: File) => void
}

export default function UploadButton({
  selectedFile,
  onFileSelect,
}: UploadButtonProps) {
  const handleUploadClick = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg'
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        onFileSelect(file)
      }
    }
    fileInput.click()
  }

  return (
    <div className="w-full bg-[#1e2738] rounded-3xl p-8 relative -top-10">
      <p className="text-lg font-semibold text-center mb-5">
        작성할 문서를 업로드해 주세요
      </p>

      <button
        onClick={handleUploadClick}
        className="w-full bg-[#FFD700] text-[#0F1626] py-4 rounded-[12px] flex flex-col gap-2 items-center justify-center"
      >
        <Image
          src="/icons/upload_docs.svg"
          alt="upload docs"
          width={24}
          height={24}
        />
        <span className="text-sm font-semibold">
          {selectedFile ? selectedFile.name : '문서 업로드'}
        </span>
      </button>
    </div>
  )
}
