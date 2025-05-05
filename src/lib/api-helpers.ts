import { AxiosResponse } from 'axios'
import { toast } from 'sonner'
import type { ApiResponse } from './api-types'

/**
 * API 응답을 처리하는 헬퍼 함수
 * @param apiCall API 호출 Promise
 * @param errorMessage 실패 시 표시할 기본 에러 메시지
 * @param defaultValue 실패 시 반환할 기본값
 * @returns API 응답 데이터 또는 기본값
 */
export async function handleApiResponse<T, D = any>(
  apiCall: Promise<AxiosResponse<ApiResponse<T>>>,
  errorMessage: string,
  defaultValue: D,
): Promise<T | D> {
  try {
    const response = await apiCall

    if (response.data.isSuccess) {
      return response.data.data
    } else {
      toast.error(response.data.message || errorMessage)
      return defaultValue
    }
  } catch (error: any) {
    console.error(`API 오류: ${errorMessage}`, error)
    toast.error(error.response?.data?.message || errorMessage)
    return defaultValue
  }
}

/**
 * 토큰을 저장하고 결과를 처리하는 함수
 * @param apiCall API 호출 Promise
 * @param errorMessage 실패 시 표시할 기본 에러 메시지
 * @returns 성공 여부
 */
export async function handleAuthResponse(
  apiCall: Promise<AxiosResponse<ApiResponse<{ token: string }>>>,
  errorMessage: string,
): Promise<boolean> {
  try {
    const response = await apiCall

    if (response.data.isSuccess && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token)
      return true
    } else {
      toast.error(response.data.message || errorMessage)
      return false
    }
  } catch (error: any) {
    console.error(`인증 오류: ${errorMessage}`, error)
    toast.error(error.response?.data?.message || errorMessage)
    return false
  }
}

/**
 * 토큰을 가져오는 함수
 * @returns 토큰 문자열 또는 null
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

/**
 * 로그아웃 처리 함수
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}

/**
 * 인증 상태 확인 함수
 * @returns 인증 여부
 */
export function isAuthenticated(): boolean {
  return getToken() !== null
}
