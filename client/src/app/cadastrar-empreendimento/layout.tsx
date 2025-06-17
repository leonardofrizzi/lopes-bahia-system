'use client'

import React from 'react'
import DashboardLayout from '@/app/dashboard/layout'

export default function CadastrarEmpreendimentoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}