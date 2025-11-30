import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  className?: string
  title?: string
}

export function Section({ children, className, title }: SectionProps) {
  return (
    <section className={cn('py-6', className)}>
      {title && (
        <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
      )}
      {children}
    </section>
  )
}