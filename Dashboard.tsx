import React from 'react';
import { RDO, Obra, Company } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  HardHat,
  Building2,
  FileText,
  Clock,
  TrendingUp,
  AlertTriangle,
  Mic,
  PlusCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Eye,
  FileCheck,
} from 'lucide-react';

interface DashboardProps {
  obras: Obra[];
  rdos: RDO[];
  selectedObraId: string;
  onSelectObra: (id: string) => void;
  onOpenVoiceAI: () => void;
  onOpenNewRDO: () => void;
  onViewRDO: (rdo: RDO) => void;
  onNavigateTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  obras,
  rdos,
  selectedObraId,
  onSelectObra,
  onOpenVoiceAI,
  onOpenNewRDO,
  onViewRDO,
  onNavigateTab,
}) => {
  const { currentUser } = useAuth();
  const isEditor = currentUser?.role === 'Editor';

  // Filter by selected obra if not 'all'
  const filteredObras = selectedObraId === 'all' ? obras : obras.filter((o) => o.id === selectedObraId);
  const filteredRDOs = selectedObraId === 'all' ? rdos : rdos.filter((r) => r.obraId === selectedObraId);

  // Indicators
  const obrasAtivasCount = filteredObras.filter((o) => o.status === 'Em andamento').length;
  const rdosEmitidosCount = filteredRDOs.filter((r) => r.status === 'Finalizado').length;
  const rdosPendentesCount = filteredRDOs.filter((r) => r.status === 'Rascunho').length;

  const avancoMedio =
    filteredObras.length > 0
      ? Math.round(filteredObras.reduce((sum, o) => sum + (o.avancoFisico || 0), 0) / filteredObras.length)
      : 0;

  // Recent Occurrences
  const recentOcorrencias = filteredRDOs
    .filter((r) => r.ocorrencias && r.ocorrencias.trim().length > 0)
    .slice(0, 3);

  // Latest RDOs
  const ultimosRdos = [...filteredRDOs].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Demo Data Notice Banner as required */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Ambiente de Operação RDO Inteligente</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold">
                DADOS DE DEMONSTRAÇÃO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Obras ativas, equipes e RDOs integrados com Gemini 3.8 Flash e organização automática no Google Drive.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenVoiceAI}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <Mic className="w-3.5 h-3.5" />
            <span>Gravar RDO por Voz</span>
          </button>
          {isEditor && (
            <button
              type="button"
              onClick={onOpenNewRDO}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Novo RDO</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Obras Ativas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Obras Ativas</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{obrasAtivasCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">de {obras.length} empreendimentos</div>
        </div>

        {/* RDOs Emitidos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>RDOs Emitidos</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{rdosEmitidosCount}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">finalizados com assinatura</div>
        </div>

        {/* RDOs Pendentes / Rascunhos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>RDOs Pendentes</span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{rdosPendentesCount}</div>
          <div className="text-[11px] text-orange-400/80 mt-1">salvos como rascunho</div>
        </div>

        {/* Avanço Físico Médio */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Avanço Físico Médio</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{avancoMedio}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${avancoMedio}%` }} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Content: Works Overview + Recent Occurrences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Works Cards with Physical Progress */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Obras em Andamento</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('obras')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Ver Todas as Obras</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredObras.map((obra) => {
              const obraRdos = rdos.filter((r) => r.obraId === obra.id);
              const rdosFinalizados = obraRdos.filter((r) => r.status === 'Finalizado').length;

              return (
                <div
                  key={obra.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                        {obra.codigo}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          obra.status === 'Em andamento'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {obra.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1 leading-snug">{obra.nome}</h3>
                    <p className="text-xs text-slate-400 mb-2 truncate">{obra.endereco}</p>

                    <div className="text-[11px] text-slate-400 space-y-0.5 mb-3">
                      <div>Cliente: <span className="text-slate-200">{obra.cliente}</span></div>
                      <div>Resp: <span className="text-slate-200">{obra.responsavelTecnico}</span></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Avanço Físico:</span>
                      <span className="font-bold text-amber-400 font-mono">{obra.avancoFisico}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all"
                        style={{ width: `${obra.avancoFisico}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      <span>{rdosFinalizados} RDOs emitidos</span>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectObra(obra.id);
                          onNavigateTab('rdos');
                        }}
                        className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer text-[11px]"
                      >
                        Acessar RDOs →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 Col): Recent Occurrences Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span>Ocorrências Recentes</span>
            </h2>
          </div>

          <div className="space-y-3">
            {recentOcorrencias.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2 opacity-80" />
                Nenhuma paralisação ou imprevisto grave registrado nos relatórios recentes.
              </div>
            ) : (
              recentOcorrencias.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-400">{item.codigoIdentificador}</span>
                    <span className="text-slate-500 font-mono">{item.data.split('-').reverse().join('/')}</span>
                  </div>
                  <div className="text-xs text-slate-200 font-medium">{item.obraNome}</div>
                  <p className="text-xs text-slate-400 leading-snug bg-slate-950/60 p-2 rounded border border-slate-800/60">
                    "{item.ocorrencias}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Latest RDOs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Últimos Relatórios Diários de Obra</span>
            </h2>
            <p className="text-xs text-slate-400">Histórico cronológico de emissões e rascunhos</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('rdos')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            Ver Todos →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-2.5">Código</th>
                <th className="pb-2.5">Data</th>
                <th className="pb-2.5">Obra</th>
                <th className="pb-2.5">Responsável</th>
                <th className="pb-2.5">Avanço</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ultimosRdos.map((rdo) => (
                <tr key={rdo.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-white">{rdo.codigoIdentificador}</td>
                  <td className="py-3 text-slate-300">{rdo.data.split('-').reverse().join('/')}</td>
                  <td className="py-3 font-medium text-slate-200">{rdo.obraNome}</td>
                  <td className="py-3 text-slate-400">{rdo.responsavelPreenchimento}</td>
                  <td className="py-3 font-mono text-amber-400">{rdo.avancoInformado}%</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rdo.status === 'Finalizado'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {rdo.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onViewRDO(rdo)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-amber-400" />
                      <span>Visualizar PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
