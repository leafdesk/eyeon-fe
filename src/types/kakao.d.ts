interface KakaoAuthOptions {
  redirectUri: string
  throughTalk?: boolean
}

interface KakaoAuth {
  authorize: (options: KakaoAuthOptions) => void
}

interface KakaoStatic {
  init: (apiKey: string) => void
  isInitialized: () => boolean
  Auth: KakaoAuth
}

declare global {
  interface Window {
    Kakao?: KakaoStatic
  }
}

export {}
