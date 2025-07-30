// src/components/dashboard/ConfiguracaoComponent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import AddUserModal from '@/components/configuracoes/AddUserModal';
import EditUserModal, { User as EditUserType } from '@/components/configuracoes/EditUserModal';

type User = {
  nome: string;
  cpf: string;
  cargo: string;
  role?: string;
};

enum ConfigView {
  OVERVIEW = 'overview',
  USERS    = 'users',
}

export default function ConfiguracaoComponent() {
  const [view, setView]           = useState<ConfigView>(ConfigView.OVERVIEW);
  const [users, setUsers]         = useState<User[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const [showAddModal, setShowAddModal]   = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser]     = useState<EditUserType | null>(null);

  const token = localStorage.getItem('access_token') || '';

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { users: data } = (await res.json()) as { users: User[] };
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(cpf: string) {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;
    try {
      const res = await fetch(`/api/users/${cpf}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setUsers(prev => prev.filter(u => u.cpf !== cpf));
    } catch (err) {
      alert('Erro ao remover: ' + (err as Error).message);
    }
  }

  function handleAdded(newUser: User) {
    setUsers(prev => [newUser, ...prev]);
    setShowAddModal(false);
  }

  function handleUpdated(updated: User) {
    setUsers(prev =>
      prev.map(u => (u.cpf === updated.cpf ? updated : u))
    );
    setShowEditModal(false);
    setEditingUser(null);
  }

  useEffect(() => {
    if (view === ConfigView.USERS) fetchUsers();
  }, [view]);

  if (view === ConfigView.OVERVIEW) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h2 className="text-2xl font-bold mb-6">Configurações</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => setView(ConfigView.USERS)}
            className="cursor-pointer bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">Usuários</h3>
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${users.length} cadastrados`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => setView(ConfigView.OVERVIEW)}
        className="mb-4 text-sm text-gray-600 hover:underline"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>

      {loading && <p className="text-gray-500">Carregando usuários…</p>}
      {error   && <p className="text-red-500">Erro: {error}</p>}

      {!loading && !error && (
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
                  <button
                    onClick={() => {
                      setEditingUser(u as EditUserType);
                      setShowEditModal(true);
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemove(u.cpf)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#eb194b] text-white font-semibold px-6 py-2 rounded hover:bg-[#c3133d] transition"
        >
          Novo Usuário
        </button>
      </div>

      {showAddModal && (
        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdded={handleAdded}
        />
      )}

      {showEditModal && editingUser && (
        <EditUserModal
          isOpen={showEditModal}
          user={editingUser}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}