"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CadastroForm from '@/components/auth/CadastroForm';

export default function CadastroPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const usuarioStr = localStorage.getItem('usuarioLogado');
    if (!usuarioStr) {
      router.replace('/login');
      return;
    }

    try {
      const usuario = JSON.parse(usuarioStr);
      if (usuario.cargo !== 'Administrador') {
        router.replace('/dashboard');
      }
    } catch {
      localStorage.removeItem('usuarioLogado');
      router.replace('/login');
    }
  }, [router]);

  const now = new Date();
  const formattedDay = format(now, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(now, "HH:mm'h'", { locale: ptBR });

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex min-w-[1140px] h-[600px]">
        <div className="w-1/2 flex items-center justify-center relative">
          <Image
            src="/images/fundoLogin.webp"
            alt="Sala de Cinema"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
          <div className="absolute bottom-6 inset-x-0 text-center text-white text-[18px]">
            {formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1)}<br/>
            {formattedTime}
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-end bg-white">
          <div className="max-w-md w-full">
            <h2 className="text-center text-[30px] font-bold text-[#eb194b]">Cadastro</h2>
            <p className="mt-3 text-center text-[18px] text-[#545454]">
              Preencha os campos abaixo<br/>para criar sua conta.
            </p>
            <div className="mt-8">
              <CadastroForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
