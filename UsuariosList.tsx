import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Plus, Shield, User as UserIcon, Lock, CheckCircle2 } from 'lucide-react';

export const UsuariosList: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(storageService.getUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Editor');
  const [crea, setCrea] = useState('');

  const isEditor = currentUser?.role === 'Editor';

  const handleOpenNew = () => {
    setNome('');
    setEmail('');
    setRole('Visualizador');
    setCrea('');
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: nome,
      email,
      role,
      crea: crea.trim() || undefined,
      avatar: nome.substring(0, 2).toUpperCase(),
    };

    const updated = storageService.saveUser(newUser);
    setUsers(updated);
    setIsModalOpen(false);
  };

  const handleToggleRole = (user: User) => {
    if (!isEditor) return;
    const nextRole: UserRole = user.role === 'Editor' ? 'Visualizador' : 'Editor';
    const updated = storageService.saveUser({ ...user, role: nextRole });
    setUsers(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-amber-500" />
            Gerenciamento de Usuários e Permissões
          </h1>
          <p className="text-xs text-slate-400">
            Controle de acessos com papéis estritos: <strong>Editor</strong> (criação e edição) e{' '}
            <strong>Visualizador</strong> (apenas consulta)
          </p>
        </div>

        {isEditor && (
          <button
            type="button"
            onClick={handleOpenNew}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Convidar Usuário</span>
          </button>
        )}
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
            <Shield className="w-4 h-4" />
            <span>Perfil: Editor</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-2">
            Engenheiros de campo, coordenadores e responsáveis técnicos.
          </p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
            <li>Pode criar, editar e salvar relatórios diários (RDO)</li>
            <li>Pode gravar áudios para estruturação com IA</li>
            <li>Pode cadastrar novas obras, empresas e equipes</li>
            <li>Pode finalizar RDOs para emissão oficial de PDF</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>Perfil: Visualizador</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-2">
            Fiscais de obra, auditores, diretores e clientes contratantes.
          </p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
            <li>Acesso completo para consulta e visualização</li>
            <li>Pode emitir e imprimir PDFs de relatórios já criados</li>
            <li>Não tem permissão de alterar ou excluir relatórios</li>
            <li>Não tem permissão de cadastrar novas obras ou alterar equipes</li>
          </ul>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="pb-2.5">Usuário</th>
                <th className="pb-2.5">E-mail</th>
                <th className="pb-2.5">Registro Técnico</th>
                <th className="pb-2.5">Perfil de Acesso</th>
                {isEditor && <th className="pb-2.5 text-right">Alterar Perfil</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-semibold text-white flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
                      {u.avatar || u.name.substring(0, 2)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3 font-mono text-slate-400">{u.email}</td>
                  <td className="py-3 font-mono text-slate-300">{u.crea || '—'}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'Editor'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  {isEditor && (
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleRole(u)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 cursor-pointer"
                      >
                        Alternar para {u.role === 'Editor' ? 'Visualizador' : 'Editor'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-amber-400" />
                Convidar Novo Usuário
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Eng. Nome do Profissional"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com.br"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Perfil de Acesso *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="Editor">Editor (Criar, editar e finalizar)</option>
                  <option value="Visualizador">Visualizador (Somente consulta e PDFs)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">CREA / CAU</label>
                <input
                  type="text"
                  value={crea}
                  onChange={(e) => setCrea(e.target.value)}
                  placeholder="CREA-SP 000.000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                >
                  Adicionar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
