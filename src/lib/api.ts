import axios, { AxiosError, AxiosResponse } from 'axios'
import { USE_API_MOCK } from './constants'
import { mockApi } from './mock-data'
import type {
  ApiResponse,
  SignUpRequest,
  UserModifyRequest,
  LoginResponseData,
  ResidentResponseData,
  UserInfoData,
  FormData as ApiFormData,
  UploadFormResponseData,
  UploadDocumentResponseData,
  DocumentData,
  DocumentSummaryData,
  FieldAnalyzeData,
  DocumentWriteRequest,
  DocumentWriteResponseData,
  AiScanResponse,
  DocumentAdviceData,
  DocumentModifyRequest,
  DocumentModifyResponseData,
} from './api-types'

// 토큰 가져오기 함수
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// Axios 인스턴스 생성
const apiClient = axios.create({
  // baseURL: 'http://3.38.124.50:8080/api',
  baseURL: 'https://3.38.124.50.nip.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flask API용 Axios 인스턴스 생성
const flaskClient = axios.create({
  baseURL: 'https://3.39.215.178.nip.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 - 토큰 추가 (apiClient)
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 요청 인터셉터 - 토큰 추가 (flaskClient)
flaskClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 응답 인터셉터 - 에러 처리 (apiClient)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    // API 에러 응답 추출
    const errorResponse = error.response?.data

    // 에러 로깅
    console.error('API Error:', errorResponse?.message || error.message)

    // 401 에러 처리 (인증 오류)
    if (error.response?.status === 401) {
      // 클라이언트 사이드에서만 실행
      if (typeof window !== 'undefined') {
        // 토큰 제거 및 로그인 페이지로 리다이렉트 등의
        // 인증 관련 처리를 수행할 수 있음
        localStorage.removeItem('token')
      }
    }

    return Promise.reject(error)
  },
)

// 응답 인터셉터 - 에러 처리 (flaskClient)
flaskClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    // API 에러 응답 추출
    const errorResponse = error.response?.data

    // 에러 로깅
    console.error('Flask API Error:', errorResponse?.message || error.message)

    // 401 에러 처리 (인증 오류)
    if (error.response?.status === 401) {
      // 클라이언트 사이드에서만 실행
      if (typeof window !== 'undefined') {
        // 토큰 제거 및 로그인 페이지로 리다이렉트 등의
        // 인증 관련 처리를 수행할 수 있음
        localStorage.removeItem('token')
      }
    }

    return Promise.reject(error)
  },
)

// 실제 API 함수들
const realApi = {
  // 회원가입 및 온보딩 관련 API
  auth: {
    /**
     * 카카오 로그인
     * @param code 카카오 인가 코드
     */
    kakaoLogin: (code: string) =>
      apiClient.post<ApiResponse<LoginResponseData>>('/auth/kakao/login', {
        code,
      }),

    /**
     * 주민등록증 인식
     * @param file 주민등록증 이미지 파일
     */
    getResidentInfo: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      return apiClient.post<ApiResponse<ResidentResponseData>>(
        '/user/getResidentInfo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    },

    /**
     * 회원가입
     * @param userData 회원가입 정보
     */
    signUp: (userData: SignUpRequest) =>
      apiClient.post<ApiResponse<LoginResponseData>>(
        '/user/kakao/signUp',
        userData,
      ),
  },

  // 사용자 관련 API
  user: {
    /**
     * 사용자 정보 수정
     * @param data 수정할 사용자 정보
     */
    modifyInfo: (data: UserModifyRequest) => {
      const formData = new FormData()

      // data.data를 application/json Content-Type을 가진 Blob으로 추가
      const jsonBlob = new Blob([JSON.stringify(data.data)], {
        type: 'application/json',
      })
      formData.append('data', jsonBlob)

      if (data.file) {
        formData.append('file', data.file)
      }

      return apiClient.put<ApiResponse<null>>('/user/modify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },

    /**
     * 사용자 정보 조회
     */
    getInfo: () => apiClient.get<ApiResponse<UserInfoData>>('/user/info'),
  },

  // 문서 양식 관련 API
  form: {
    /**
     * 문서 양식 상세 조회
     * @param formId 양식 ID
     */
    getDetail: (formId: number) =>
      apiClient.get<ApiResponse<ApiFormData>>(`/form/${formId}/detail`),

    /**
     * 문서 양식 목록 조회
     * @param formType 양식 타입
     */
    getList: (
      formType: 'RESUME' | 'CERTIFICATE' | 'CONSENT' | 'SELF_INTRO' | 'REPORT',
    ) =>
      apiClient.get<ApiResponse<ApiFormData[]>>('/form/list', {
        params: { formType },
      }),

    /**
     * 문서 양식 업로드
     * @param file 업로드할 문서 파일
     */
    uploadForm: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      return apiClient.post<ApiResponse<UploadFormResponseData>>(
        '/form',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    },

    /**
     * 필드 분석 API
     * @param file 필드를 분석할 원본 문서
     */
    analyzeField: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      return apiClient.post<ApiResponse<FieldAnalyzeData[]>>(
        '/form/analyze/field',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    },
  },

  // 문서 관련 API
  document: {
    /**
     * 문서 요약 조회
     * @param documentId 문서 ID
     */
    getSummary: (documentId: number) =>
      apiClient.get<ApiResponse<DocumentSummaryData>>(
        `/document/${documentId}/summary`,
      ),

    /**
     * 문서 리스트 조회
     */
    getList: () => apiClient.get<ApiResponse<DocumentData[]>>(`/document/list`),

    /**
     * 문서 상세 조회
     * @param documentId 문서 ID
     */
    getDetail: (documentId: number) =>
      apiClient.get<ApiResponse<DocumentData>>(
        `/document/${documentId}/detail`,
      ),

    /**
     * 문서 작성 API
     * @param formId 사용할 양식의 기본 키
     * @param data 필드 정보 배열
     */
    writeDocument: (formId: number, data: DocumentWriteRequest) =>
      apiClient.post<ApiResponse<DocumentWriteResponseData>>(
        `/document/${formId}/write`,
        data,
      ),

    /**
     * 문서 업로드
     * @param file 업로드할 문서 파일
     */
    uploadDocument: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      return apiClient.post<ApiResponse<UploadDocumentResponseData>>(
        '/document',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    },

    /**
     * 문서 조언 API
     * @param documentId 조언을 받을 문서 ID
     */
    getAdvice: (documentId: number) =>
      apiClient.get<ApiResponse<DocumentAdviceData[]>>(
        `/document/${documentId}/advice`,
      ),

    /**
     * 문서 수정 API
     * @param documentId 수정할 문서 ID
     * @param data 수정할 필드 정보 배열
     */
    modifyDocument: (documentId: number, data: DocumentModifyRequest) =>
      apiClient.put<ApiResponse<DocumentModifyResponseData>>(
        `/document/${documentId}`,
        data,
      ),
  },

  // AI 관련 API
  ai: {
    /**
     * 이미지 스캔 API
     * @param file 스캔할 이미지 파일
     */
    scan: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      return flaskClient.post<AiScanResponse>('/ai/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
  },
}

// 실제 API 또는 Mock API를 반환
export const api = USE_API_MOCK ? mockApi : realApi

export { flaskClient }

export default api
