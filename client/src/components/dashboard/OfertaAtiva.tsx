// src/components/dashboard/OfertaAtiva.tsx
'use client'

import { useEffect, useState, FormEvent } from 'react'

type RawLead = {
  id: string
  attributes: {
    customer: { name: string; phone: string; email?: string }
    product: {
      description: string | null
      tags?: { name: string }[]
      real_estate_detail?: { negotiation_name: string }
    }
  }
}

export default function OfertaAtiva() {
  const [leads, setLeads]               = useState<RawLead[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)

  const [clientName, setClientName]     = useState('')
  const [clientPhone, setClientPhone]   = useState('')
  const [clientEmail, setClientEmail]   = useState('')
  const [status, setStatus]             = useState('')
  const [feedback, setFeedback]         = useState('')

  // 1) Quando montar, buscar leads e restaurar índice do localStorage
  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/proxy/leads')
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const json = await res.json()
        // o array vem em json.data
        const arr: RawLead[] = Array.isArray(json.data) ? json.data : []
        if (!arr.length) throw new Error('Nenhum lead retornado')
        setLeads(arr)
        // restaurar índice salvo
        const saved = localStorage.getItem('oferta_current_index')
        if (saved !== null) {
          const idx = Number(saved)
          if (!isNaN(idx) && idx < arr.length) {
            setCurrentIndex(idx)
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [])

  // 2) Quando muda currentIndex ou leads, preencher o formulário
  useEffect(() => {
    const lead = leads[currentIndex]
    if (!lead) return
    const cust = lead.attributes.customer
    setClientName(cust.name)
    setClientPhone(cust.phone)
    setClientEmail(cust.email || '')
    setStatus('')
    setFeedback('')
    // garantir que o usuário “veja” logo esse lead ao recarregar
    localStorage.setItem('oferta_current_index', String(currentIndex))
  }, [currentIndex, leads])

  // 3) Ao submeter, chamar API e só então avançar o índice
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const lead = leads[currentIndex]
    try {
      const res = await fetch(`/api/proxy/leads/${lead.id}/mark_as_interacted`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          feedback,
          name: clientName,
          phone: clientPhone,
          email: clientEmail,
        }),
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      // só incrementa se deu certo
      setCurrentIndex(i => {
        const next = Math.min(i + 1, leads.length - 1)
        localStorage.setItem('oferta_current_index', String(next))
        return next
      })
    } catch (e) {
      alert('Erro ao registrar: ' + (e as Error).message)
    }
  }

  // 4) loading / error / sem leads
  if (loading)
    return <p className="text-center text-gray-500">Carregando oferta ativa…</p>
  if (error)
    return <p className="text-center text-red-600">Erro: {error}</p>
  if (!leads.length)
    return <p className="text-center text-gray-500">Nenhum lead disponível.</p>

  // 5) valores atuais
  const lead = leads[currentIndex]
  const prod = lead.attributes.product
  const descricao =
    prod.description ||
    prod.real_estate_detail?.negotiation_name ||
    '—'

  return (
    <div className="min-h-screen bg-gray-100 py-12 flex flex-col">
      <div className="mx-auto w-full max-w-3xl px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-8"
        >
          {/* — Cabeçalho do Mailing — */}
          <div className="border-b pb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Mailing – {descricao}
            </h3>
            <p className="text-gray-700">
              <strong>Descrição do produto:</strong> {descricao}
            </p>
            {prod.tags && (
              <div className="mt-3 flex flex-wrap gap-2">
                {prod.tags.map(t => (
                  <span
                    key={t.name}
                    className="bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* — Dados do Cliente — */}
          <div className="bg-red-50 rounded-lg p-6">
            <h4 className="inline-block bg-[#eb194b] text-white px-4 py-1 rounded mb-4">
              Dados do Cliente
            </h4>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-gray-700">Nome do Cliente:</span>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#eb194b]/40"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Telefone:</span>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#eb194b]/40"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Email:</span>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#eb194b]/40"
                />
              </label>
            </div>
          </div>

          {/* — Resultado da Chamada — */}
          <div className="bg-red-50 rounded-lg p-6">
            <h4 className="inline-block bg-[#eb194b] text-white px-4 py-1 rounded mb-4">
              Resultado da Chamada
            </h4>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-gray-700">Status da Chamada:</span>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#eb194b]/40"
                >
                  <option value="">Selecione…</option>
                  <option value="interessado">Interessado</option>
                  <option value="nao_interessado">Não interessado</option>
                  <option value="agendar_retorno">Agendar retorno</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Feedback:</span>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-[#eb194b]/40"
                />
              </label>
            </div>
          </div>

          {/* — Botão de Ação — */}
          <button
            type="submit"
            className="w-full bg-[#eb194b] hover:bg-[#c3133d] text-white font-semibold py-3 rounded-lg transition"
          >
            Registrar e selecionar próximo cliente
          </button>
        </form>
      </div>
    </div>
  )
}