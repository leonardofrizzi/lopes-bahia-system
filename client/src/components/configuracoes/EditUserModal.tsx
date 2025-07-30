// src/components/dashboard/EditUserModal.tsx
'use client'

import React, { FormEvent, useState, useEffect } from 'react'
import { User as UserType } from '@/components/dashboard/ConfiguracaoComponent'

interface Props {
  isOpen: boolean
  user: UserType
  onClose: () => void
  onUpdated: (user: UserType) => void
}

const CARGOS = [
  'superadmin',
  'diretor',
  'gerente',
  'corretor de imoveis',
  'operacional',
] as const

export default function EditUserModal({ isOpen, user, onClose, onUpdated }: Props) {
  const [nome, setNome] = useState(user.nome)
  const [cargo, setCargo] = useState<typeof CARGOS[number]>(user.cargo as any)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setNome(user.nome)
      setCargo(user.cargo as any)
      setError(null)
    }
  }, [user, isOpen])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('access_token') || ''
      const res = await fetch(`/api/users/${user.cpf}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, cargo }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || `Status ${res.status}`)
      }

      const updated: UserType = await res.json()
      onUpdated(updated)
      onClose()
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
        <h3 className="text-xl font-semibold mb-4">Editar Usuário</h3>
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

          {/* CPF: tel + pattern */}
          <label className="block">
            <span className="text-gray-700">CPF</span>
            <input
              type="tel"
              inputMode="numeric"
              pattern="\d{11}"
              title="Digite exatamente 11 dígitos numéricos"
              value={user.cpf}
              disabled
              className="mt-1 w-full border border-gray-200 bg-gray-100 rounded px-3 py-2"
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
              disabled={loading}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[#eb194b] text-white hover:bg-[#c3133d] transition"
            >
              {loading ? 'Salvando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}