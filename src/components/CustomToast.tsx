import { useEffect, useState } from 'react'

interface CustomToastProps {
  message: string
  duration?: number
  isVisible: boolean
  onClose: () => void
}

export default function CustomToast({
  message,
  duration = 1500,
  isVisible,
  onClose,
}: CustomToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 flex justify-center items-center">
      <div
        style={{
          background: '#E0E0E0',
          color: '#0F1626',
          height: '38px',
          padding: '0 16px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        {message}
      </div>
    </div>
  )
}
