import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from "next/font/google";
import '@/styles/globals.css'
import KakaoScript from '@/components/KakaoScript'

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: 'Eye On',
  description: 'Eye On',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body
        className={
          `antialiased`
          // ${geistSans.variable} ${geistMono.variable}
        }
      >
        {children}
        <KakaoScript />
      </body>
    </html>
  )
}
