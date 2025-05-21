/**
 * API 모킹 여부
 */
export const USE_API_MOCK = false

/**
 * 양식 타입 상수
 */
export const FORM_TYPES = {
  RESUME: 'RESUME',
  CERTIFICATE: 'CERTIFICATE',
  CONSENT: 'CONSENT',
  SELF_INTRO: 'SELF_INTRO',
  REPORT: 'REPORT',
} as const

/**
 * 시각장애 여부 상수
 */
export const BLIND_STATUS = {
  TRUE: 'TRUE',
  FALSE: 'FALSE',
} as const

/**
 * UI 관련 설정
 */
export const UI_CONFIG = {
  SHOW_FIELD_INDEX: false, // 분석된 필드 인덱스 표시 여부
} as const
