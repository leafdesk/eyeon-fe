'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { FORM_TYPES, BLIND_STATUS } from '@/lib/constants'
import { SignUpRequest } from '@/lib/api-types'
import { toast } from 'sonner'

export default function TestPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [response, setResponse] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)

  // API 호출 함수들
  const handleLogin = async () => {
    try {
      setLoading('login')
      // 실제로는 카카오 인가 코드를 받아야 하지만, 테스트를 위해 임의의 코드 사용
      const res = await api.auth.kakaoLogin('test-kakao-code')
      setResponse(res.data)
      toast.success('로그인 성공')

      // 토큰 저장
      if (res.data.isSuccess && res.data.data.token) {
        localStorage.setItem('token', res.data.data.token)
      }
    } catch (error) {
      console.error('로그인 에러:', error)
      toast.error('로그인 실패')
    } finally {
      setLoading(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleResidentInfo = async () => {
    if (!file) {
      toast.error('파일을 선택해주세요')
      return
    }

    try {
      setLoading('resident')
      const res = await api.auth.getResidentInfo(file)
      setResponse(res.data)
      toast.success('주민등록증 인식 성공')
    } catch (error) {
      console.error('주민등록증 인식 에러:', error)
      toast.error('주민등록증 인식 실패')
    } finally {
      setLoading(null)
    }
  }

  const handleSignUp = async () => {
    try {
      setLoading('signup')

      // 테스트용 회원가입 데이터
      const userData: SignUpRequest = {
        name: '홍길동',
        kakaoId: 12345678,
        residentNumber: '000000-0000000',
        residentDate: '2020-01-01',
        phoneNumber: '010-1234-5678',
        address: '서울특별시 강남구 테헤란로 123',
        email: 'example@example.com',
        profileImageUrl: 'https://via.placeholder.com/150',
        isBlind: BLIND_STATUS.FALSE,
      }

      const res = await api.auth.signUp(userData)
      setResponse(res.data)
      toast.success('회원가입 성공')

      // 토큰 저장
      if (res.data.isSuccess && res.data.data.token) {
        localStorage.setItem('token', res.data.data.token)
      }
    } catch (error) {
      console.error('회원가입 에러:', error)
      toast.error('회원가입 실패')
    } finally {
      setLoading(null)
    }
  }

  const handleGetUserInfo = async () => {
    try {
      setLoading('userinfo')
      const res = await api.user.getInfo()
      setResponse(res.data)
      toast.success('사용자 정보 조회 성공')
    } catch (error) {
      console.error('사용자 정보 조회 에러:', error)
      toast.error('사용자 정보 조회 실패')
    } finally {
      setLoading(null)
    }
  }

  const handleModifyUserInfo = async () => {
    try {
      setLoading('modifyuser')
      const res = await api.user.modifyInfo({
        address: '서울특별시 서초구 신반포로 123',
        profileImageUrl: 'https://via.placeholder.com/200',
      })
      setResponse(res.data)
      toast.success('사용자 정보 수정 성공')
    } catch (error) {
      console.error('사용자 정보 수정 에러:', error)
      toast.error('사용자 정보 수정 실패')
    } finally {
      setLoading(null)
    }
  }

  const handleGetFormList = async (
    formType: 'EMPLOYMENT' | 'INTRODUCTION' | 'LEASE',
  ) => {
    try {
      setLoading(`formlist-${formType}`)
      const res = await api.form.getList(formType)
      setResponse(res.data)
      toast.success('양식 목록 조회 성공')
    } catch (error) {
      console.error('양식 목록 조회 에러:', error)
      toast.error('양식 목록 조회 실패')
    } finally {
      setLoading(null)
    }
  }

  const handleGetFormDetail = async () => {
    try {
      setLoading('formdetail')
      const res = await api.form.getDetail(1) // formId 1 조회
      setResponse(res.data)
      toast.success('양식 상세 조회 성공')
    } catch (error) {
      console.error('양식 상세 조회 에러:', error)
      toast.error('양식 상세 조회 실패')
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#0F1626] px-5 py-10">
      <h1 className="text-white text-2xl font-bold mb-8">API 테스트 페이지</h1>

      <div className="mb-8">
        <h2 className="text-white text-xl font-semibold mb-4">인증 API</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            onClick={handleLogin}
            disabled={loading === 'login'}
          >
            {loading === 'login' ? '처리 중...' : '로그인 테스트'}
          </Button>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="p-2 rounded bg-gray-800 text-white w-full"
            />
            <Button
              variant="primary"
              onClick={handleResidentInfo}
              disabled={loading === 'resident' || !file}
            >
              {loading === 'resident' ? '처리 중...' : '주민등록증 인식 테스트'}
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={handleSignUp}
            disabled={loading === 'signup'}
          >
            {loading === 'signup' ? '처리 중...' : '회원가입 테스트'}
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-white text-xl font-semibold mb-4">사용자 API</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            onClick={handleGetUserInfo}
            disabled={loading === 'userinfo'}
          >
            {loading === 'userinfo' ? '처리 중...' : '사용자 정보 조회 테스트'}
          </Button>

          <Button
            variant="primary"
            onClick={handleModifyUserInfo}
            disabled={loading === 'modifyuser'}
          >
            {loading === 'modifyuser'
              ? '처리 중...'
              : '사용자 정보 수정 테스트'}
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-white text-xl font-semibold mb-4">양식 API</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            onClick={() => handleGetFormList(FORM_TYPES.EMPLOYMENT)}
            disabled={loading === `formlist-${FORM_TYPES.EMPLOYMENT}`}
          >
            {loading === `formlist-${FORM_TYPES.EMPLOYMENT}`
              ? '처리 중...'
              : '근로계약서 양식 목록 조회'}
          </Button>

          <Button
            variant="primary"
            onClick={() => handleGetFormList(FORM_TYPES.INTRODUCTION)}
            disabled={loading === `formlist-${FORM_TYPES.INTRODUCTION}`}
          >
            {loading === `formlist-${FORM_TYPES.INTRODUCTION}`
              ? '처리 중...'
              : '자기소개서 양식 목록 조회'}
          </Button>

          <Button
            variant="primary"
            onClick={() => handleGetFormList(FORM_TYPES.LEASE)}
            disabled={loading === `formlist-${FORM_TYPES.LEASE}`}
          >
            {loading === `formlist-${FORM_TYPES.LEASE}`
              ? '처리 중...'
              : '임대차계약서 양식 목록 조회'}
          </Button>

          <Button
            variant="primary"
            onClick={handleGetFormDetail}
            disabled={loading === 'formdetail'}
          >
            {loading === 'formdetail'
              ? '처리 중...'
              : '양식 상세 조회 테스트 (ID: 1)'}
          </Button>
        </div>
      </div>

      {response && (
        <div className="mt-8 p-4 bg-gray-800 rounded-md">
          <h3 className="text-white text-lg font-semibold mb-2">응답 결과</h3>
          <pre className="text-green-400 overflow-auto max-h-96">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}
