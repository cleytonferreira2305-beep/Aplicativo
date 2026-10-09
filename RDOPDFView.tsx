import React, { useState } from 'react';
import { RDO, Obra, Company } from '../types';
import { storageService } from '../services/storage';
import {
  Printer,
  Download,
  Share2,
  FolderGit2,
  CheckCircle2,
  ArrowLeft,
  HardHat,
  CloudSun,
  ShieldCheck,
  Calendar,
  Building,
  ExternalLink,
} from 'lucide-react';

interface RDOPDFViewProps {
  rdo: RDO;
  obra?: Obra;
  company?: Company;
  onBack: () => void;
}

export const RDOPDFView: React.FC<RDOPDFViewProps> = ({ rdo, obra, company, onBack }) => {
  const [driveSaved, setDriveSaved] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSyncToDrive = () => {
    storageService.syncRDOToDrive(rdo);
    setDriveSaved(true);
    setTimeout(() => setDriveSaved(false), 3000);
  };

  const totalOperarios = rdo.maoDeObra.reduce((sum, item) => sum + (item.quantidade || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      {/* Top Action Bar (hidden in print) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de RDOs</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sync to Google Drive */}
          <button
            type="button"
            onClick={handleSyncToDrive}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FolderGit2 className="w-4 h-4 text-amber-400" />
            <span>{driveSaved ? 'Salvo no Google Drive!' : 'Salvar na Pasta Google Drive'}</span>
          </button>

          {/* Print / Save as PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar em PDF</span>
          </button>
        </div>
      </div>

      {driveSaved && (
        <div className="print:hidden p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            Documento sincronizado com sucesso na pasta vinculada <strong>{obra?.nome || 'Obra'} / RDOs</strong> do Google Drive.
          </span>
        </div>
      )}

      {/* ======================================================== */}
      {/* FORMAL CIVIL ENGINEERING DAILY REPORT SHEET (A4 FORMAT)  */}
      {/* ======================================================== */}
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 border border-slate-300 print:border-none print:shadow-none print:p-0 print:rounded-none font-sans text-xs">
        {/* Document Header with Institutional Framing */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-900 text-amber-400 flex items-center justify-center rounded-lg font-black shrink-0">
                <HardHat className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  RELATÓRIO DIÁRIO DE OBRA
                </h1>
                <p className="text-xs font-semibold text-slate-700 tracking-wide">
                  {company?.razaoSocial || 'EMPRESA CONSTRUTORA & ENGENHARIA'}
                </p>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  CNPJ: {company?.cnpj || '18.423.901/0001-44'} • {company?.creaCau || 'CREA-SP 506.912.443-8'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block bg-slate-900 text-white font-mono font-bold text-sm px-3 py-1 rounded">
                {rdo.codigoIdentificador}
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                DATA: {rdo.data.split('-').reverse().join('/')}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                STATUS: {rdo.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Work & Site Metadata Section */}
        <div className="bg-slate-100 rounded-lg p-3.5 mb-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Obra / Empreendimento</span>
            <span className="font-bold text-slate-900 text-sm">{obra?.nome || rdo.obraNome || 'Obra'}</span>
            <span className="block text-[11px] text-slate-600 mt-0.5">{obra?.endereco || 'Endereço da obra'}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Cliente / Contratante:</span>
              <span className="font-semibold text-slate-800">{obra?.cliente || 'Cliente Contratante'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Responsável Técnico:</span>
              <span className="font-semibold text-slate-800">{rdo.responsavelPreenchimento}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Registro / ART:</span>
              <span className="font-mono text-slate-800">{rdo.responsavelRole || obra?.creaCau || 'CREA-SP'}</span>
            </div>
          </div>
        </div>

        {/* Climate Table */}
        <div className="mb-4">
          <div className="bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-t">
            1. Condições Climáticas e Praticabilidade dos Serviços
          </div>
          <table className="w-full border-collapse border border-slate-300 text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 font-bold text-slate-700">Período</th>
                <th className="p-2 border-r border-slate-300 font-bold text-slate-700">Condição Meteorológica</th>
                <th className="p-2 font-bold text-slate-700">Praticabilidade dos Serviços</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2 border-r border-slate-200 font-medium">Manhã (07:00 às 12:00)</td>
                <td className="p-2 border-r border-slate-200">{rdo.climaManha.tempo}</td>
                <td className="p-2 font-medium">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rdo.climaManha.condicaoTrabalho === 'Praticável'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rdo.climaManha.condicaoTrabalho}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 font-medium">Tarde (13:00 às 17:00)</td>
                <td className="p-2 border-r border-slate-200">{rdo.climaTarde.tempo}</td>
                <td className="p-2 font-medium">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rdo.climaTarde.condicaoTrabalho === 'Praticável'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rdo.climaTarde.condicaoTrabalho}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Activities & Stage Details */}
        <div className="mb-4">
          <div className="bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-t flex justify-between items-center">
            <span>2. Etapas, Frentes de Serviço e Atividades Executadas</span>
            <span className="font-mono text-amber-300 text-[10px]">Avanço Físico: {rdo.avancoInformado}%</span>
          </div>
          <div className="border border-slate-300 p-3 rounded-b space-y-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Etapas / Frentes:</span>
              <p className="font-bold text-slate-900">{rdo.etapasFrentes || 'Serviços gerais em andamento'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Detalhamento das Atividades:</span>
              <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                {rdo.atividadesExecutadas || 'Sem detalhamento de atividades registrado.'}
              </p>
            </div>
          </div>
        </div>

        {/* Labor & Equipment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Mão de Obra */}
          <div>
            <div className="bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-t flex justify-between">
              <span>3. Mão de Obra</span>
              <span className="text-amber-300 font-mono text-[10px]">Total: {totalOperarios}</span>
            </div>
            <table className="w-full border-collapse border border-slate-300 text-left text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-300 font-bold text-slate-700">Função</th>
                  <th className="p-1.5 border-r border-slate-300 font-bold text-slate-700 text-center">Qtd</th>
                  <th className="p-1.5 font-bold text-slate-700">Empresa</th>
                </tr>
              </thead>
              <tbody>
                {rdo.maoDeObra.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-2 text-center text-slate-500 italic">
                      Nenhum operário registrado
                    </td>
                  </tr>
                ) : (
                  rdo.maoDeObra.map((item) => (
                    <tr key={item.id} className="border-b border-slate-200">
                      <td className="p-1.5 border-r border-slate-200 font-medium">{item.funcao}</td>
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold">{item.quantidade}</td>
                      <td className="p-1.5 text-slate-600 truncate">{item.empresa}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Equipamentos */}
          <div>
            <div className="bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-t">
              4. Equipamentos & Maquinários
            </div>
            <table className="w-full border-collapse border border-slate-300 text-left text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-300 font-bold text-slate-700">Equipamento</th>
                  <th className="p-1.5 border-r border-slate-300 font-bold text-slate-700 text-center">Qtd</th>
                  <th className="p-1.5 font-bold text-slate-700">Situação</th>
                </tr>
              </thead>
              <tbody>
                {rdo.equipamentos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-2 text-center text-slate-500 italic">
                      Nenhum equipamento registrado
                    </td>
                  </tr>
                ) : (
                  rdo.equipamentos.map((item) => (
                    <tr key={item.id} className="border-b border-slate-200">
                      <td className="p-1.5 border-r border-slate-200 font-medium">{item.nome}</td>
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold">{item.quantidade}</td>
                      <td className="p-1.5 text-slate-600">{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Materials Table */}
        <div className="mb-4">
          <div className="bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-t">
            5. Materiais e Insumos Recebidos / Utilizados
          </div>
          <table className="w-full border-collapse border border-slate-300 text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-1.5 border-r border-slate-300 font-bold text-slate-700">Descrição do Material</th>
                <th className="p-1.5 border-r border-slate-300 font-bold text-slate-700 text-center">Quantidade</th>
                <th className="p-1.5 border-r border-slate-300 font-bold text-slate-700 text-center">Unidade</th>
                <th className="p-1.5 font-bold text-slate-700">Fluxo</th>
              </tr>
            </thead>
            <tbody>
              {rdo.materiais.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-2 text-center text-slate-500 italic">
                    Nenhum material registrado no período
                  </td>
                </tr>
              ) : (
                rdo.materiais.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="p-1.5 border-r border-slate-200 font-medium">{item.descricao}</td>
                    <td className="p-1.5 border-r border-slate-200 text-center font-bold">{item.quantidade}</td>
                    <td className="p-1.5 border-r border-slate-200 text-center text-slate-600">{item.unidade}</td>
                    <td className="p-1.5 font-semibold text-slate-700">{item.tipo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Occurrences & Safety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="bg-slate-100 border-b border-slate-300 p-2 font-bold text-slate-800 text-[11px] uppercase">
              6. Ocorrências e Imprevistos
            </div>
            <div className="p-2.5 text-slate-800 min-h-[50px]">
              {rdo.ocorrencias || 'Nenhuma ocorrência ou anormalidade registrada no período.'}
            </div>
          </div>

          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="bg-slate-100 border-b border-slate-300 p-2 font-bold text-slate-800 text-[11px] uppercase">
              7. Segurança do Trabalho & DDS
            </div>
            <div className="p-2.5 text-slate-800 min-h-[50px]">
              {rdo.seguranca || 'DDS diário realizado. Sem acidentes ou afastamentos.'}
            </div>
          </div>
        </div>

        {/* Photographic Report */}
        {rdo.fotos.length > 0 && (
          <div className="mb-6">
            <div className="bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-t">
              8. Relatório Fotográfico de Campo
            </div>
            <div className="border border-slate-300 p-3 rounded-b grid grid-cols-2 gap-4">
              {rdo.fotos.map((foto) => (
                <div key={foto.id} className="border border-slate-200 rounded p-2 text-center bg-slate-50">
                  <div className="h-44 bg-slate-200 flex items-center justify-center overflow-hidden rounded mb-1.5">
                    <img src={foto.url} alt={foto.legenda} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-800 leading-tight">{foto.legenda}</p>
                  <span className="text-[9px] text-slate-500 font-mono">{foto.dataUpload}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signatures Section */}
        <div className="pt-6 border-t-2 border-slate-900 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">{rdo.responsavelPreenchimento}</div>
              <div className="text-[10px] text-slate-600">Engenheiro / Responsável Técnico</div>
              <div className="text-[9px] text-slate-500 font-mono">{rdo.responsavelRole || 'CREA-SP'}</div>
            </div>

            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">Fiscalização de Obra</div>
              <div className="text-[10px] text-slate-600">Fiscal / Auditor Técnico</div>
              <div className="text-[9px] text-slate-500 font-mono">Assinatura & Carimbo</div>
            </div>

            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-900">{obra?.cliente || 'Contratante'}</div>
              <div className="text-[10px] text-slate-600">Ciente da Contratante</div>
              <div className="text-[9px] text-slate-500 font-mono">Visto do Cliente</div>
            </div>
          </div>
        </div>

        {/* Technical Footer */}
        <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[9px] text-slate-400 font-mono">
          RDO Inteligente • Sistema de Engenharia Civil • Documento Gerado em {new Date().toLocaleString('pt-BR')} • {rdo.codigoIdentificador}
        </div>
      </div>
    </div>
  );
};
