import Image from 'next/image'

interface MyDocItemProps {
  title: string
  date: string
  size: string
  onClick?: () => void
}

export default function MyDocItem({
  title,
  date,
  size,
  onClick,
}: MyDocItemProps) {
  return (
    <div
      className="bg-[#1E2436] rounded-xl px-5 border-2 border-[#363C4E] flex justify-between items-center h-[94px]"
      onClick={onClick}
    >
      <div className="flex-1 mr-3 overflow-hidden">
        <div className="text-base font-semibold mb-1 truncate max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </div>
        <div className="flex text-sm text-gray-400">
          <span>{date}</span>
          <span className="mx-1 text-[#363C4E]">|</span>
          <span>{size}</span>
        </div>
      </div>
      <Image
        src="/icons/docs_arrow.svg"
        alt="arrow_right"
        width={24}
        height={24}
      />
    </div>
  )
}
