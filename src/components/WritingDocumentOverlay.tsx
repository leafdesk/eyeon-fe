import Image from 'next/image'

export default function WritingDocumentOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-center">
      <Image
        src="/icons/overlay_writing.svg"
        alt="문서 아이콘"
        width={150}
        height={150}
      />
      <span className="text-white text-lg font-normal">
        문서 작성 중입니다...
      </span>
    </div>
  )
}
