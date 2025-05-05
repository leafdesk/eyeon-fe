/**
 * API 응답 타입 정의
 */
export interface ApiResponse<T = any> {
  isSuccess: boolean
  code: string
  httpStatus: number
  message: string
  data: T
  timeStamp: string
}

/**
 * 요청 타입 정의
 */
export interface LoginRequest {
  code: string
}

export interface ResidentRequest {
  file: File
}

export interface SignUpRequest {
  name: string
  kakaoId: number
  residentNumber: string
  residentDate: string
  phoneNumber: string
  address: string
  email: string
  profileImageUrl: string
  isBlind: 'TRUE' | 'FALSE'
}

export interface UserModifyRequest {
  address: string
  profileImageUrl?: string
}

/**
 * 응답 데이터 타입 정의
 */
export interface LoginResponseData {
  token: string
}

export interface ResidentResponseData {
  name: string
  residentNumber: string
  residentDate: string
  address: string
}

export interface UserInfoData {
  username: string
  profileImageUrl: string
  address: string
  phoneNumber: string
  email: string
}

export interface FormData {
  formId: number
  name: string
  createdAt: string
  formType: 'EMPLOYMENT' | 'INTRODUCTION' | 'LEASE'
  formSize: number
  formUrl: string
}
