'use client'

import { useEffect, useState } from 'react'

interface DocumentPreviewProps {
  onFileChange: (file: File) => void
  file: File
  isFromScan?: boolean
}

export default function DocumentPreview({
  onFileChange,
  file,
  isFromScan = false,
}: DocumentPreviewProps) {
  const [text, setText] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (file.type.startsWith('text/')) {
      const reader = new FileReader()
      reader.onload = (e) => setText(e.target?.result as string)
      reader.readAsText(file)
    } else if (file.type.startsWith('image/')) {
      // 이미지 파일의 경우 URL 생성
      const url = URL.createObjectURL(file)
      setImageUrl(url)

      // 컴포넌트 언마운트 시 URL 해제
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [file])

  const handleReplaceFile = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.pdf,.doc,.docx,.txt,image/*,text/*'
    fileInput.onchange = (e) => {
      const newFile = (e.target as HTMLInputElement).files?.[0]
      if (newFile) {
        onFileChange(newFile)
      }
    }
    fileInput.click()
  }

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <img
            src={imageUrl || URL.createObjectURL(file)}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: '400px' }}
          />
        </div>
      )
    }
    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={URL.createObjectURL(file)}
          title={file.name}
          width="100%"
          height="400px"
          style={{ border: 'none' }}
        />
      )
    }
    if (file.type.startsWith('text/')) {
      return (
        <pre className="bg-gray-100 p-4 overflow-auto max-h-96 text-black text-sm">
          {text || '로딩 중...'}
        </pre>
      )
    }
    return (
      <div className="text-center text-gray-500 p-8">
        이 파일 형식은 미리보기를 지원하지 않습니다.
      </div>
    )
  }

  return (
    <div className="flex-1 pt-4 px-5 py-6">
      <div className="w-full bg-[#1E2436] rounded-3xl p-6">
        {/* Document Title and Size */}
        <div className="mb-3">
          <h2 className="text-white text-base font-semibold mb-1">
            {isFromScan ? '스캔된 문서' : file.name}
          </h2>
          <p className="text-[13px] font-normal text-[#767676]">
            {(file.size / (1024 * 1024)).toFixed(1)}MB
            {isFromScan ? '(스캔된 문서)' : '(문서 파일 크기)'}
          </p>
        </div>

        {/* Document Preview */}
        <div className="bg-white rounded-xl mb-4 flex items-center justify-center overflow-hidden min-h-[300px]">
          {renderPreview()}
        </div>

        {/* Change Document Button */}
        <button
          onClick={handleReplaceFile}
          className="w-full border-2 border-[#9B9B9B] text-white text-sm font-semibold h-[52px] rounded-xl"
        >
          다른 문서로 할래요
        </button>
      </div>
    </div>
  )
}
