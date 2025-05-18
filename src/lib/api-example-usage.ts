import api from './api'
import { handleApiResponse, handleAuthResponse } from './api-helpers'

// 로그인 예시
export async function handleKakaoLogin(code: string) {
  return handleAuthResponse(api.auth.kakaoLogin(code), '로그인에 실패했습니다.')
}

// 주민등록증 인식 예시
export async function handleResidentUpload(file: File) {
  return handleApiResponse(
    api.auth.getResidentInfo(file),
    '주민등록증 인식에 실패했습니다.',
    null,
  )
}

// 회원가입 예시
export async function handleSignUp(userData: {
  name: string
  kakaoId: number
  residentNumber: string
  residentDate: string
  phoneNumber: string
  address: string
  email: string
  profileImageUrl: string
  isBlind: 'TRUE' | 'FALSE'
}) {
  return handleAuthResponse(
    api.auth.signUp(userData),
    '회원가입에 실패했습니다.',
  )
}

// 사용자 정보 조회 예시
export async function fetchUserInfo() {
  return handleApiResponse(
    api.user.getInfo(),
    '사용자 정보 조회에 실패했습니다.',
    null,
  )
}

// 사용자 정보 수정 예시
export async function updateUserInfo(data: {
  address: string
  profileImageUrl?: string
}) {
  return handleApiResponse(
    api.user.modifyInfo(data),
    '사용자 정보 수정에 실패했습니다.',
    false,
  )
}

// 양식 목록 조회 예시
export async function fetchFormList(
  formType: 'RESUME' | 'CERTIFICATE' | 'CONSENT' | 'SELF_INTRO' | 'REPORT',
) {
  return handleApiResponse(
    api.form.getList(formType),
    '양식 목록 조회에 실패했습니다.',
    [],
  )
}

// 양식 상세 조회 예시
export async function fetchFormDetail(formId: number) {
  return handleApiResponse(
    api.form.getDetail(formId),
    '양식 상세 조회에 실패했습니다.',
    null,
  )
}
