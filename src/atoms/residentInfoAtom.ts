import { atom } from 'jotai'
import { ResidentResponseData } from '@/lib/api-types'

/**
 * 주민등록증 인식 정보 atom
 * 신분증 인식 API에서 가져온 정보를 저장
 */
export const residentInfoAtom = atom<ResidentResponseData | null>(null)

/**
 * 회원가입 단계에서 사용할 추가 사용자 정보 atom
 */
export const signupFormAtom = atom<{
  name: string
  residentNumber: string
  address: string
  detailAddress?: string
  phoneNumber: string
  email: string
} | null>(null)
