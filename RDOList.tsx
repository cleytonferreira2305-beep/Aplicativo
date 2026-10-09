import React, { useState } from 'react';
import { RDO, Obra } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  PlusCircle,
  Sparkles,
  Eye,
  Edit3,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Printer,
  Calendar,
} from 'lucide-react';

interface RDOListProps {
  rdos: RDO[];
  obras: Obra[];
  selectedObraId: string;
  onSelectObra: (id: string) => void;
  onOpenNewRDO: () => void;
  onOpenVoiceAI: () => void;
  onEditRDO: (rdo: RDO) => void;
  onViewRDO: (rdo: RDO) => void;
  onDeleteRDO: (id: string) => void;
}

export const RDOList: React.FC<RDOListProps> = ({
  rdos,
  obras,
  selectedObraId,
  onSelectObra,
  onOpenNewRDO,
  onOpenVoiceAI,
  onEditRDO,
  onViewRDO,
  onDeleteRDO,
}) => {
  const { currentUser } = useAuth();
  const isEditor = currentUser?.role === 'Editor';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Finalizado' | 'Rascunho'>('all');

  const filteredRdos = rdos.filter((rdo) => {
    // Obra filter
    if (selectedObraId !== 'all' && rdo.obraId !== selectedObraId) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'all' && rdo.status !== statusFilter) {
      return false;
    }
    // Search text
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchCode = rdo.codigoIdentificador?.toLowerCase().includes(term);
      const matchActivities = rdo.atividadesExecutadas?.toLowerCase().includes(term);
      const matchResp = rdo.responsavelPreenchimento?.toLowerCase().includes(term);
      const matchObra = rdo.obraNome?.toLowerCase().includes(term);
      return matchCode || matchActivities || matchResp || matchObra;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            Relatórios Diários de Obra (RDO)
          </h1>
          <p className="text-xs text-slate-400">
            Histórico completo de emissões, diários de campo e aprovações
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenVoiceAI}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gravar com IA</span>
          </button>

          {isEditor && (
            <button
              type="button"
              onClick={onOpenNewRDO}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Novo RDO Manual</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, atividades, responsável..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedObraId}
            onChange={(e) => onSelectObra(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todas as Obras ({rdos.length} RDOs)</option>
            {obras.map((o) => (
              <option key={o.id} value={o.id}>
                {o.codigo} - {o.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todos os Status</option>
            <option value="Finalizado">Apenas Finalizados</option>
            <option value="Rascunho">Apenas Rascunhos</option>
          </select>
        </div>
      </div>

      {/* RDOs Grid / Table */}
      {filteredRdos.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">Nenhum RDO encontrado</h3>
          <p className="text-xs max-w-sm mx-auto mb-4">
            Não encontramos relatórios com os filtros aplicados. Crie um novo RDO ou grave por voz diretamente.
          </p>
          {isEditor && (
            <button
              type="button"
              onClick={onOpenNewRDO}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Criar Primeiro RDO</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRdos.map((rdo) => (
            <div
              key={rdo.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header card with code & status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-black text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    {rdo.codigoIdentificador}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rdo.status === 'Finalizado'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                    }`}
                  >
                    {rdo.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-medium text-slate-300">
                    {rdo.data.split('-').reverse().join('/')}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white mb-2 line-clamp-1">{rdo.obraNome}</h3>

                <p className="text-xs text-slate-400 line-clamp-3 mb-3 bg-slate-950/60 p-2 rounded border border-slate-800/80 leading-relaxed">
                  {rdo.atividadesExecutadas}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-3 bg-slate-950/40 p-2 rounded">
                  <div>
                    <span className="block text-slate-500 text-[10px]">Efetivo:</span>
                    <span className="font-semibold text-slate-200">
                      {rdo.maoDeObra.reduce((sum, m) => sum + (m.quantidade || 0), 0)} operários
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[10px]">Avanço Físico:</span>
                    <span className="font-semibold text-amber-400 font-mono">{rdo.avancoInformado}%</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 truncate mb-3">
                  Resp: <span className="text-slate-300">{rdo.responsavelPreenchimento}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onViewRDO(rdo)}
                  className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver PDF</span>
                </button>

                {isEditor && (
                  <button
                    type="button"
                    onClick={() => onEditRDO(rdo)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 rounded cursor-pointer"
                    title="Editar RDO"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}

                {isEditor && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Excluir ${rdo.codigoIdentificador}?`)) {
                        onDeleteRDO(rdo.id);
                      }
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-red-950/50 text-slate-400 hover:text-red-400 rounded cursor-pointer"
                    title="Excluir RDO"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
