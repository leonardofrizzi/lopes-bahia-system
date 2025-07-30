// src/components/dashboard/ConfiguracaoComponent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import AddUserModal from '@/components/configuracoes/AddUserModal';
import EditUserModal, { User as EditUserType } from '@/components/configuracoes/EditUserModal';
import AddEmpreendimentoModal from '@/components/configuracoes/AddEmpreendimentoModal';

// Tipagem de usuário
type User = {
  nome: string;
  cpf: string;
  cargo: string;
  role?: string;
};

// Tipagem de empreendimento
type Empreendimento = {
  id: string;
  nome: string;
  tipo_imovel: string;
  dormitorios?: number;
  suites?: number;
  vagas?: number;
  area_m2?: number;
  data_entrega?: string;
  estagio?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  incorporador?: string;
  coordenador?: string;
  link_book?: string;
  link_tabela?: string;
  ngc?: number;
};

enum ConfigView {
  OVERVIEW        = 'overview',
  USERS           = 'users',
  EMPREENDIMENTOS = 'empreendimentos',
}

export default function ConfiguracaoComponent() {
  const [view, setView]               = useState<ConfigView>(ConfigView.OVERVIEW);

  const [users, setUsers]             = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [emps, setEmps]               = useState<Empreendimento[]>([]);
  const [loadingEmps, setLoadingEmps]   = useState(false);

  const [showAddUser, setShowAddUser]   = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser]   = useState<EditUserType | null>(null);

  const [showAddEmp, setShowAddEmp]     = useState(false);

  const token = localStorage.getItem('access_token') || '';

  // Carrega usuários
  useEffect(() => {
    setLoadingUsers(true);
    fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then(data => setUsers(data.users))
      .catch(console.error)
      .finally(() => setLoadingUsers(false));
  }, [token]);

  // Carrega empreendimentos
  useEffect(() => {
    setLoadingEmps(true);
    fetch('/api/empreendimentos', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then(data => setEmps(data.empreendimentos || []))
      .catch(console.error)
      .finally(() => setLoadingEmps(false));
  }, [token]);

  // --- OVERVIEW ---
  if (view === ConfigView.OVERVIEW) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h2 className="text-2xl font-bold mb-6">Configurações</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Usuários */}
          <div
            onClick={() => setView(ConfigView.USERS)}
            className="cursor-pointer bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5.121 17.804A12.044 12.044 0 0112 15c2.396 0 4.634.628 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <h3 className="text-lg font-semibold mb-1">Usuários</h3>
            <p className="text-gray-600">{loadingUsers ? 'Carregando...' : `${users.length} cadastrados`}</p>
          </div>
          {/* Empreendimentos */}
          <div
            onClick={() => setView(ConfigView.EMPREENDIMENTOS)}
            className="cursor-pointer bg-white rounded-lg shadow p-6 hover:shadow-lg transition flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            <h3 className="text-lg font-semibold mb-1">Empreendimentos</h3>
            <p className="text-gray-600">{loadingEmps ? 'Carregando...' : `${emps.length} cadastrados`}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- USERS VIEW ---
  if (view === ConfigView.USERS) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <button onClick={() => setView(ConfigView.OVERVIEW)} className="mb-4 text-sm text-gray-600 hover:underline">
          ← Voltar
        </button>
        <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">CPF</th>
              <th className="px-4 py-2 text-left">Cargo</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.cpf} className="border-t">
                <td className="px-4 py-2">{u.nome}</td>
                <td className="px-4 py-2">{u.cpf}</td>
                <td className="px-4 py-2">{u.cargo}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => { setEditingUser(u as EditUserType); setShowEditUser(true); }}
                    className="text-blue-600 hover:underline text-sm">Editar</button>
                  <button onClick={async () => {
                      if (!confirm('Deseja remover este usuário?')) return;
                      const res = await fetch(`/api/users/${u.cpf}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
                      if (res.ok) setUsers(prev => prev.filter(x => x.cpf !== u.cpf));
                    }}
                    className="text-red-600 hover:underline text-sm">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6">
          <button onClick={() => setShowAddUser(true)}
            className="bg-[#eb194b] text-white font-semibold px-6 py-2 rounded hover:bg-[#c3133d] transition">
            Novo Usuário
          </button>
        </div>
        {showAddUser && <AddUserModal isOpen onClose={()=>setShowAddUser(false)} onAdded={newU => {setUsers(u=>[newU, ...u]); setShowAddUser(false);}} />}
        {showEditUser && editingUser && <EditUserModal isOpen user={editingUser} onClose={()=>setShowEditUser(false)} onUpdated={upd=>{setUsers(u=>u.map(x=>x.cpf===upd.cpf?upd:x)); setShowEditUser(false);}} />}
      </div>
    );
  }

  // --- EMPRND VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => setView(ConfigView.OVERVIEW)} className="mb-4 text-sm text-gray-600 hover:underline">
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4">Gerenciar Empreendimentos</h2>

      {/* Lista de empreendimentos em tabela */}
      <table className="w-full bg-white rounded-lg shadow overflow-hidden mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Dormitórios</th>
            <th className="px-4 py-2 text-left">Suítes</th>
            <th className="px-4 py-2 text-left">Vagas</th>
            <th className="px-4 py-2 text-left">Área (m²)</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {emps.map(e => (
            <tr key={e.id} className="border-t">
              <td className="px-4 py-2">{e.nome}</td>
              <td className="px-4 py-2">{e.tipo_imovel}</td>
              <td className="px-4 py-2">{e.dormitorios ?? '-'}</td>
              <td className="px-4 py-2">{e.suites ?? '-'}</td>
              <td className="px-4 py-2">{e.vagas ?? '-'}</td>
              <td className="px-4 py-2">{e.area_m2 ?? '-'}</td>
              <td className="px-4 py-2 space-x-2">
                {/* Se quiser implementar editar/remover daqui depois */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddEmp(true)}
        className="bg-[#eb194b] text-white font-semibold px-6 py-2 rounded hover:bg-[#c3133d] transition">
        Novo Empreendimento
      </button>

      {showAddEmp && (
        <AddEmpreendimentoModal
          isOpen
          onClose={() => setShowAddEmp(false)}
          onAdded={newE => {
            setEmps(prev => [newE, ...prev]);
            setShowAddEmp(false);
          }}
        />
      )}
    </div>
  );
}