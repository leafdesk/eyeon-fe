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
  formType:
    | 'RESUME'
    | 'CERTIFICATE'
    | 'CONSENT'
    | 'SELF_INTRO'
    | 'REPORT'
    | 'EMPLOYMENT'
    | 'INTRODUCTION'
    | 'LEASE'
  formSize: number
  formUrl: string
}

export interface UploadFormResponseData {
  formId: number
  name: string
  formSize: number
  formUrl: string
}

export interface DocumentData {
  documentId: number
  name: string
  createdAt: string
  documentType: 'LEASE' | 'SELF_INTRO' | 'RESUME' | string
  documentSize: number
  documentUrl: string
}

export interface DocumentSummaryData {
  summaryText: string
  pdfFileUrl: string
}

/**
 * 필드 분석 API 관련 타입
 */
export interface FieldAnalyzeData {
  field: string
  targetField: string
  index: number
  bbox: number[]
  displayName: string
  value: string
}

/**
 * 문서 작성 API 관련 타입
 */
export interface DocumentWriteRequest {
  data: FieldAnalyzeData[]
}

export interface DocumentWriteResponseData {
  documentName: string
  createdDate: string
  imageUrl: string
  pdfUrl: string
}
