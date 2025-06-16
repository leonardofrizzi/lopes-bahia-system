// src/components/dashboard/CapacitacaoComponent.tsx
'use client';
import { useState, useEffect } from 'react';

interface Tema {
  id: number;
  titulo: string;
  imagem: string;
  aulas: Aula[];
}

interface Aula {
  titulo: string;
  descricao: string;
  videoUrl: string;
  assistido: boolean;
  favorito?: boolean;
  avaliacao?: number;
  anotacoes?: string;
}

interface Comentario {
  aula: string;
  autor: string;
  texto: string;
}

const temasFicticios: Tema[] = [
  {
    id: 1,
    titulo: 'Pílulas de Conhecimento',
    imagem: '/images/pilulas.png',
    aulas: [
      {
        titulo: 'Gatilhos Mentais - Conceito',
        descricao: 'Entenda o conceito e importância dos gatilhos mentais na tomada de decisão.',
        videoUrl: '/videos/aula1.mp4',
        assistido: false
      },
      {
        titulo: 'Benefícios na Intermediação',
        descricao: 'Veja como os gatilhos mentais contribuem para melhorar o processo de intermediação.',
        videoUrl: '/videos/aula2.mp4',
        assistido: false
      },
    ],
  },
  {
    id: 2,
    titulo: 'Webinar ao Vivo',
    imagem: '/images/webinar.png',
    aulas: [
      {
        titulo: 'Técnicas de Apresentação',
        descricao: 'Dicas práticas para conduzir apresentações ao vivo com segurança e clareza.',
        videoUrl: '/videos/aula3.mp4',
        assistido: false
      },
    ],
  }
];

export default function CapacitacaoComponent() {
  const [temaSelecionado, setTemaSelecionado] = useState<Tema | null>(null);
  const [aulaSelecionada, setAulaSelecionada] = useState<Aula | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [comentarioInput, setComentarioInput] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'informacoes' | 'comentarios'>('informacoes');
  const [anotacoes, setAnotacoes] = useState('');

  useEffect(() => {
    if (temaSelecionado && !aulaSelecionada && temaSelecionado.aulas.length > 0) {
      setAulaSelecionada(temaSelecionado.aulas[0]);
    }
  }, [temaSelecionado]);

  useEffect(() => {
    if (aulaSelecionada) {
      const anotacaoSalva = localStorage.getItem(`anotacao-${aulaSelecionada.titulo}`);
      if (anotacaoSalva) setAnotacoes(anotacaoSalva);
    }
  }, [aulaSelecionada]);

  const salvarAnotacao = () => {
    if (aulaSelecionada) {
      localStorage.setItem(`anotacao-${aulaSelecionada.titulo}`, anotacoes);
    }
  };

  const marcarAssistido = () => {
    if (!aulaSelecionada || !temaSelecionado) return;
    const novasAulas = temaSelecionado.aulas.map(a =>
      a.titulo === aulaSelecionada.titulo ? { ...a, assistido: true } : a
    );
    setTemaSelecionado({ ...temaSelecionado, aulas: novasAulas });
    setAulaSelecionada({ ...aulaSelecionada, assistido: true });
  };

  const progresso = temaSelecionado
    ? Math.floor((temaSelecionado.aulas.filter(a => a.assistido).length / temaSelecionado.aulas.length) * 100)
    : 0;

  if (!temaSelecionado) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Meus conteúdos e progressos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {temasFicticios.map((tema) => (
            <div
              key={tema.id}
              onClick={() => setTemaSelecionado(tema)}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition"
            >
              <img src={tema.imagem} alt={tema.titulo} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-center">{tema.titulo}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => {
          setTemaSelecionado(null);
          setAulaSelecionada(null);
        }}
        className="mb-4 text-sm text-pink-600 hover:underline"
      >
        ← Voltar aos temas
      </button>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{temaSelecionado.titulo}</h2>
        <div className="w-1/3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-pink-500" style={{ width: `${progresso}%` }}></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <video src={aulaSelecionada?.videoUrl} controls className="w-full rounded-lg mb-4 h-[480px] object-cover" />

          <div className="border-b border-gray-300 mb-4 flex gap-6">
            <button className={`${abaAtiva === 'informacoes' ? 'border-b-2 border-pink-600 font-medium' : 'text-gray-600'} pb-2`} onClick={() => setAbaAtiva('informacoes')}>Informações</button>
            <button className={`${abaAtiva === 'comentarios' ? 'border-b-2 border-pink-600 font-medium' : 'text-gray-600'} pb-2`} onClick={() => setAbaAtiva('comentarios')}>Comentários</button>
          </div>

          {abaAtiva === 'informacoes' && (
            <div>
              <h3 className="text-xl font-semibold mb-2">{aulaSelecionada?.titulo}</h3>
              <p className="text-sm text-gray-700 mb-4">{aulaSelecionada?.descricao}</p>

              <div className="flex gap-2 mb-4">
                <button onClick={marcarAssistido} className="px-4 py-2 border rounded">✔ Concluir</button>
                <button className="px-4 py-2 border rounded">♡ Favoritar</button>
                <button className="px-4 py-2 border rounded">★ Avaliar</button>
              </div>

              <div>
                <h4 className="font-medium mb-2">Anotações</h4>
                <textarea
                  className="w-full border p-2 rounded h-28"
                  value={anotacoes}
                  onChange={(e) => setAnotacoes(e.target.value)}
                />
                <button onClick={salvarAnotacao} className="mt-2 px-4 py-1 bg-pink-600 text-white rounded">Salvar</button>
              </div>
            </div>
          )}

          {abaAtiva === 'comentarios' && (
            <div>
              <div className="space-y-2 mb-2">
                {comentarios.filter(c => c.aula === aulaSelecionada?.titulo).map((c, i) => (
                  <div key={i} className="bg-gray-100 p-2 rounded">
                    <strong>{c.autor}</strong>: {c.texto}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={comentarioInput}
                  onChange={(e) => setComentarioInput(e.target.value)}
                  placeholder="Escreva um comentário"
                  className="flex-1 border rounded px-3 py-1"
                />
                <button
                  onClick={() => {
                    if (!comentarioInput.trim() || !aulaSelecionada) return;
                    setComentarios([...comentarios, { aula: aulaSelecionada.titulo, autor: 'Você', texto: comentarioInput }]);
                    setComentarioInput('');
                  }}
                  className="bg-pink-600 text-white px-4 rounded"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 space-y-4">
          {temaSelecionado.aulas.map((aula, index) => (
            <div
              key={index}
              onClick={() => setAulaSelecionada(aula)}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                aulaSelecionada?.titulo === aula.titulo ? 'bg-pink-100 border-pink-400' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm">{aula.titulo}</p>
                {aula.assistido && <span className="text-green-600 text-xs">✔</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
