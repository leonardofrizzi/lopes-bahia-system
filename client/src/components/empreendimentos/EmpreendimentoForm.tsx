'use client'

import React, { useState, FormEvent } from 'react'

interface Filtros {
  bairro: string
  estagio: string
  tipo: string
  nome: string
}

interface EmpreendimentoFormProps {
  bairros: string[]
  estagios: string[]
  tipos: string[]
  nomes: string[]
  onBuscar: (filtros: Filtros) => void
}

export default function EmpreendimentoForm({ bairros, estagios, tipos, nomes, onBuscar }: EmpreendimentoFormProps) {
  const [bairro, setBairro] = useState<string>('')
  const [estagio, setEstagio] = useState<string>('')
  const [tipo, setTipo] = useState<string>('')
  const [nome, setNome] = useState<string>('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onBuscar({ bairro, estagio, tipo, nome })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label htmlFor="bairro" className="block text-sm font-medium mb-1">Bairro</label>
        <select
          id="bairro"
          value={bairro}
          onChange={e => setBairro(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Todos</option>
          {bairros.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="estagio" className="block text-sm font-medium mb-1">Estágio do Empreendimento</label>
        <select
          id="estagio"
          value={estagio}
          onChange={e => setEstagio(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Todos</option>
          {estagios.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tipo" className="block text-sm font-medium mb-1">Tipo de Imóvel</label>
        <select
          id="tipo"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Todos</option>
          {tipos.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="nome" className="block text-sm font-medium mb-1">Empreendimento</label>
        <select
          id="nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Todos</option>
          {nomes.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-4 text-right mt-4">
        <button
          type="submit"
          className="bg-[#eb194b] text-white px-6 py-2 rounded hover:bg-[#c9173f] transition"
        >
          Buscar
        </button>
      </div>
    </form>
  )
}
