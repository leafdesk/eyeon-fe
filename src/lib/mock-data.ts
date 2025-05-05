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
})

/**
 * 폼 데이터 Mock
 */
const formMockData: ApiFormData[] = [
  {
    formId: 1,
    name: '표준 근로계약서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.EMPLOYMENT,
    formSize: 128000,
    formUrl: 'https://example.com/forms/1',
  },
  {
    formId: 2,
    name: '자기소개서 양식',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.INTRODUCTION,
    formSize: 78000,
    formUrl: 'https://example.com/forms/2',
  },
  {
    formId: 3,
    name: '주택 임대차 계약서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.LEASE,
    formSize: 156000,
    formUrl: 'https://example.com/forms/3',
  },
  {
    formId: 4,
    name: '아르바이트 근로계약서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.EMPLOYMENT,
    formSize: 96000,
    formUrl: 'https://example.com/forms/4',
  },
  {
    formId: 5,
    name: '졸업 자기소개서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.INTRODUCTION,
    formSize: 64000,
    formUrl: 'https://example.com/forms/5',
  },
  {
    formId: 6,
    name: '월세 계약서',
    createdAt: new Date().toISOString(),
    formType: FORM_TYPES.LEASE,
    formSize: 112000,
    formUrl: 'https://example.com/forms/6',
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
 * 사용자 정보 수정 Mock
 */
export const userModifyResponseMock = createApiResponse(null)

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
  },
}
