// src/components/dashboard/EmDesenvolvimentoComponent.tsx
"use client";
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

export default function EmDesenvolvimentoComponent({ titulo }: { titulo: string }) {
  const router = useRouter();
  const { setActiveComponent } = useNavigation();

  const voltarParaInicio = () => {
    // Primeiro definir o componente ativo como 'home'
    setActiveComponent('home');
    
    // Em seguida, usar um timeout curto antes de navegar para o dashboard
    // Isso dá tempo ao estado de ser atualizado antes da navegação
    setTimeout(() => {
      router.push('/dashboard');
    }, 50);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{titulo}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          {/* Ícone de construção */}
          <div className="mb-6 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-[#eb194b] mb-4">Módulo em Desenvolvimento</h2>
          
          <p className="text-gray-600 max-w-lg mx-auto">
            Este módulo está atualmente em desenvolvimento e estará disponível em breve.
            Estamos trabalhando para entregar a melhor experiência possível.
          </p>
          
          <button
            onClick={voltarParaInicio}
            className="mt-8 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
          >
            Voltar para Início
          </button>
        </div>
      </div>
    </div>
  );
}
