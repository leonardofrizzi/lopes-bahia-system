// src/components/auth/LoginForm.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Defina a interface do usuário
interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  senha: string;
  cargo: string;
}

// Interface para usuário logado (sem senha)
interface UsuarioLogado {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
}

export default function LoginForm() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Buscar usuários no localStorage
    const usuariosString = localStorage.getItem('usuarios') || '[]';
    const usuarios: Usuario[] = JSON.parse(usuariosString);
    
    // Verificar se o usuário existe e a senha está correta
    const usuario = usuarios.find(u => u.cpf === cpf && u.senha === password);
    
    if (usuario) {
      // Salvar o usuário na sessão (sem a senha)
      const usuarioLogado: UsuarioLogado = {
        id: usuario.id,
        nome: usuario.nome,
        cpf: usuario.cpf,
        cargo: usuario.cargo
      };
      
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
      
      // Redirecionar para o dashboard
      router.push('/dashboard');
    } else {
      setError('CPF ou senha incorretos');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        <div>
          <input
            id="login"
            name="login"
            type="text"
            placeholder="CPF"
            required
            value={cpf}
            onChange={(e) => {
              setCpf(e.target.value);
              setError('');
            }}
            style={{
              borderRadius: '20px',
              padding: '8px 16px',
              border: '1px solid #545454',
              width: '100%',
              color: '#545454'
            }}
            className="focus:outline-none"
          />
        </div>
        
        <div>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            style={{
              borderRadius: '20px',
              padding: '8px 16px',
              border: '1px solid #545454',
              width: '100%',
              color: '#545454'
            }}
            className="focus:outline-none"
          />
        </div>
        
        {error && <div style={{
          color: '#eb194b',
          fontSize: '14px',
          marginTop: '8px',
          textAlign: 'center'
        }}>{error}</div>}
        
        <div className="mt-6 text-center">
          <button
            type="submit"
            style={{
              backgroundColor: '#eb194b',
              borderRadius: '20px',
              padding: '8px 30px',
              color: 'white',
              border: 'none',
              margin: '0 auto',
              display: 'block',
              fontSize: '18px'
            }}
          >
            Entrar
          </button>
          
          <div className="mt-4 text-center">
            <Link href="/cadastro" style={{
              color: '#eb194b',
              fontSize: '16px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Realizar cadastro
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
