import { Toaster } from 'sonner'

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" closeButton />
    </>
  )
} 