import { Toaster } from 'sonner'

export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster position="top-right" closeButton />
    </>
  )
}
