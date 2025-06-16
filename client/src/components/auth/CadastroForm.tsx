// src/components/auth/CadastroForm.tsx
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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setSenhaError('As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email: cpf, senha, cargo })
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.detail?.includes("Email")) setCpfError(data.detail);
        return;
      }

      const data = await response.json();
      const usuario = { nome, cpf, cargo, id: Date.now().toString() };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      localStorage.setItem("access_token", data.access_token);

      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        <div>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Nome completo"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={inputStyle}
            className="focus:outline-none"
          />
        </div>

        <div>
          <input
            id="cpf"
            name="cpf"
            type="text"
            placeholder="CPF"
            required
            value={cpf}
            onChange={(e) => {
              setCpf(e.target.value);
              setCpfError('');
            }}
            style={inputStyle}
            className="focus:outline-none"
          />
          {cpfError && <div style={errorStyle}>{cpfError}</div>}
        </div>

        <div>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setSenhaError('');
            }}
            style={inputStyle}
            className="focus:outline-none"
          />
        </div>

        <div>
          <input
            id="confirmarSenha"
            name="confirmarSenha"
            type="password"
            placeholder="Confirmar senha"
            required
            value={confirmarSenha}
            onChange={(e) => {
              setConfirmarSenha(e.target.value);
              setSenhaError('');
            }}
            style={inputStyle}
            className="focus:outline-none"
          />
          {senhaError && <div style={errorStyle}>{senhaError}</div>}
        </div>

        <div>
          <select
            id="cargo"
            name="cargo"
            required
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
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
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            style={buttonStyle}
          >
            Cadastrar
          </button>

          <div className="mt-4 text-center">
            <Link href="/login" style={{
              color: '#eb194b',
              fontSize: '16px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Já tenho cadastro
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
