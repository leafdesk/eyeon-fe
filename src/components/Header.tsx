'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import VoiceGuideToggle from './VoiceGuideToggle'

interface Props {
  title?: React.ReactNode
  left?: React.ReactNode
  leftIconType?: string
  right?: React.ReactNode
}

export default function Header({
  title,
  left,
  leftIconType = 'back',
  right,
}: Props) {
  const router = useRouter()

  return (
    <>
      <section className="w-full fixed top-0 flex items-center justify-between h-[56px] px-5 bg-[#0F1626]">
        {/* left */}
        {left ? (
          typeof left === 'string' && left.startsWith('/') ? (
            <Image
              src={
                leftIconType === 'x'
                  ? '/icons/header_x.svg'
                  : '/icons/header_back.svg'
              }
              alt="Back"
              width={28}
              height={28}
              onClick={() => router.push(left)}
            />
          ) : (
            left
          )
        ) : (
          <div className="w-7 h-7" />
        )}

        {/* title */}
        {title && <h1 className="font-semibold text-[20px]">{title}</h1>}

        {/* right */}
        {right ? (
          right === 'voice' ? (
            <VoiceGuideToggle />
          ) : (
            right
          )
        ) : (
          <div className="w-7 h-7" />
        )}
      </section>

      {/* blank */}
      <div className="h-[56px]" />
    </>
  )
}
