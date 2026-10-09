import React, { useState } from 'react';
import { Obra, DriveFolderItem } from '../types';
import { storageService } from '../services/storage';
import {
  FolderGit2,
  Folder,
  FileText,
  Image,
  FileCheck,
  Upload,
  Download,
  ExternalLink,
  Plus,
  HardHat,
  Search,
} from 'lucide-react';

interface DocumentosDriveProps {
  obras: Obra[];
  selectedObraId: string;
  onSelectObra: (id: string) => void;
}

export const DocumentosDrive: React.FC<DocumentosDriveProps> = ({
  obras,
  selectedObraId,
  onSelectObra,
}) => {
  const currentObraId = selectedObraId === 'all' ? obras[0]?.id || '' : selectedObraId;
  const currentObra = obras.find((o) => o.id === currentObraId) || obras[0];

  const [activeSubfolder, setActiveSubfolder] = useState<'all' | 'RDOs' | 'Fotos' | 'Documentos'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<DriveFolderItem[]>(storageService.getDriveFiles());

  const obraFiles = files.filter((f) => f.obraId === currentObra?.id);
  const filteredFiles = obraFiles.filter((f) => {
    if (activeSubfolder !== 'all' && f.tipo !== activeSubfolder) return false;
    if (searchTerm) {
      return f.nomeArquivo.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const handleUploadSimulated = (tipo: 'RDOs' | 'Fotos' | 'Documentos') => {
    const nome = prompt(`Digite o nome do arquivo para salvar em [${currentObra?.nome}] / ${tipo}:`, 'Documento_Complementar.pdf');
    if (!nome) return;

    const newFile: DriveFolderItem = {
      id: 'drv-' + Date.now(),
      obraId: currentObra.id,
      tipo,
      nomeArquivo: nome,
      tamanho: '2.1 MB',
      dataModificacao: new Date().toLocaleString('pt-BR'),
      url: '#',
    };

    const updated = storageService.addDriveFile(newFile);
    setFiles(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-amber-500" />
            Documentos & Integração Google Drive
          </h1>
          <p className="text-xs text-slate-400">
            Arquivamento automático em pastas por obra: <strong>RDOs | Fotos | Documentos</strong>
          </p>
        </div>

        {/* Obra Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="drive-obra-select" className="text-xs text-slate-400 shrink-0">
            Obra:
          </label>
          <select
            id="drive-obra-select"
            value={currentObra?.id}
            onChange={(e) => onSelectObra(e.target.value)}
            className="w-full sm:w-72 bg-slate-950 border border-slate-700 text-white text-xs rounded-lg p-2 focus:border-amber-500"
          >
            {obras.map((o) => (
              <option key={o.id} value={o.id}>
                {o.codigo} - {o.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drive Root Breadcrumb and Folder Structure */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <span className="text-blue-400 font-bold">Google Drive</span>
            <span>/</span>
            <span className="text-amber-400 font-semibold">{currentObra?.nome || 'Obra'}</span>
            {activeSubfolder !== 'all' && (
              <>
                <span>/</span>
                <span className="text-white font-bold">{activeSubfolder}</span>
              </>
            )}
          </div>

          <a
            href={currentObra?.driveFolderUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            <span>Abrir no Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3 Subfolders Cards: RDOs, Fotos, Documentos */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setActiveSubfolder('all')}
            className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
              activeSubfolder === 'all'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold mb-1">Todas as Pastas</div>
            <div className="text-[11px] text-slate-400">{obraFiles.length} arquivos totais</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubfolder('RDOs')}
            className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
              activeSubfolder === 'RDOs'
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">Pasta: RDOs</span>
              <FileCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              {obraFiles.filter((f) => f.tipo === 'RDOs').length} relatórios salvos
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubfolder('Fotos')}
            className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
              activeSubfolder === 'Fotos'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">Pasta: Fotos</span>
              <Image className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              {obraFiles.filter((f) => f.tipo === 'Fotos').length} fotos de campo
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubfolder('Documentos')}
            className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
              activeSubfolder === 'Documentos'
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">Pasta: Documentos</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              {obraFiles.filter((f) => f.tipo === 'Documentos').length} projetos e ARTs
            </div>
          </button>
        </div>

        {/* Search & Upload Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar arquivos na pasta..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleUploadSimulated('Documentos')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload Documento</span>
            </button>
          </div>
        </div>

        {/* Files Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-2">Nome do Arquivo</th>
                <th className="pb-2">Subpasta</th>
                <th className="pb-2">Tamanho</th>
                <th className="pb-2">Data Modificação</th>
                <th className="pb-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    Nenhum arquivo nesta pasta. Os RDOs finalizados são sincronizados aqui automaticamente.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-medium text-white flex items-center gap-2">
                      {file.tipo === 'RDOs' ? (
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : file.tipo === 'Fotos' ? (
                        <Image className="w-4 h-4 text-blue-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                      )}
                      <span className="truncate max-w-xs">{file.nomeArquivo}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                        {file.tipo}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-400">{file.tamanho}</td>
                    <td className="py-2.5 font-mono text-slate-400">{file.dataModificacao}</td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Baixando arquivo "${file.nomeArquivo}" do Google Drive...`)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 cursor-pointer"
                        title="Baixar arquivo"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
