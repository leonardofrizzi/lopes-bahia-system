// src/components/dashboard/AddUserModal.tsx
'use client'

import React, { FormEvent, useState } from 'react'
import { User as UserType } from '../dashboard/ConfiguracaoComponent'

interface Props {
  isOpen: boolean
  onClose: () => void
  onAdded: (user: UserType) => void
}

const CARGOS = [
  'superadmin',
  'diretor',
  'gerente',
  'corretor de imoveis',
  'operacional',
] as const

export default function AddUserModal({ isOpen, onClose, onAdded }: Props) {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [cargo, setCargo] = useState<typeof CARGOS[number]>('operacional')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('access_token') || ''
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, cpf, senha, cargo }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || `Status ${res.status}`)
      }
      const newUser: UserType = await res.json()
      onAdded(newUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-semibold mb-4">Novo Usuário</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <label className="block">
            <span className="text-gray-700">Nome</span>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </label>

          {/* CPF: agora com type="tel" e pattern explícito de 11 dígitos */}
          <label className="block">
            <span className="text-gray-700">CPF</span>
            <input
              type="tel"
              inputMode="numeric"
              pattern="\d{11}"
              title="Digite exatamente 11 dígitos numéricos"
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </label>

          {/* Senha */}
          <label className="block">
            <span className="text-gray-700">Senha</span>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </label>

          {/* Cargo */}
          <label className="block">
            <span className="text-gray-700">Cargo</span>
            <select
              value={cargo}
              onChange={e => setCargo(e.target.value as any)}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            >
              {CARGOS.map(c => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </label>

          {/* Botões */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-100"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#eb194b] text-white hover:bg-[#c3133d]"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}