"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UsuarioLogado {
  nome: string;
  cargo: string;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UsuarioLogado | null>(null);
  const [currentDatetime, setCurrentDatetime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDatetime(new Date()), 1000);

    const storedUser = localStorage.getItem('usuarioLogado');
    if (storedUser) {
      try {
        const usuario: UsuarioLogado = JSON.parse(storedUser);
        setUser(usuario);
      } catch {
        localStorage.removeItem('usuarioLogado');
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }

    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace('/login');
  };

  const formattedDate = format(currentDatetime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(currentDatetime, "HH:mm:ss", { locale: ptBR });

  const infoBoxStyle = {
    backgroundColor: '#be133c',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderRadius: '6px'
  };

  return (
    <nav style={{ backgroundColor: '#eb194b' }} className="text-white shadow-md">
      <div className="max-w-full mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/images/lopesbahiabranco.webp"
              alt="Lopes Bahia"
              width={80}
              height={40}
              style={{ objectFit: 'contain' }}
            />
          </div>

          <div className="flex items-center gap-4">
            <div style={infoBoxStyle}>
              <div className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm">{formattedDate}</div>
                <div className="text-sm font-bold">{formattedTime}</div>
              </div>
            </div>

            <div style={infoBoxStyle}>
              <div className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">{user?.nome || 'Usuário'}</div>
                <div className="text-xs">{user?.cargo || 'Cargo não definido'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-white text-[#eb194b] px-4 py-2 rounded-full font-medium"
              style={{ fontSize: '16px' }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
