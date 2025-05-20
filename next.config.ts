import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'via.placeholder.com',
      'k.kakaocdn.net',
      'eyeon-bucket.s3.ap-northeast-2.amazonaws.com',
    ],
  },
}

export default nextConfig
