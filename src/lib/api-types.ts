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
  data: {
    address: string
  }
  file?: File
  // name?: string
  // phoneNumber?: string
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
  residentNumber?: string
  gender: 'MALE' | 'FEMALE'
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

export interface UploadDocumentResponseData {
  documentId: number
  name: string
  documentSize: number
  documentUrl: string
}

export interface DocumentData {
  documentId: number
  name: string
  createdAt: string
  documentType: 'LEASE' | 'SELF_INTRO' | 'RESUME' | string
  documentSize: number
  documentUrl: string
  documentImgUrl: string
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
  documentId: number
  documentName: string
  createdDate: string
  imageUrl: string
  pdfUrl: string
}

/**
 * Flask API 응답 타입 정의 (Spring Boot API와 구조가 다름)
 */
export interface FlaskApiResponse<T = any> {
  isSuccess: boolean
  httpStatus: number
  message: string
  data?: T
  [key: string]: any // 추가 필드들을 위한 인덱스 시그니처
}

/**
 * AI 스캔 API 관련 타입
 */
export interface AiScanRequest {
  file: File
}

export interface AiScanResponseData {
  filename: string
  base64: string
}

/**
 * AI 스캔 API 응답 타입 (Flask API 구조)
 */
export interface AiScanResponse {
  isSuccess: boolean
  httpStatus: number
  message: string
  filename: string
  base64: string
}

/**
 * 문서 조언 API 관련 타입
 */
export interface DocumentAdviceData {
  i: number // 필드 인덱스
  d: string // 필드 설명
  v: string // 현재 값
  a: string // 조언 내용
}

/**
 * 문서 수정 API 관련 타입
 */
export interface DocumentModifyRequest {
  data: Array<{
    i: number // 필드 인덱스
    v: string // 새로운 값
  }>
}

export interface DocumentModifyResponseData {
  documentName: string
  createdDate: string
  imageUrl: string
  pdfUrl: string
}
