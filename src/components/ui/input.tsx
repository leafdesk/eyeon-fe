import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // 기본 스타일
        'w-full min-w-0 h-[48px] px-4 bg-[#1E2436] rounded-[6px] font-normal text-sm text-white placeholder:text-[#9B9B9B] border border-transparent outline-none transition-colors',

        // 포커스 스타일
        'focus-visible:border-white', // focus-visible:ring-white focus-visible:ring-1

        // 유효성 에러 스타일 (aria-invalid)
        'aria-invalid:border-destructive', // aria-invalid:ring-destructive aria-invalid:ring-1

        // 비활성화 스타일
        'disabled:opacity-50 disabled:cursor-not-allowed',

        className,
      )}
      {...props}
    />
  )
}

export { Input }
