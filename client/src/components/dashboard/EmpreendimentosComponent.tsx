'use client'
import { useState } from 'react'
import EmpreendimentoForm from '../empreendimentos/EmpreendimentoForm'

interface Empreendimento {
  id: string
  produto: string
  dormitórios: number
  suítes: number
  vagas: number
  área: string
  dataEntrega: string
  endereço: string
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
  const [filtros, setFiltros] = useState<Filtros>({
    bairro: '',
    estagio: '',
    tipo: '',
    nome: '',
  })
  const [resultados, setResultados] = useState<Empreendimento[]>([])

  const handleBuscar = (valores: Filtros) => {
    setFiltros(valores)

    const mock: Empreendimento[] = [
      {
        id: '1',
        produto: 'Villaggio Jardins',
        dormitórios: 3,
        suítes: 1,
        vagas: 2,
        área: '113.00 a 142.00m²',
        dataEntrega: '01/05/2027',
        endereço: 'Rua Leonor Calmon',
        bairro: 'Cidade Jardim',
        incorporador: 'Prima',
        coordenador: 'Daniela • 71 9 9999 9999',
      },
      {
        id: '2',
        produto: 'Rivê',
        dormitórios: 2,
        suítes: 1,
        vagas: 1,
        área: '97.00 a 143.00m²',
        dataEntrega: '01/04/2028',
        endereço: 'Rua do Rio Vermelho',
        bairro: 'Rio Vermelho',
        incorporador: 'Moura Dubeux',
        coordenador: 'Caio • 71 9 9999 9999',
      },
    ]
    setResultados(mock)
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#eb194b]">Buscar Empreendimentos</h2>
      <div className="p-6 bg-white rounded-lg shadow">
        <EmpreendimentoForm onBuscar={handleBuscar} />
      </div>
      {resultados.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800">Resultado da Consulta</h3>
          <div className="overflow-auto mt-4">
            <table className="min-w-full table-auto">
              <thead className="bg-[#eb194b] text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Produto</th>
                  <th className="px-4 py-2">Dorms</th>
                  <th className="px-4 py-2">Suítes</th>
                  <th className="px-4 py-2">Vagas</th>
                  <th className="px-4 py-2 text-left">Área</th>
                  <th className="px-4 py-2">Entrega</th>
                  <th className="px-4 py-2 text-left">Endereço</th>
                  <th className="px-4 py-2 text-left">Bairro</th>
                  <th className="px-4 py-2 text-left">Incorporador</th>
                  <th className="px-4 py-2 text-left">Coordenador</th>
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-700">{e.produto}</td>
                    <td className="px-4 py-2 text-center">{e.dormitórios}</td>
                    <td className="px-4 py-2 text-center">{e.suítes}</td>
                    <td className="px-4 py-2 text-center">{e.vagas}</td>
                    <td className="px-4 py-2 text-gray-600">{e.área}</td>
                    <td className="px-4 py-2 text-center">{e.dataEntrega}</td>
                    <td className="px-4 py-2 text-gray-600">{e.endereço}</td>
                    <td className="px-4 py-2 text-gray-600">{e.bairro}</td>
                    <td className="px-4 py-2 text-gray-600">{e.incorporador}</td>
                    <td className="px-4 py-2 text-gray-600">{e.coordenador}</td>
                    <td className="px-4 py-2">
                      <button className="bg-[#eb194b] text-white px-3 py-1 rounded hover:bg-red-600">Book</button>
                    </td>
                    <td className="px-4 py-2">
                      <button className="bg-[#eb194b] text-white px-3 py-1 rounded hover:bg-red-600">Tabela</button>
                    </td>
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