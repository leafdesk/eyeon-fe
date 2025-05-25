import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * base64 문자열을 File 객체로 변환
 * @param base64 base64 문자열 (data:image/jpeg;base64, 접두사 포함 가능)
 * @param filename 파일명
 * @param mimeType MIME 타입 (기본값: image/png)
 */
export function base64ToFile(
  base64: string,
  filename: string,
  mimeType: string = 'image/png',
): File {
  // data:image/jpeg;base64, 접두사 제거
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64

  // base64를 바이너리로 변환
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: mimeType })

  return new File([blob], filename, { type: mimeType })
}

/**
 * base64 문자열을 data URL로 변환
 * @param base64 base64 문자열
 * @param mimeType MIME 타입 (기본값: image/png)
 */
export function base64ToDataUrl(
  base64: string,
  mimeType: string = 'image/png',
): string {
  // 이미 data URL 형태인 경우 그대로 반환
  if (base64.startsWith('data:')) {
    return base64
  }

  return `data:${mimeType};base64,${base64}`
}
