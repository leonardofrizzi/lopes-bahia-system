'use client';

import React, { FormEvent, useState, useEffect } from 'react';

interface Empreendimento {
  id: string;
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
  ngc?: number;
}

interface Props {
  isOpen: boolean;
  empreendimento: Empreendimento;
  onClose: () => void;
  onUpdated: (updated: Empreendimento) => void;
}

const TIPOS = ['Casa','Apartamento','Cobertura','Loft','Studio'] as const;
const ESTAGIOS = ['Planejado','Em Construção','Concluído'] as const;

export default function EditEmpreendimentoModal({
  isOpen,
  empreendimento,
  onClose,
  onUpdated,
}: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Omit<Empreendimento, 'id'>>({
    nome: '',
    tipo_imovel: '',
    dormitorios: undefined,
    suites: undefined,
    vagas: undefined,
    area_m2: undefined,
    data_entrega: '',
    estagio: '',
    endereco: '',
    bairro: '',
    cidade: '',
    incorporador: '',
    coordenador: '',
    link_book: '',
    link_tabela: '',
    ngc: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Preenche o form ao abrir
  useEffect(() => {
    if (isOpen) {
      const { id, ...rest } = empreendimento;
      setForm(rest);
      setStep(1);
      setError(null);
    }
  }, [isOpen, empreendimento]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      const res = await fetch(`/api/empreendimentos/${empreendimento.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `Status ${res.status}`);
      }
      const updated: Empreendimento = await res.json();
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label className="block">
              <span className="text-gray-700">Nome</span>
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                required
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">Data de Entrega</span>
              <input
                type="date"
                value={form.data_entrega}
                onChange={e => setForm(f => ({ ...f, data_entrega: e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
          </>
        );
      case 2:
        return (
          <>
            <label className="block">
              <span className="text-gray-700">Tipo de Imóvel</span>
              <select
                value={form.tipo_imovel}
                onChange={e => setForm(f => ({ ...f, tipo_imovel: e.target.value }))}
                required
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="" disabled>Selecione...</option>
                {TIPOS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">Estágio de Construção</span>
              <select
                value={form.estagio}
                onChange={e => setForm(f => ({ ...f, estagio: e.target.value }))}
                required
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="" disabled>Selecione...</option>
                {ESTAGIOS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700">Dormitórios</span>
              <input
                type="number"
                min="0"
                value={form.dormitorios ?? ''}
                onChange={e => setForm(f => ({ ...f, dormitórios: e.target.value === '' ? undefined : +e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Suítes</span>
              <input
                type="number"
                min="0"
                value={form.suites ?? ''}
                onChange={e => setForm(f => ({ ...f, suites: e.target.value === '' ? undefined : +e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Vagas</span>
              <input
                type="number"
                min="0"
                value={form.vagas ?? ''}
                onChange={e => setForm(f => ({ ...f, vagas: e.target.value === '' ? undefined : +e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Área (m²)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.area_m2 ?? ''}
                onChange={e => setForm(f => ({ ...f, area_m2: e.target.value === '' ? undefined : +e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
          </div>
        );
      case 4:
        return (
          <>
            <label className="block">
              <span className="text-gray-700">Endereço</span>
              <input
                type="text"
                value={form.endereco}
                onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">Bairro</span>
              <input
                type="text"
                value={form.bairro}
                onChange={e => setForm(f => ({ ...f, bairro: e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
          </>
        );
      case 5:
        return (
          <>
            <label className="block">
              <span className="text-gray-700">Cidade</span>
              <input
                type="text"
                value={form.cidade}
                onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">Incorporador</span>
              <input
                type="text"
                value={form.incorporador}
                onChange={e => setForm(f => ({ ...f, incorporador: e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">Coordenador</span>
              <input
                type="text"
                value={form.coordenador}
                onChange={e => setForm(f => ({ ...f, coordenador: e.target.value }))}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>
          </>
        );
      case 6:
        return (
          <>
            <label className="block">
              <span className="text-gray-700">Link do Book</span>
              <input
                type="url"
                value={form.link_book}
                onChange={e => setForm(f => ({ ...f, link_book: e.target.value }))}
                className="mt-1 w-full border border-red-200 rounded px-3 py-2"
              />
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">Link da Tabela</span>
              <input
                type="url"
                value={form.link_tabela}
                onChange={e => setForm(f => ({ ...f, link_tabela: e.target.value }))}
                className="mt-1 w-full border border-red-200 rounded px-3 py-2"
              />
            </label>
          </>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}   /* clicar no backdrop fecha */
    >
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-xl p-6 space-y-6"
        onClick={e => e.stopPropagation()}  /* evita fechamento ao clicar dentro */
      >
        {/* Botão de fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Fechar"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold">Editar Empreendimento</h3>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Indicador de passos */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 6 }, (_, i) => i + 1).map(n => (
            <div
              key={n}
              className={`
                w-8 h-8 flex items-center justify-center rounded-full
                ${step === n ? 'bg-[#eb194b] text-white' : 'bg-gray-200 text-gray-500'}
              `}
            >
              {n}
            </div>
          ))}
        </div>

        {/* Conteúdo do passo */}
        {renderStep()}

        {/* Botões de navegação */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            ← Anterior
          </button>
          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(s => Math.min(6, s + 1))}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Próximo →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#eb194b] text-white rounded hover:bg-[#c3133d]"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}