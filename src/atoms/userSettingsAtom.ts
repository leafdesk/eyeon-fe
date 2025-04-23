import { atom } from 'jotai'

/**
 * 음성 안내 활성화 여부
 * true: 음성 안내 사용
 * false: 음성 안내 비활성화
 */
export const voiceGuideAtom = atom<boolean>(true)
