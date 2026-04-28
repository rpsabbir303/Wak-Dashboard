import * as React from 'react'
import { cn } from '@/shared/utils/utils'

type Props = React.ComponentProps<'div'>

export function AuthCard({ className, children, ...props }: Props) {
  return (
    <div
      className={cn(
        // Premium SaaS glass card
        'w-full max-w-md rounded-2xl border border-white/40 bg-white/70 p-8 text-zinc-900 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
