import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage';
import { Settings, Shield, Sparkles, FolderGit2, RotateCcw, CheckCircle, Database } from 'lucide-react';

export const ConfiguracoesView: React.FC<{ onDataReset: () => void }> = ({ onDataReset }) => {
  const { currentUser } = useAuth();
  const [feedback, setFeedback] = useState<string>('');

  const handleResetDemoData = () => {
    if (confirm('Deseja restaurar todos os DADOS DE DEMONSTRAÇÃO iniciais do sistema?')) {
      storageService.resetAllDemoData();
      onDataReset();
      setFeedback('Dados de demonstração restaurados com sucesso.');
      setTimeout(() => setFeedback(''), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h1 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-amber-500" />
          Configurações do Sistema RDO Inteligente
        </h1>
        <p className="text-xs text-slate-400">
          Parâmetros de inteligência artificial, sincronização com nuvem e dados de demonstração
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* User profile card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          Sessão Atual
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Usuário Conectado</span>
            <span className="font-semibold text-white">{currentUser?.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">E-mail</span>
            <span className="text-slate-300 font-mono text-[11px]">{currentUser?.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Perfil Ativo</span>
            <span className="font-bold text-amber-400">{currentUser?.role}</span>
          </div>
        </div>
      </div>

      {/* Gemini AI & Drive Integration Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              IA Gemini 3.8 Flash
            </h3>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              Ativo
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Estruturação server-side de relatos falados e digitações de campo com checagem de incertezas e proteção de dados.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-blue-400" />
              Google Drive Cloud Sync
            </h3>
            <span className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
              Integrado
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Estruturação de pastas por obra: <code>[Obra]/RDOs</code>, <code>[Obra]/Fotos</code> e{' '}
            <code>[Obra]/Documentos</code> com salvamento de PDF após finalização.
          </p>
        </div>
      </div>

      {/* Reset Demo Data Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-amber-400" />
              Gerenciamento de Dados Locais
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Restaura as obras, empresas, integrantes e RDOs fictícios para o estado original da demonstração conforme o Método Larissa da oficina prática.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDemoData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Dados Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
