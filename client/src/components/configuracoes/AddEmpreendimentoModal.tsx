// src/components/configuracoes/AddEmpreendimentoModal.tsx
'use client';

import React, { FormEvent, useState } from 'react';

interface EmpreendimentoCreate {
  id?: string;
  nome: string;
  tipo_imovel: string;
  dormitorios?: number;
  suites?: number;
  vagas?: number;
  area_m2?: number;
  data_entrega?: string;
  estagio?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  incorporador?: string;
  coordenador?: string;
  link_book?: string;
  link_tabela?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (emp: EmpreendimentoCreate) => void;
}

export default function AddEmpreendimentoModal({ isOpen, onClose, onAdded }: Props) {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [tipoImovel, setTipoImovel] = useState('');
  const [estagio, setEstagio] = useState('');
  const [dormitorios, setDormitorios] = useState<number | ''>('');
  const [suites, setSuites] = useState<number | ''>('');
  const [vagas, setVagas] = useState<number | ''>('');
  const [area, setArea] = useState<number | ''>('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [incorporador, setIncorporador] = useState('');
  const [coordenador, setCoordenador] = useState('');
  const [linkBook, setLinkBook] = useState('');
  const [linkTabela, setLinkTabela] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token') || '';
      const body: EmpreendimentoCreate = {
        nome,
        data_entrega: dataEntrega || undefined,
        tipo_imovel: tipoImovel,
        estagio:      estagio || undefined,
        dormitorios: typeof dormitorios === 'number' ? dormitorios : undefined,
        suites:      typeof suites     === 'number' ? suites     : undefined,
        vagas:       typeof vagas      === 'number' ? vagas      : undefined,
        area_m2:     typeof area       === 'number' ? area       : undefined,
        endereco:     endereco || undefined,
        bairro:       bairro   || undefined,
        cidade:       cidade   || undefined,
        incorporador: incorporador || undefined,
        coordenador:  coordenador  || undefined,
        link_book:    linkBook      || undefined,
        link_tabela:  linkTabela    || undefined,
      };
      const res = await fetch('/api/empreendimentos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `Status ${res.status}`);
      }
      const newEmp: EmpreendimentoCreate = await res.json();
      onAdded(newEmp);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 overflow-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold mb-4">Cadastrar Empreendimento</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Indicador de passos */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-full text-sm font-medium
                ${step === n
                  ? 'bg-[#eb194b] text-white'
                  : 'bg-gray-200 text-gray-500'}
              `}
            >
              {n}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Altura fixa por etapa */}
          <div className="min-h-[200px]">
            {/* Etapa 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <label className="block text-gray-700">
                  Nome
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                  />
                </label>
                <label className="block text-gray-700">
                  Data de Entrega
                  <input
                    type="date"
                    value={dataEntrega}
                    onChange={(e) => setDataEntrega(e.target.value)}
                    className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                  />
                </label>
              </div>
            )}

            {/* Etapa 2 */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700">
                  Tipo de Imóvel
                  <select
                    value={tipoImovel}
                    onChange={(e) => setTipoImovel(e.target.value)}
                    required
                    className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                  >
                    <option value="">Selecione…</option>
                    <option>Casa</option>
                    <option>Apartamento</option>
                    <option>Cobertura</option>
                    <option>Loft</option>
                    <option>Studio</option>
                  </select>
                </label>
                <label className="block text-gray-700">
                  Estágio
                  <select
                    value={estagio}
                    onChange={(e) => setEstagio(e.target.value)}
                    required
                    className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                  >
                    <option value="">Selecione…</option>
                    <option>Planejado</option>
                    <option>Em Construção</option>
                    <option>Concluído</option>
                  </select>
                </label>
              </div>
            )}

            {/* Etapa 3 */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Dormitórios', value: dormitorios, setter: setDormitorios },
                  { label: 'Suítes',      value: suites,     setter: setSuites },
                  { label: 'Vagas',       value: vagas,      setter: setVagas },
                  { label: 'Área (m²)',   value: area,       setter: setArea, step: 0.1 }
                ].map((fld) => (
                  <label key={fld.label} className="block text-gray-700">
                    {fld.label}
                    <input
                      type="number"
                      min={0}
                      step={fld.step ?? 1}
                      value={fld.value}
                      onChange={(e) =>
                        fld.setter(e.target.value === '' ? '' : +e.target.value)
                      }
                      className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                    />
                  </label>
                ))}
              </div>
            )}

            {/* Etapa 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <label className="block text-gray-700">
                  Endereço
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                  />
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="block text-gray-700">
                    Bairro
                    <input
                      type="text"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                    />
                  </label>
                  <label className="block text-gray-700">
                    Cidade
                    <input
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Etapa 5 */}
            {step === 5 && (
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700">
                  Incorporador
                  <input
                    type="text"
                    value={incorporador}
                    onChange={(e) => setIncorporador(e.target.value)}
                    className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                  />
                </label>
                <label className="block text-gray-700">
                  Coordenador
                  <input
                    type="text"
                    value={coordenador}
                    onChange={(e) => setCoordenador(e.target.value)}
                    className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                  />
                </label>
              </div>
            )}

            {/* Etapa 6 */}
            {step === 6 && (
              <div className="space-y-4">
                <label className="block text-gray-700">
                  Link do Book
                  <input
                    type="url"
                    value={linkBook}
                    onChange={(e) => setLinkBook(e.target.value)}
                    className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                  />
                </label>
                <label className="block text-gray-700">
                  Link da Tabela
                  <input
                    type="url"
                    value={linkTabela}
                    onChange={(e) => setLinkTabela(e.target.value)}
                    className="mt-1 w-full border border-red-100 focus:border-[#eb194b] rounded px-3 py-2"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Navegação */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              ← Anterior
            </button>
            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Próximo →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-[#eb194b] text-white hover:bg-[#c3133d]"
              >
                {loading ? 'Salvando...' : 'Adicionar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}