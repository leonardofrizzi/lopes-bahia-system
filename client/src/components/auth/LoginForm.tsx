// src/components/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // <-- aqui, chame o proxy do Next
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha }),
      });

      if (!res.ok) {
        setError('CPF ou senha inválidos');
        return;
      }

      const data = await res.json() as {
        access_token: string;
        token_type: string;
        usuario: { nome: string; cpf: string; cargo: string; role?: string };
      };

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Erro inesperado. Tente novamente mais tarde.');
    }
  };

  const inputStyle = {
    borderRadius: '20px',
    padding: '8px 16px',
    border: '1px solid #545454',
    width: '100%',
    color: '#545454',
  };

  const buttonStyle = {
    backgroundColor: '#eb194b',
    borderRadius: '20px',
    padding: '8px 30px',
    color: 'white',
    border: 'none',
    margin: '0 auto',
    display: 'block',
    fontSize: '18px',
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <input
          type="text"
          placeholder="CPF"
          required
          value={cpf}
          onChange={e => { setCpf(e.target.value); setError(''); }}
          style={inputStyle}
          className="focus:outline-none"
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Senha"
          required
          value={senha}
          onChange={e => { setSenha(e.target.value); setError(''); }}
          style={inputStyle}
          className="focus:outline-none"
        />
      </div>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <div className="mt-6 text-center">
        <button type="submit" style={buttonStyle}>Entrar</button>
        <div className="mt-4">
          <Link href="/cadastro" className="text-[#eb194b] text-sm underline">
            Realizar cadastro
          </Link>
        </div>
      </div>
    </form>
  );
}