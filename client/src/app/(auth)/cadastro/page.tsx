// src/app/(auth)/cadastro/page.tsx
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CadastroForm from '@/components/auth/CadastroForm';

export default function CadastroPage() {
  const now = new Date();
  const formattedDay = format(now, "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  const formattedTime = format(now, "HH:mm'h'", {
    locale: ptBR,
  });
  
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex min-w-[1140px] h-[600px]">
        {/* Div da esquerda: Imagem de cinema */}
        <div className="w-1/2 flex items-center justify-center relative">
          <div className="relative h-full w-full">
            <Image
              src="/images/fundoLogin.webp"
              alt="Sala de Cinema"
              fill
              style={{
                objectFit: 'contain',
              }}
              priority
            />
            {/* Data e hora na parte inferior */}
            <div className="absolute bottom-6 inset-x-0 text-center">
              <div className="inline-block text-white text-[18px]">
                <div>{formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1)}</div>
                <div>{formattedTime}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Div da direita: Formulário de cadastro */}
        <div className="w-1/2 flex items-center justify-end bg-white">
          <div className="max-w-md w-full">
            <h2 className="text-center text-[30px] font-bold" style={{ color: '#eb194b' }}>
              Cadastro
            </h2>
            <p className="mt-3 text-center text-[18px] text-[#545454]">
              Preencha os campos abaixo<br/>
              para criar sua conta.
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
