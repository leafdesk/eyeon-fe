import { LucideIcon } from 'lucide-react'
import Image from 'next/image'

interface MenuItemProps {
  icon: string
  label: string
  onClick?: () => void
}

export default function MenuItem({ icon, label, onClick }: MenuItemProps) {
  return (
    <div
      className="bg-[#1E2436] rounded-xl px-6 flex items-center border-2 border-[#363C4E] h-[76px]"
      onClick={onClick}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={icon}
            alt="icon"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="text-[20px] font-semibold">{label}</span>
        </div>
        <Image
          src="/icons/my_arrow.svg"
          alt="arrow_right"
          width={24}
          height={24}
        />
      </div>
    </div>
  )
}
