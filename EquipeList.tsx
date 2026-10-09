import React, { useState } from 'react';
import { TeamMember, Obra } from '../types';
import { useAuth } from '../context/AuthContext';
import { Users2, Plus, Edit2, Trash2, Phone, Building2, HardHat } from 'lucide-react';

interface EquipeListProps {
  team: TeamMember[];
  obras: Obra[];
  onSaveMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
}

export const EquipeList: React.FC<EquipeListProps> = ({
  team,
  obras,
  onSaveMember,
  onDeleteMember,
}) => {
  const { currentUser } = useAuth();
  const isEditor = currentUser?.role === 'Editor';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState<TeamMember['funcao']>('Engenheiro Residente');
  const [empresa, setEmpresa] = useState('');
  const [contato, setContato] = useState('');
  const [creaCau, setCreaCau] = useState('');
  const [selectedObrasIds, setSelectedObrasIds] = useState<string[]>([]);

  const handleOpenNew = () => {
    setEditingMember(null);
    setNome('');
    setFuncao('Engenheiro Residente');
    setEmpresa('Construtora Principal');
    setContato('');
    setCreaCau('');
    setSelectedObrasIds(obras[0] ? [obras[0].id] : []);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setEditingMember(m);
    setNome(m.nome);
    setFuncao(m.funcao);
    setEmpresa(m.empresa);
    setContato(m.contato);
    setCreaCau(m.creaCau || '');
    setSelectedObrasIds(m.obrasIds || []);
    setIsModalOpen(true);
  };

  const handleToggleObra = (id: string) => {
    if (selectedObrasIds.includes(id)) {
      setSelectedObrasIds(selectedObrasIds.filter((oId) => oId !== id));
    } else {
      setSelectedObrasIds([...selectedObrasIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved: TeamMember = {
      id: editingMember?.id || 'team-' + Date.now(),
      nome,
      funcao,
      empresa,
      contato,
      creaCau: creaCau.trim() || undefined,
      obrasIds: selectedObrasIds,
      isDemo: editingMember ? editingMember.isDemo : false,
    };
    onSaveMember(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users2 className="w-6 h-6 text-amber-500" />
            Equipe Técnica & Encarregados
          </h1>
          <p className="text-xs text-slate-400">
            Profissionais cadastrados e alocados por frente de serviço e obra
          </p>
        </div>

        {isEditor && (
          <button
            type="button"
            onClick={handleOpenNew}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Integrante</span>
          </button>
        )}
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((m) => {
          const vinculadasObras = obras.filter((o) => m.obrasIds?.includes(o.id));

          return (
            <div
              key={m.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                    {m.funcao}
                  </span>
                  {m.isDemo && (
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                      DEMO
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-0.5">{m.nome}</h3>
                <div className="text-xs text-slate-400 mb-2">{m.empresa}</div>

                {m.creaCau && (
                  <div className="text-[11px] font-mono text-amber-400 mb-2">
                    {m.creaCau}
                  </div>
                )}

                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-2 text-xs mb-3">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> Contato:
                    </span>
                    <span className="font-mono text-[11px]">{m.contato || 'Não informado'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block mb-1">
                      Obras Alocadas ({vinculadasObras.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {vinculadasObras.map((o) => (
                        <span
                          key={o.id}
                          className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 truncate max-w-[200px]"
                        >
                          {o.codigo}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {isEditor && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(m)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Excluir integrante ${m.nome}?`)) {
                        onDeleteMember(m.id);
                      }
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Cadastrar / Editar Integrante */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users2 className="w-5 h-5 text-amber-400" />
                {editingMember ? 'Editar Integrante' : 'Cadastrar Integrante Técnico'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do profissional"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Função / Cargo *</label>
                  <select
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Engenheiro Residente">Engenheiro Residente</option>
                    <option value="Engenheiro de Segurança">Engenheiro de Segurança</option>
                    <option value="Mestre de Obras">Mestre de Obras</option>
                    <option value="Encarregado">Encarregado</option>
                    <option value="Estagiário">Estagiário de Engenharia</option>
                    <option value="Técnico em Edificações">Técnico em Edificações</option>
                    <option value="Outro">Outro Integrante</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">CREA / Registro</label>
                  <input
                    type="text"
                    value={creaCau}
                    onChange={(e) => setCreaCau(e.target.value)}
                    placeholder="CREA-SP 000.000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Empresa Vinculada *</label>
                  <input
                    type="text"
                    required
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Nome da empresa"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Contato / Telefone</label>
                  <input
                    type="text"
                    value={contato}
                    onChange={(e) => setContato(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Vincular às Obras:
                </label>
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 max-h-36 overflow-y-auto space-y-1.5">
                  {obras.map((o) => (
                    <label key={o.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedObrasIds.includes(o.id)}
                        onChange={() => handleToggleObra(o.id)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span>{o.codigo} - {o.nome}</span>
                    </label>
                  ))}
                </div>
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
                  Salvar Integrante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
