import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface DocItemProps {
  id: number
  category: string
  title: string
  date: string
  size: string
}

export default function DocItem({
  id,
  category,
  title,
  date,
  size,
}: DocItemProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/docs/${id}`)
  }

  const getDisplayTitle = (title: string) => {
    return title.split('/').pop() || title
  }

  return (
    <div
      className="bg-[#1E2436] rounded-lg p-5 border-2 border-[#363C4E] cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="inline-block bg-[#EAEAEA] text-[#5C5C5C] text-[10px] font-semibold px-2.5 py-1 rounded-sm">
            {category === 'RESUME'
              ? '이력서'
              : category === 'CERTIFICATE'
              ? '재직증명서'
              : category === 'CONSENT'
              ? '위임장'
              : category === 'SELF_INTRO'
              ? '자기소개서'
              : category === 'REPORT'
              ? '일일업무보고서'
              : category}
          </div>
          <h2 className="text-base font-semibold">{getDisplayTitle(title)}</h2>
          <p className="text-[#9B9B9B] text-sm">
            {date} <span className="mx-[4px] text-[#363C4E]">|</span> {size}
          </p>
        </div>
        <Image src="/icons/docs_arrow.svg" alt="arrow" width={20} height={20} />
      </div>
    </div>
  )
}
