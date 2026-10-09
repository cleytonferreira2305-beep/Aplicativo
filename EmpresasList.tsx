import React, { useState } from 'react';
import { Company } from '../types';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Plus, Edit2, Trash2, ShieldCheck, Phone, Building } from 'lucide-react';

interface EmpresasListProps {
  companies: Company[];
  onSaveCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
}

export const EmpresasList: React.FC<EmpresasListProps> = ({
  companies,
  onSaveCompany,
  onDeleteCompany,
}) => {
  const { currentUser } = useAuth();
  const isEditor = currentUser?.role === 'Editor';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [contato, setContato] = useState('');
  const [responsavelTecnico, setResponsavelTecnico] = useState('');
  const [creaCau, setCreaCau] = useState('');

  const handleOpenNew = () => {
    setEditingCompany(null);
    setRazaoSocial('');
    setNomeFantasia('');
    setCnpj('');
    setContato('');
    setResponsavelTecnico('');
    setCreaCau('CREA-SP ');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: Company) => {
    setEditingCompany(comp);
    setRazaoSocial(comp.razaoSocial);
    setNomeFantasia(comp.nomeFantasia);
    setCnpj(comp.cnpj);
    setContato(comp.contato);
    setResponsavelTecnico(comp.responsavelTecnico);
    setCreaCau(comp.creaCau);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved: Company = {
      id: editingCompany?.id || 'emp-' + Date.now(),
      razaoSocial,
      nomeFantasia,
      cnpj,
      contato,
      responsavelTecnico,
      creaCau,
      isDemo: editingCompany ? editingCompany.isDemo : false,
    };
    onSaveCompany(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-500" />
            Empresas & Construtoras
          </h1>
          <p className="text-xs text-slate-400">
            Cadastro de pessoas jurídicas, contratadas, subempreiteiras e dados regulatórios CREA/CAU
          </p>
        </div>

        {isEditor && (
          <button
            type="button"
            onClick={handleOpenNew}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Empresa</span>
          </button>
        )}
      </div>

      {/* Grid of Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {company.nomeFantasia}
                </span>
                {company.isDemo && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono">
                    DEMO
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{company.razaoSocial}</h3>
              <div className="text-xs font-mono text-slate-400 mb-3">CNPJ: {company.cnpj}</div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs text-slate-300 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[11px]">Resp. Técnico:</span>
                  <span className="font-semibold text-slate-200">{company.responsavelTecnico}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[11px]">CREA / CAU:</span>
                  <span className="font-mono text-[11px] text-amber-400 font-bold">{company.creaCau}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-slate-500 text-[11px]">Contato:</span>
                  <span className="text-slate-300 truncate">{company.contato}</span>
                </div>
              </div>
            </div>

            {isEditor && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(company)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Excluir ${company.nomeFantasia}?`)) {
                      onDeleteCompany(company.id);
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
        ))}
      </div>

      {/* Modal Cadastrar / Editar Empresa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                {editingCompany ? 'Editar Empresa' : 'Cadastrar Empresa'}
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
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Razão Social *</label>
                <input
                  type="text"
                  required
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  placeholder="Ex: Construtora Exemplo Ltda"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nome Fantasia *</label>
                  <input
                    type="text"
                    required
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                    placeholder="Ex: Exemplo Engenharia"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Responsável Técnico *</label>
                  <input
                    type="text"
                    required
                    value={responsavelTecnico}
                    onChange={(e) => setResponsavelTecnico(e.target.value)}
                    placeholder="Eng. Nome Completo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">CREA / CAU *</label>
                  <input
                    type="text"
                    required
                    value={creaCau}
                    onChange={(e) => setCreaCau(e.target.value)}
                    placeholder="CREA-SP 123.456"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Contato / Telefone / E-mail</label>
                <input
                  type="text"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  placeholder="(11) 9999-9999 / contato@empresa.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
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
                  Salvar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
