import { ReactNode } from 'react'
import { Container } from '@/components/core/Container'

interface PageContainerProps {
  children: ReactNode
  sidebar?: ReactNode
}

export function PageContainer({ children, sidebar }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {sidebar}
        <main className="flex-1">
          <Container>
            {children}
          </Container>
        </main>
      </div>
    </div>
  )
}