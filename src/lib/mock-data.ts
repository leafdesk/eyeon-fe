import { AxiosResponse } from 'axios'
import { FORM_TYPES } from './constants'
import type {
  ApiResponse,
  LoginResponseData,
  ResidentResponseData,
  UserInfoData,
  FormData as ApiFormData,
  SignUpRequest,
  UserModifyRequest,
  UploadFormResponseData,
  DocumentData,
  DocumentSummaryData,
  FieldAnalyzeData,
  DocumentWriteRequest,
  DocumentWriteResponseData,
  UploadDocumentResponseData,
  DocumentAdviceData,
  DocumentModifyRequest,
  DocumentModifyResponseData,
} from './api-types'

/**
 * API 응답 형식을 생성하는 유틸리티 함수
 */
function createApiResponse<T>(data: T, isSuccess = true): ApiResponse<T> {
  return {
    isSuccess,
    code: isSuccess ? 'SUCCESS' : 'ERROR',
    httpStatus: isSuccess ? 200 : 400,
    message: isSuccess
      ? '성공적으로 처리되었습니다.'
      : '처리 중 오류가 발생했습니다.',
    data,
    timeStamp: new Date().toISOString(),
  }
}

/**
 * 로그인 응답 Mock
 */
export const loginResponseMock = createApiResponse<LoginResponseData>({
  token: 'mock-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
})

/**
 * 주민등록증 인식 응답 Mock
 */
export const residentResponseMock = createApiResponse<ResidentResponseData>({
  name: '홍길동',
  residentNumber: '000000-0000000',
  residentDate: '2020-01-01',
  address: '서울특별시 강남구 테헤란로 123',
})

/**
 * 사용자 정보 응답 Mock
 */
export const userInfoResponseMock = createApiResponse<UserInfoData>({
  username: '홍길동',
  profileImageUrl: 'https://via.placeholder.com/150',
  address: '서울특별시 강남구 테헤란로 123',
  phoneNumber: '010-1234-5678',
  email: 'example@example.com',
  gender: 'MALE',
})

/**
 * 폼 데이터 Mock
 */
const formMockData: ApiFormData[] = [
  {
    formId: 1,
    name: '표준 근로계약서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.RESUME,
    formSize: 128000,
    formUrl: 'https://example.com/forms/1',
  },
  {
    formId: 2,
    name: '자기소개서 양식',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.CERTIFICATE,
    formSize: 78000,
    formUrl: 'https://example.com/forms/2',
  },
  {
    formId: 3,
    name: '주택 임대차 계약서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.CONSENT,
    formSize: 156000,
    formUrl: 'https://example.com/forms/3',
  },
  {
    formId: 4,
    name: '아르바이트 근로계약서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.SELF_INTRO,
    formSize: 96000,
    formUrl: 'https://example.com/forms/4',
  },
  {
    formId: 5,
    name: '졸업 자기소개서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.REPORT,
    formSize: 64000,
    formUrl: 'https://example.com/forms/5',
  },
  {
    formId: 6,
    name: '월세 계약서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.REPORT,
    formSize: 112000,
    formUrl: 'https://example.com/forms/6',
  },
]

/**
 * 문서 데이터 Mock
 */
const documentMockData: DocumentData[] = [
  {
    documentId: 1,
    name: '자기소개서_홍길동.pdf',
    createdAt: new Date().toISOString(),
    documentType: FORM_TYPES.SELF_INTRO,
    documentSize: 215000,
    documentUrl: 'https://example.com/documents/1',
    documentImgUrl: 'https://example.com/images/1.jpg',
  },
  {
    documentId: 2,
    name: '임대차계약서_2023.pdf',
    createdAt: new Date().toISOString(),
    documentType: FORM_TYPES.CONSENT,
    documentSize: 320000,
    documentUrl: 'https://example.com/documents/2',
    documentImgUrl: 'https://example.com/images/2.jpg',
  },
  {
    documentId: 3,
    name: '이력서_홍길동.pdf',
    createdAt: new Date().toISOString(),
    documentType: FORM_TYPES.RESUME,
    documentSize: 180000,
    documentUrl: 'https://example.com/documents/3',
    documentImgUrl: 'https://example.com/images/3.jpg',
  },
]

/**
 * 양식 목록 조회 Mock 함수
 */
export function getFormListMock(formType?: string) {
  const filteredForms = formType
    ? formMockData.filter((form) => form.formType === formType)
    : formMockData

  return createApiResponse(filteredForms)
}

/**
 * 양식 상세 조회 Mock 함수
 */
export function getFormDetailMock(formId: number) {
  const form = formMockData.find((form) => form.formId === formId)

  if (form) {
    return createApiResponse(form)
  }

  return createApiResponse(null, false)
}

/**
 * 문서 업로드 응답 Mock
 */
export const uploadFormResponseMock = createApiResponse<UploadFormResponseData>(
  {
    formId: 7,
    name: '업로드된_문서.pdf',
    formSize: 250000,
    formUrl: 'https://example.com/forms/7',
  },
)

/**
 * 문서 업로드 응답 Mock
 */
export const uploadDocumentResponseMock =
  createApiResponse<UploadDocumentResponseData>({
    documentId: 8,
    name: '업로드된_문서.pdf',
    documentSize: 250000,
    documentUrl: 'https://example.com/documents/8',
  })

/**
 * 문서 목록 조회 Mock 함수
 */
export function getDocumentListMock() {
  return createApiResponse(documentMockData)
}

/**
 * 문서 상세 조회 Mock 함수
 */
export function getDocumentDetailMock(documentId: number) {
  const document = documentMockData.find((doc) => doc.documentId === documentId)

  if (document) {
    return createApiResponse(document)
  }

  return createApiResponse(null, false)
}

/**
 * 문서 요약 조회 Mock 함수
 */
export function getDocumentSummaryMock(documentId: number) {
  const document = documentMockData.find((doc) => doc.documentId === documentId)

  if (document) {
    return createApiResponse<DocumentSummaryData>({
      summaryText: `${document.name}에 대한 요약 내용입니다. 이 문서는 ${document.documentType} 유형의 문서로 주요 내용이 포함되어 있습니다.`,
      pdfFileUrl: document.documentUrl,
    })
  }

  return createApiResponse(null, false)
}

/**
 * 사용자 정보 수정 Mock
 */
export const userModifyResponseMock = createApiResponse(null)

/**
 * 필드 분석 응답 Mock
 */
export const fieldAnalyzeResponseMock = createApiResponse<FieldAnalyzeData[]>([
  {
    field: 'B PERSONAL NAME',
    targetField: 'B PERSONAL NAME FIELD',
    index: 4,
    bbox: [363.0, 173.0, 864.0, 200.0],
    displayName: '이름',
    value: '홍길동',
  },
  {
    field: 'B PERSONAL PHONE',
    targetField: 'B PERSONAL PHONE FIELD',
    index: 6,
    bbox: [363.0, 200.0, 560.0, 227.0],
    displayName: '연락처',
    value: '010-9273-9319',
  },
  {
    field: 'B PERSONAL EMAIL',
    targetField: 'B PERSONAL EMAIL FIELD',
    index: 8,
    bbox: [363.0, 227.0, 700.0, 254.0],
    displayName: '이메일',
    value: 'example@example.com',
  },
])

/**
 * 문서 작성 응답 Mock
 */
export const documentWriteResponseMock =
  createApiResponse<DocumentWriteResponseData>({
    documentId: 123,
    documentName: '작성된_문서.pdf',
    createdDate: new Date().toISOString(),
    imageUrl:
      'https://eyeon-bucket.s3.ap-northeast-2.amazonaws.com/example-image.jpg',
    pdfUrl:
      'https://eyeon-bucket.s3.ap-northeast-2.amazonaws.com/example-document.pdf',
  })

/**
 * 문서 조언 응답 Mock
 */
export const documentAdviceResponseMock = createApiResponse<
  DocumentAdviceData[]
>([
  {
    i: 0,
    d: '이름',
    v: '홍길동',
    a: '이름이 정확히 입력되었습니다. 공식 문서와 일치하는지 확인해주세요.',
  },
  {
    i: 1,
    d: '연락처',
    v: '010-1234-5678',
    a: '연락처 형식이 올바릅니다. 현재 사용 중인 번호인지 확인해주세요.',
  },
  {
    i: 2,
    d: '주소',
    v: '서울특별시 강남구 테헤란로 123',
    a: '주소가 상세하게 입력되었습니다. 우편번호도 함께 기재하면 더 좋겠습니다.',
  },
])

/**
 * 문서 수정 응답 Mock
 */
export const documentModifyResponseMock =
  createApiResponse<DocumentModifyResponseData>({
    documentName: '수정된_문서.pdf',
    createdDate: new Date().toISOString(),
    imageUrl:
      'https://eyeon-bucket.s3.ap-northeast-2.amazonaws.com/modified-image.jpg',
    pdfUrl:
      'https://eyeon-bucket.s3.ap-northeast-2.amazonaws.com/modified-document.pdf',
  })

/**
 * Mock 데이터를 AxiosResponse 형식으로 래핑
 */
function wrapInAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  }
}

/**
 * 모든 Mock API 함수 매핑
 */
export const mockApi = {
  auth: {
    kakaoLogin: (code: string) =>
      Promise.resolve(wrapInAxiosResponse(loginResponseMock)),

    getResidentInfo: (file: File) =>
      Promise.resolve(wrapInAxiosResponse(residentResponseMock)),

    signUp: (userData: SignUpRequest) =>
      Promise.resolve(wrapInAxiosResponse(loginResponseMock)),
  },

  user: {
    getInfo: () => Promise.resolve(wrapInAxiosResponse(userInfoResponseMock)),

    modifyInfo: (data: UserModifyRequest) =>
      Promise.resolve(wrapInAxiosResponse(userModifyResponseMock)),
  },

  form: {
    getList: (formType: string) =>
      Promise.resolve(wrapInAxiosResponse(getFormListMock(formType))),

    getDetail: (formId: number) =>
      Promise.resolve(wrapInAxiosResponse(getFormDetailMock(formId))),

    uploadForm: (file: File) =>
      Promise.resolve(wrapInAxiosResponse(uploadFormResponseMock)),

    analyzeField: (file: File) =>
      Promise.resolve(wrapInAxiosResponse(fieldAnalyzeResponseMock)),
  },

  document: {
    getSummary: (documentId: number) =>
      Promise.resolve(wrapInAxiosResponse(getDocumentSummaryMock(documentId))),

    getList: () => Promise.resolve(wrapInAxiosResponse(getDocumentListMock())),

    getDetail: (documentId: number) =>
      Promise.resolve(wrapInAxiosResponse(getDocumentDetailMock(documentId))),

    writeDocument: (formId: number, data: DocumentWriteRequest) =>
      Promise.resolve(wrapInAxiosResponse(documentWriteResponseMock)),

    uploadDocument: (file: File) =>
      Promise.resolve(wrapInAxiosResponse(uploadDocumentResponseMock)),

    getAdvice: (documentId: number) =>
      Promise.resolve(wrapInAxiosResponse(documentAdviceResponseMock)),

    modifyDocument: (documentId: number, data: DocumentModifyRequest) =>
      Promise.resolve(wrapInAxiosResponse(documentModifyResponseMock)),
  },

  ai: {
    scan: (file: File) =>
      Promise.resolve({
        data: {
          isSuccess: true,
          httpStatus: 200,
          message: '스캔이 완료되었습니다.',
          filename: file.name,
          base64: 'mock-base64-data',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      }),
  },
}
