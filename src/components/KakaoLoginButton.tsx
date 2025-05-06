'use client'

import { useEffect } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

export default function KakaoLoginButton() {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!)
    }
  }, [])

  const login = () => {
    if (!window.Kakao) return

    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/oauth/kakao`,
      throughTalk: true, // 카카오톡 앱으로 시도
    })
  }

  return (
    <Button
      variant="primary"
      onClick={login}
      className="flex items-center justify-center gap-1 bg-[#F9DB00] hover:bg-[#F9DB00]"
    >
      <Image src="/icons/kakao.svg" alt="kakao" width={32} height={32} />
      카카오 계정으로 시작하기
    </Button>
  )
}
