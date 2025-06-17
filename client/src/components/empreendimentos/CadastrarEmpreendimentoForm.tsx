'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

export interface EmpreendimentoData {
  nome: string
  endereco: string
  bairro: string
  tipo: 'Casa' | 'Apartamento' | 'Cobertura' | 'Loft' | 'Studio'
  dormitorios: number
  suites: number
  vagas: number
  area: number
  valor: number
  dataEntrega: string
  estagio: 'Planejado' | 'Em Construção' | 'Concluído'
  incorporador: string
  coordenador: string
}

export default function CadastrarEmpreendimentoForm() {
  const router = useRouter()
  const [values, setValues] = useState<EmpreendimentoData>({
    nome: '', endereco: '', bairro: '', tipo: 'Casa', dormitorios: 0, suites: 0, vagas: 0,
    area: 0, valor: 0, dataEntrega: '', estagio: 'Planejado', incorporador: '', coordenador: ''
  })
  const [error, setError] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value } = target
    const val = ['area', 'valor', 'dormitorios', 'suites', 'vagas'].includes(name)
      ? Number(value)
      : value
    setValues(prev => ({ ...prev, [name]: val }))
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const token = localStorage.getItem('access_token')
    if (!token) {
      setError('Usuário não autenticado')
      return
    }

    const payload = {
      nome: values.nome,
      endereco: values.endereco,
      bairro: values.bairro,
      tipo_imovel: values.tipo,
      dormitorios: values.dormitorios,
      suites: values.suites,
      vagas: values.vagas,
      area_m2: values.area,
      valor: values.valor,
      data_entrega: values.dataEntrega,
      estagio: values.estagio,
      incorporador: values.incorporador,
      coordenador: values.coordenador
    }

    try {
      const res = await fetch('http://localhost:8000/empreendimentos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Erro ao cadastrar')
      }
      setShowSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    }
  }

  const handleClose = () => {
    setShowSuccess(false)
  }

  const labelClass = 'block text-base font-semibold text-gray-800 mb-1'
  const inputClass = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-[#eb194b] focus:border-[#eb194b]'

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            <p className="mt-4 text-lg font-medium">Imóvel cadastrado com sucesso!</p>
            <button onClick={handleClose} className="mt-6 px-4 py-2 bg-[#eb194b] text-white rounded-md">Fechar</button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nome" className={labelClass}>Nome do Empreendimento</label>
            <input id="nome" name="nome" type="text" required value={values.nome} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="endereco" className={labelClass}>Endereço</label>
            <input id="endereco" name="endereco" type="text" required value={values.endereco} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="bairro" className={labelClass}>Bairro</label>
            <input id="bairro" name="bairro" type="text" required value={values.bairro} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="tipo" className={labelClass}>Tipo de Imóvel</label>
            <select id="tipo" name="tipo" value={values.tipo} onChange={handleChange} className={inputClass}>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Cobertura">Cobertura</option>
              <option value="Loft">Loft</option>
              <option value="Studio">Studio</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label htmlFor="incorporador" className={labelClass}>Incorporador</label>
            <input id="incorporador" name="incorporador" type="text" required value={values.incorporador} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="coordenador" className={labelClass}>Coordenador</label>
            <input id="coordenador" name="coordenador" type="text" required value={values.coordenador} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="dataEntrega" className={labelClass}>Data de Entrega</label>
            <input id="dataEntrega" name="dataEntrega" type="date" required value={values.dataEntrega} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="estagio" className={labelClass}>Estágio de Construção</label>
            <select id="estagio" name="estagio" value={values.estagio} onChange={handleChange} className={inputClass}>
              <option value="Planejado">Planejado</option>
              <option value="Em Construção">Em Construção</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="dormitorios" className={labelClass}>Dormitórios</label>
            <input id="dormitorios" name="dormitorios" type="number" min={0} required value={values.dormitorios} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="suites" className={labelClass}>Suítes</label>
            <input id="suites" name="suites" type="number" min={0} required value={values.suites} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="vagas" className={labelClass}>Vagas</label>
            <input id="vagas" name="vagas" type="number" min={0} required value={values.vagas} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  
          <div>
            <label htmlFor="area" className={labelClass}>Área (m²)</label>
            <input id="area" name="area" type="number" min={0} step={1} required value={values.area} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="valor" className={labelClass}>Valor (R$)</label>
            <input id="valor" name="valor" type="number" min={0} step={0.01} required value={values.valor} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div className="text-right">
          <button type="submit" className="px-6 py-2 bg-[#eb194b] text-white rounded-md shadow hover:bg-[#c9173f] transition">
            Cadastrar
          </button>
        </div>
      </form>
    </>
  )
}
