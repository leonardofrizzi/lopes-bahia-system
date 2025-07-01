'use client'

import { useState, useEffect } from 'react'
import EmpreendimentoForm from '@/components/empreendimentos/EmpreendimentoForm'

export interface Empreendimento {
  id: string
  nome: string
  dormitorios: number
  suites: number
  vagas: number
  area_m2: number
  data_entrega: string
  endereco: string
  bairro: string
  incorporador: string
  coordenador: string
}

type Filtros = {
  bairro: string
  estagio: string
  tipo: string
  nome: string
}

export default function EmpreendimentosComponent() {
  const [resultados, setResultados] = useState<Empreendimento[]>([])
  const [options, setOptions] = useState<{
    bairros: string[]
    estagios: string[]
    tipos: string[]
    nomes: string[]
  }>({ bairros: [], estagios: [], tipos: [], nomes: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // preenche os selects com valores únicos vindos da API
  useEffect(() => {
    fetch('http://localhost:8000/empreendimentos', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then((data: Empreendimento[]) => {
        const bairros = Array.from(new Set(data.map(e => e.bairro))).filter(Boolean)
        const estagios = Array.from(new Set(data.map(e => e.data_entrega))).filter(Boolean)
        const tipos = Array.from(new Set(data.map(e => e.nome))).filter(Boolean)
        const nomes = Array.from(new Set(data.map(e => e.nome))).filter(Boolean)
        setOptions({ bairros, estagios, tipos, nomes })
      })
      .catch(() => {})
  }, [])

  const handleBuscar = async (valores: Filtros) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (valores.nome) params.append('nome', valores.nome)
      if (valores.bairro) params.append('bairro', valores.bairro)
      if (valores.tipo) params.append('tipo_imovel', valores.tipo)
      if (valores.estagio) params.append('estagio', valores.estagio)

      const res = await fetch(
        `http://localhost:8000/empreendimentos?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        }
      )
      if (!res.ok) throw new Error('Erro ao buscar empreendimentos')
      const data: Empreendimento[] = await res.json()
      setResultados(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h2 className="text-3xl font-bold text-[#eb194b] mb-6">
        Buscar Empreendimentos
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <EmpreendimentoForm
          onBuscar={handleBuscar}
          bairros={options.bairros}
          estagios={options.estagios}
          tipos={options.tipos}
          nomes={options.nomes}
        />
      </div>

      {loading && (
        <div className="text-center text-gray-600 mb-4">Carregando...</div>
      )}
      {error && (
        <div className="text-center text-red-600 mb-4">{error}</div>
      )}

      {resultados.length > 0 && !loading && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Resultado da Consulta
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-[#eb194b] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Nome</th>
                  <th className="px-6 py-3">Dorms</th>
                  <th className="px-6 py-3">Suítes</th>
                  <th className="px-6 py-3">Vagas</th>
                  <th className="px-6 py-3 text-left">Área (m²)</th>
                  <th className="px-6 py-3">Entrega</th>
                  <th className="px-6 py-3 text-left">Endereço</th>
                  <th className="px-6 py-3 text-left">Bairro</th>
                  <th className="px-6 py-3 text-left">Incorporador</th>
                  <th className="px-6 py-3 text-left">Coordenador</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map(e => (
                  <tr
                    key={e.id}
                    className="bg-white hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {e.nome}
                    </td>
                    <td className="px-6 py-4 text-center">{e.dormitorios}</td>
                    <td className="px-6 py-4 text-center">{e.suites}</td>
                    <td className="px-6 py-4 text-center">{e.vagas}</td>
                    <td className="px-6 py-4 text-gray-600">{e.area_m2}</td>
                    <td className="px-6 py-4 text-center">{e.data_entrega}</td>
                    <td className="px-6 py-4 text-gray-600">{e.endereco}</td>
                    <td className="px-6 py-4 text-gray-600">{e.bairro}</td>
                    <td className="px-6 py-4 text-gray-600">{e.incorporador}</td>
                    <td className="px-6 py-4 text-gray-600">{e.coordenador}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
