// src/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useNavigation, ActiveComponentType } from '@/contexts/NavigationContext';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import EmpreendimentosComponent from '@/components/dashboard/EmpreendimentosComponent';
import LinksUteisComponent from '@/components/dashboard/LinksUteisComponent';
import EmDesenvolvimentoComponent from '@/components/dashboard/EmDesenvolvimentoComponent';

// Interface para usuário logado
interface UsuarioLogado {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
}

// Interface para card do menu
interface MenuCardProps {
  title: string;
  imageSrc: string;
  componentName: ActiveComponentType;
  onClick: () => void;
}

function MenuCard({ title, imageSrc, onClick }: MenuCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group h-full"
    >
      <div className="relative h-full w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white text-2xl font-bold">
          {title}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const { activeComponent, setActiveComponent } = useNavigation();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const usuarioLogadoStr = localStorage.getItem('usuarioLogado');
      if (!usuarioLogadoStr) {
        router.push('/login');
      } else {
        setUsuario(JSON.parse(usuarioLogadoStr));
      }
    }
  }, [router]);

  // Dados dos cards do menu
  const menuItems: {
    title: string;
    imageSrc: string;
    componentName: ActiveComponentType;
  }[] = [
    {
      title: 'EMPREENDIMENTOS',
      imageSrc: '/images/empreendimentos.webp',
      componentName: 'empreendimentos'
    },
    {
      title: 'OFERTA ATIVA',
      imageSrc: '/images/ofertaativa.webp',
      componentName: 'oferta-ativa'
    },
    {
      title: 'CAPACITAÇÃO',
      imageSrc: '/images/capacitacao.webp',
      componentName: 'capacitacao'
    },
    {
      title: 'MARKETING',
      imageSrc: '/images/marketing.webp',
      componentName: 'marketing'
    },
    {
      title: 'LINKS ÚTEIS',
      imageSrc: '/images/linksuteis.webp',
      componentName: 'links-uteis'
    },
    {
      title: 'CONFIGURAÇÃO',
      imageSrc: '/images/configuracao.webp',
      componentName: 'configuracao'
    }
  ];

  // Componente de conteúdo do home (cards)
  const HomeContent = () => (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Bem-vindo, {usuario?.nome}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
        {menuItems.map((item) => (
          <MenuCard
            key={item.title}
            title={item.title}
            imageSrc={item.imageSrc}
            componentName={item.componentName}
            onClick={() => setActiveComponent(item.componentName)}
          />
        ))}
      </div>
    </div>
  );

  // Componentes específicos - usando EmDesenvolvimentoComponent para os não implementados
  const OfertaAtivaComponent = () => <EmDesenvolvimentoComponent titulo="Oferta Ativa" />;
  const MarketingComponent = () => <EmDesenvolvimentoComponent titulo="Marketing" />;
  const CapacitacaoComponent = () => <EmDesenvolvimentoComponent titulo="Capacitação" />;
  const ConfiguracaoComponent = () => <EmDesenvolvimentoComponent titulo="Configuração" />;

  // Renderizar o componente ativo
  const renderContent = () => {
    switch (activeComponent) {
      case 'empreendimentos':
        return <EmpreendimentosComponent titulo="Empreendimentos" />;
      case 'oferta-ativa':
        return <OfertaAtivaComponent />;
      case 'marketing':
        return <MarketingComponent />;
      case 'capacitacao':
        return <CapacitacaoComponent />;
      case 'links-uteis':
        return <LinksUteisComponent />;
      case 'configuracao':
        return <ConfiguracaoComponent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    // Container principal com altura exata da viewport
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Navbar - altura fixa */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>
      
      {/* Container flexível para o conteúdo principal - ocupa resto da altura */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar apenas para componentes específicos */}
        {activeComponent !== 'home' && (
          <div className="flex-shrink-0">
            <Sidebar />
          </div>
        )}
        
        {/* Área principal de conteúdo - com scroll se necessário */}
        {activeComponent === 'home' ? (
          // Página inicial com cards - ocupa toda a altura disponível
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        ) : (
          // Componentes específicos
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        )}
      </div>
    </div>
  );
}
