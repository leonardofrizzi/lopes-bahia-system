"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cpf, senha })
      });

      if (!response.ok) {
        setError("CPF ou senha inválidos");
        return;
      }

      const data = await response.json();

      // Salva token
      localStorage.setItem("access_token", data.access_token);

      // Salva usuário logado com nome e cargo
      const usuarioLogado = {
        nome: data.nome || "Usuário",
        cargo: data.cargo || "Cargo não definido",
        cpf,
        id: Date.now().toString()
      };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

      router.push("/dashboard");
    } catch (err) {
      console.error("Erro ao logar:", err);
      setError("Erro inesperado. Tente novamente mais tarde.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="CPF"
          required
          value={cpf}
          onChange={e => {
            setCpf(e.target.value);
            setError('');
          }}
          className="w-full border border-gray-400 rounded-full px-4 py-2"
        />

        <input
          type="password"
          placeholder="Senha"
          required
          value={senha}
          onChange={e => {
            setSenha(e.target.value);
            setError('');
          }}
          className="w-full border border-gray-400 rounded-full px-4 py-2"
        />

        {error && <div className="text-red-600 text-sm text-center">{error}</div>}

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-[#eb194b] text-white px-6 py-2 rounded-full"
          >
            Entrar
          </button>

          <div className="mt-4">
            <Link
              href="/cadastro"
              className="text-[#eb194b] text-sm underline"
            >
              Realizar cadastro
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
