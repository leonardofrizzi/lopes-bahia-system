// src/services/auth.ts
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Hook para verificar se o usuário está autenticado
export const useAuth = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window !== 'undefined') {
      const usuarioLogado = localStorage.getItem('usuarioLogado');
      
      if (!usuarioLogado) {
        router.push('/login');
      }
    }
  }, [router]);
  
  // Obter dados do usuário logado
  const getUser = () => {
    if (typeof window !== 'undefined') {
      const usuarioLogado = localStorage.getItem('usuarioLogado');
      return usuarioLogado ? JSON.parse(usuarioLogado) : null;
    }
    return null;
  };
  
  // Função de logout
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuarioLogado');
      router.push('/login');
    }
  };
  
  return { getUser, logout };
};
