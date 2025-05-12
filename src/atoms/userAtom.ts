import { atom } from 'jotai'
import { UserInfoData } from '@/lib/api-types'

/**
 * 사용자 정보 atom
 * API에서 가져온 사용자 정보를 저장
 */
export const userInfoAtom = atom<UserInfoData | null>(null)

/**
 * 사용자 정보 로딩 상태 atom
 */
export const userInfoLoadingAtom = atom<boolean>(false)

/**
 * 사용자 정보 에러 상태 atom
 */
export const userInfoErrorAtom = atom<string | null>(null)
