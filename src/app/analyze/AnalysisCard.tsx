'use client'

import Image from 'next/image'

interface AnalysisCardProps {
  title: string
  feedback: string
}

export default function AnalysisCard({ title, feedback }: AnalysisCardProps) {
  return (
    <div className="bg-[#1E2436] rounded-xl px-5 py-6 border-2 border-[#363C4E]">
      <h2 className="font-semibold text-base mb-2.5">{title}</h2>
      <div className="flex items-start gap-2">
        <Image
          src="/icons/analysis_robot.svg"
          alt="robot"
          width={20}
          height={20}
        />
        <div className="text-xs text-[#FFD700]">
          <p className="">{feedback}</p>
        </div>
      </div>
    </div>
  )
}
