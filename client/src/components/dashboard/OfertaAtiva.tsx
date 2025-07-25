'use client'

import { useEffect, useState } from 'react'

type RawResponse = {
  // adapte aqui caso a API retorne outro wrapper
  data?: Array<{
    nome: string
    telefone: string
    empreendimento: string
  }>
  leads?: Array<{
    nome: string
    telefone: string
    empreendimento: string
  }>
  // às vezes vem no root:
  //  itself: Array<...>
}

export default function OfertaAtiva() {
  const [leads, setLeads]     = useState<RawResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro]       = useState('')

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/proxy/leads')
        if (!res.ok) throw new Error(`Status ${res.status}`)

        const json: RawResponse = await res.json()
        // detecta onde está o array:
        const arr =
          Array.isArray((json as any).data)      ? (json as any).data :
          Array.isArray((json as any).leads)     ? (json as any).leads :
          Array.isArray(json)                    ? (json as any) :
                                                  []

        if (arr.length === 0) {
          setErro('Nenhum lead encontrado.')
        } else {
          setLeads(arr)
        }
      } catch (e) {
        setErro(e instanceof Error
          ? `Erro ao buscar leads: ${e.message}`
          : 'Erro desconhecido.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  if (loading) return <div className="text-gray-500">Carregando leads...</div>
  if (erro)     return <div className="text-red-500">{erro}</div>

  return (
    <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Oferta Ativa</h2>
      {leads.map((lead, idx) => (
        <div
          key={idx}
          className="mb-3 p-3 border-b last:border-b-0"
        >
          <p><strong>Nome:</strong> {lead.nome}</p>
          <p><strong>Telefone:</strong> {lead.telefone}</p>
          <p><strong>Empreendimento:</strong> {lead.empreendimento}</p>
        </div>
      ))}
    </div>
  )
}
