'use client';
import { useState } from 'react';

interface Filtros {
  bairro: string;
  estagio: string;
  tipo: string;
  nome: string;
}

interface EmpreendimentoFormProps {
  onBuscar: (filtros: Filtros) => void;
}

export default function EmpreendimentoForm({ onBuscar }: EmpreendimentoFormProps) {
  const [bairro, setBairro] = useState('');
  const [estagio, setEstagio] = useState('');
  const [tipo, setTipo] = useState('');
  const [nome, setNome] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar({ bairro, estagio, tipo, nome });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Bairro</label>
        <input
          type="text"
          value={bairro}
          onChange={e => setBairro(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="Selecione..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Estágio do Empreendimento</label>
        <input
          type="text"
          value={estagio}
          onChange={e => setEstagio(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="Selecione..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tipo de Imóvel</label>
        <input
          type="text"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="Selecione..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Empreendimento</label>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="Pesquisar..."
        />
      </div>
      <div className="md:col-span-4 text-right mt-4">
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}