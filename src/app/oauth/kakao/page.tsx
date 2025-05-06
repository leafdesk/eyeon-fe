'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api' // realApi 또는 mockApi 둘 다 export된 모듈
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/lib/api-types'
import type { LoginResponseData } from '@/lib/api-types'

// 실제 로그인 처리 컴포넌트
function KakaoCallbackContent() {
  const router = useRouter()
  const params = useSearchParams()
  const code = params.get('code')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) {
      console.log('인증 코드가 없습니다.')
      setError('인증 코드 누락')
      return
    }

    api.auth
      .kakaoLogin(code)
      .then((res) => {
        const body = res.data as ApiResponse<LoginResponseData>
        if (body.isSuccess && body.data.token) {
          // 1) 기존 사용자: 토큰 저장 → /main 이동
          localStorage.setItem('token', body.data.token)
          console.log('로그인 성공, 토큰 저장')
          router.replace('/main')
        } else {
          // 혹시 API가 200으로 내려왔지만 isSuccess=false 케이스 처리
          console.log('로그인 실패 응답:', body)
          setError(body.message)
        }
      })
      .catch((err: AxiosError<ApiResponse<any>>) => {
        const resp = err.response?.data
        console.log('로그인 에러 응답:', resp)

        if (
          resp?.code === 'USER_NOT_FOUND_404' ||
          resp?.code === 'USER_SIGN_UP_REQUIRED_404'
        ) {
          // 2) 신규 사용자: /signup 으로 이동, 필요한 정보 쿼리로 전달
          const { email, kakaoId, profileImageUrl } = resp.data
          console.log('신규 사용자, 회원가입 페이지로 이동')
          router.replace(
            `/signup?email=${encodeURIComponent(
              email,
            )}&kakaoId=${kakaoId}&profileImageUrl=${encodeURIComponent(
              profileImageUrl,
            )}`,
          )
        } else {
          // 그 외 에러
          console.log('처리되지 않은 에러 코드:', resp?.code)
          setError(resp?.message || err.message)
        }
      })
  }, [code, router])

  if (error) {
    return <p style={{ color: 'red' }}>에러: {error}</p>
  }
  return <p>로그인 처리 중…</p>
}

// 메인 페이지 컴포넌트 - Suspense로 감싸서 export
export default function KakaoOAuthCallback() {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <KakaoCallbackContent />
    </Suspense>
  )
}
