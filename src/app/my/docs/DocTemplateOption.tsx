import Image from 'next/image'

interface DocTemplateOptionProps {
  title: string
  onClick?: () => void
}

export default function DocTemplateOption({
  title,
  onClick,
}: DocTemplateOptionProps) {
  return (
    <div
      className="bg-[#1E2436] rounded-lg p-6 border-2 border-[#9B9B9B] h-[76px] flex justify-between items-center"
      onClick={onClick}
    >
      <span className="text-[20px] font-semibold">{title}</span>
      <Image
        src="/icons/my_arrow.svg"
        alt="arrow_right"
        width={24}
        height={24}
      />
    </div>
  )
}
