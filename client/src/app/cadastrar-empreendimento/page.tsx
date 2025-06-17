'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/dashboard/Navbar'
import Sidebar from '@/components/dashboard/Sidebar'
import CadastrarEmpreendimentoForm from '@/components/empreendimentos/CadastrarEmpreendimentoForm'

export default function CadastrarEmpreendimentoPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem('usuarioLogado')
    if (!stored) {
      router.replace('/login')
      return
    }

    const user = JSON.parse(stored)
    if (user.cargo !== 'Administrador') {
      router.replace('/dashboard')
    }
  }, [router])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold text-[#eb194b] mb-6 text-center">
            Cadastrar Empreendimento
          </h1>
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <CadastrarEmpreendimentoForm />
          </div>
        </main>
      </div>
    </div>
  )
}
