import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'w-full h-[56px] flex items-center justify-center rounded-[6px] text-base font-semibold transition-all disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-white text-[#0F1626] disabled:bg-white/20 disabled:text-[#9B9B9B]',
        sub: 'bg-transparent border border-[#9B9B9B] text-[#9B9B9B] disabled:opacity-50',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
