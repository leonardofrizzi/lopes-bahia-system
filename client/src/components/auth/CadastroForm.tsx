"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CadastroForm() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setSenhaError('As senhas não coincidem');
      return;
    }
    if (!cargo) {
      setError('Selecione um cargo');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ nome, cpf, senha, cargo })
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.detail) {
          if (data.detail.includes('CPF')) setCpfError(data.detail);
          else setError(data.detail);
        }
        return;
      }

      alert('Usuário cadastrado com sucesso!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      setError('Erro de conexão com o servidor');
    }
  };

  const inputStyle = {
    borderRadius: '20px',
    padding: '8px 16px',
    border: '1px solid #545454',
    width: '100%',
    color: '#545454'
  };

  const buttonStyle = {
    backgroundColor: '#eb194b',
    borderRadius: '20px',
    padding: '8px 30px',
    color: 'white',
    border: 'none',
    margin: '0 auto',
    display: 'block',
    fontSize: '18px'
  };

  const errorStyle = {
    color: '#eb194b',
    fontSize: '14px',
    marginTop: '4px'
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <input
          type="text"
          placeholder="Nome completo"
          required
          value={nome}
          onChange={e => { setNome(e.target.value); setError(''); }}
          style={inputStyle}
          className="focus:outline-none"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="CPF"
          required
          value={cpf}
          onChange={e => { setCpf(e.target.value); setCpfError(''); setError(''); }}
          style={inputStyle}
          className="focus:outline-none"
        />
        {cpfError && <div style={errorStyle}>{cpfError}</div>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Senha"
          required
          value={senha}
          onChange={e => { setSenha(e.target.value); setSenhaError(''); setError(''); }}
          style={inputStyle}
          className="focus:outline-none"
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirmar senha"
          required
          value={confirmarSenha}
          onChange={e => { setConfirmarSenha(e.target.value); setSenhaError(''); setError(''); }}
          style={inputStyle}
          className="focus:outline-none"
        />
        {senhaError && <div style={errorStyle}>{senhaError}</div>}
      </div>

      <div>
        <select
          required
          value={cargo}
          onChange={e => { setCargo(e.target.value); setError(''); }}
          style={{
            borderRadius: '20px',
            padding: '8px 16px',
            border: '1px solid #545454',
            width: '100%',
            color: '#545454',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23545454' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '32px'
          }}
          className="focus:outline-none"
        >
          <option value="" disabled>Selecione seu cargo</option>
          <option value="Diretor">Diretor</option>
          <option value="Gerente">Gerente</option>
          <option value="Corretor de imóveis">Corretor de imóveis</option>
          <option value="Operacional">Operacional</option>
        </select>
        {error && <div style={errorStyle}>{error}</div>}
      </div>

      <div className="mt-6 text-center">
        <button type="submit" style={buttonStyle}>Cadastrar</button>
        <div className="mt-4">
          <Link href="/login" className="text-[#eb194b] text-sm underline">Já tenho cadastro</Link>
        </div>
      </div>
    </form>
  );
}
