import React, { useState } from 'react';
import { Obra, Company } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Plus,
  FolderGit2,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  HardHat,
} from 'lucide-react';

interface ObrasListProps {
  obras: Obra[];
  companies: Company[];
  onSaveObra: (obra: Obra) => void;
  onDeleteObra: (id: string) => void;
  onSelectObra: (id: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const ObrasList: React.FC<ObrasListProps> = ({
  obras,
  companies,
  onSaveObra,
  onDeleteObra,
  onSelectObra,
  onNavigateTab,
}) => {
  const { currentUser } = useAuth();
  const isEditor = currentUser?.role === 'Editor';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObra, setEditingObra] = useState<Obra | null>(null);

  // Form State
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [cliente, setCliente] = useState('');
  const [endereco, setEndereco] = useState('');
  const [responsavelTecnico, setResponsavelTecnico] = useState('');
  const [creaCau, setCreaCau] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [terminoPrevisto, setTerminoPrevisto] = useState('');
  const [status, setStatus] = useState<Obra['status']>('Em andamento');
  const [avancoFisico, setAvancoFisico] = useState<number>(0);
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [empresaId, setEmpresaId] = useState('');

  const handleOpenNew = () => {
    setEditingObra(null);
    setCodigo(`OBR-${new Date().getFullYear()}-${String(obras.length + 1).padStart(3, '0')}`);
    setNome('');
    setCliente('');
    setEndereco('');
    setResponsavelTecnico(currentUser?.name || '');
    setCreaCau(currentUser?.crea || 'CREA-SP');
    setDataInicio(new Date().toISOString().split('T')[0]);
    setTerminoPrevisto('');
    setStatus('Em andamento');
    setAvancoFisico(0);
    setDriveFolderUrl('');
    setEmpresaId(companies[0]?.id || '');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (obra: Obra) => {
    setEditingObra(obra);
    setCodigo(obra.codigo);
    setNome(obra.nome);
    setCliente(obra.cliente);
    setEndereco(obra.endereco);
    setResponsavelTecnico(obra.responsavelTecnico);
    setCreaCau(obra.creaCau);
    setDataInicio(obra.dataInicio);
    setTerminoPrevisto(obra.terminoPrevisto);
    setStatus(obra.status);
    setAvancoFisico(obra.avancoFisico);
    setDriveFolderUrl(obra.driveFolderUrl || '');
    setEmpresaId(obra.empresaId || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl =
      driveFolderUrl.trim() ||
      `https://drive.google.com/drive/folders/${encodeURIComponent(nome.replace(/\s+/g, '_'))}_Root`;

    const saved: Obra = {
      id: editingObra?.id || 'obra-' + Date.now(),
      codigo,
      nome,
      cliente,
      endereco,
      responsavelTecnico,
      creaCau,
      dataInicio,
      terminoPrevisto,
      status,
      avancoFisico: Number(avancoFisico) || 0,
      driveFolderUrl: cleanUrl,
      empresaId,
      isDemo: editingObra ? editingObra.isDemo : false,
    };

    onSaveObra(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-500" />
            Cadastro e Gestão de Obras
          </h1>
          <p className="text-xs text-slate-400">
            Empreendimentos cadastrados, cronogramas e pastas vinculadas no Google Drive
          </p>
        </div>

        {isEditor && (
          <button
            type="button"
            onClick={handleOpenNew}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Obra</span>
          </button>
        )}
      </div>

      {/* Grid of Obras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {obras.map((obra) => (
          <div
            key={obra.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {obra.codigo}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    obra.status === 'Em andamento'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {obra.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{obra.nome}</h3>
              <p className="text-xs text-slate-400 mb-3">{obra.endereco}</p>

              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs text-slate-300 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[11px]">Cliente:</span>
                  <span className="font-medium text-slate-200">{obra.cliente}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[11px]">Resp. Técnico:</span>
                  <span className="font-medium text-slate-200">{obra.responsavelTecnico}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[11px]">CREA/CAU:</span>
                  <span className="font-mono text-[11px] text-amber-400">{obra.creaCau}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-slate-500 text-[11px]">Início / Previsão:</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    {obra.dataInicio ? obra.dataInicio.split('-').reverse().join('/') : '-'} até{' '}
                    {obra.terminoPrevisto ? obra.terminoPrevisto.split('-').reverse().join('/') : '-'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Avanço Físico:</span>
                  <span className="font-bold text-amber-400 font-mono">{obra.avancoFisico}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                    style={{ width: `${obra.avancoFisico}%` }}
                  />
                </div>
              </div>

              {/* Google Drive Folder Integration Info */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded p-2 text-[11px] flex items-center justify-between text-slate-400 mb-3">
                <span className="flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Drive Vinculado</span>
                </span>
                <span className="text-amber-400 text-[10px] font-mono">
                  RDOs | Fotos | Docs
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectObra(obra.id);
                  onNavigateTab('rdos');
                }}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded text-xs font-semibold text-center cursor-pointer"
              >
                Ver RDOs da Obra
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectObra(obra.id);
                  onNavigateTab('documentos');
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded cursor-pointer"
                title="Abrir Pasta Drive / Documentos"
              >
                <FolderGit2 className="w-4 h-4 text-blue-400" />
              </button>

              {isEditor && (
                <button
                  type="button"
                  onClick={() => handleOpenEdit(obra)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded cursor-pointer"
                  title="Editar Obra"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}

              {isEditor && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Excluir a obra "${obra.nome}"?`)) {
                      onDeleteObra(obra.id);
                    }
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded cursor-pointer"
                  title="Excluir Obra"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Cadastrar / Editar Obra */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                {editingObra ? 'Editar Obra' : 'Cadastrar Nova Obra'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Fechar ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Código da Obra *</label>
                  <input
                    type="text"
                    required
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ex: OBR-2026-004"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluída">Concluída</option>
                    <option value="Pausada">Pausada</option>
                    <option value="Planejamento">Planejamento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nome da Obra *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Edifício Bella Vista Towers"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Cliente / Contratante *</label>
                  <input
                    type="text"
                    required
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Ex: Incorporadora XYZ"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Empresa Construtora</label>
                  <select
                    value={empresaId}
                    onChange={(e) => setEmpresaId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nomeFantasia}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, número, bairro, cidade - UF"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Responsável Técnico *</label>
                  <input
                    type="text"
                    required
                    value={responsavelTecnico}
                    onChange={(e) => setResponsavelTecnico(e.target.value)}
                    placeholder="Eng. Fulano de Tal"
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
                    placeholder="CREA-SP 123456"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Data Início</label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Término Previsto</label>
                  <input
                    type="date"
                    value={terminoPrevisto}
                    onChange={(e) => setTerminoPrevisto(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Avanço Físico (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={avancoFisico}
                    onChange={(e) => setAvancoFisico(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Pasta Vinculada no Google Drive
                </label>
                <input
                  type="text"
                  value={driveFolderUrl}
                  onChange={(e) => setDriveFolderUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  * Serão organizadas automaticamente as subpastas RDOs, Fotos e Documentos.
                </span>
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
                  Salvar Obra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
