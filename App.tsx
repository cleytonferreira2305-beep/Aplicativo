/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Navbar, ActiveTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ObrasList } from './components/ObrasList';
import { RDOList } from './components/RDOList';
import { RDOForm } from './components/RDOForm';
import { RDOPDFView } from './components/RDOPDFView';
import { EmpresasList } from './components/EmpresasList';
import { EquipeList } from './components/EquipeList';
import { DocumentosDrive } from './components/DocumentosDrive';
import { UsuariosList } from './components/UsuariosList';
import { ConfiguracoesView } from './components/ConfiguracoesView';
import { VoiceAIModal } from './components/VoiceAIModal';
import { storageService } from './services/storage';
import { Obra, RDO, Company, TeamMember, AIStructureResult } from './types';
import { HardHat } from 'lucide-react';

function MainApp() {
  const { currentUser, isLoading } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedObraId, setSelectedObraId] = useState<string>('all');

  // Sub-views state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRDO, setEditingRDO] = useState<RDO | null>(null);
  const [viewingPDFRDO, setViewingPDFRDO] = useState<RDO | null>(null);
  const [isVoiceAIModalOpen, setIsVoiceAIModalOpen] = useState(false);

  // Data Store
  const [obras, setObras] = useState<Obra[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [rdos, setRdos] = useState<RDO[]>([]);

  // Load data on init
  const loadAllData = () => {
    setObras(storageService.getObras());
    setCompanies(storageService.getCompanies());
    setTeam(storageService.getTeam());
    setRdos(storageService.getRDOs());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for Data Mutations
  const handleSaveObra = (savedObra: Obra) => {
    const updated = storageService.saveObra(savedObra);
    setObras(updated);
  };

  const handleDeleteObra = (id: string) => {
    const updated = storageService.deleteObra(id);
    setObras(updated);
    if (selectedObraId === id) setSelectedObraId('all');
  };

  const handleSaveCompany = (comp: Company) => {
    const updated = storageService.saveCompany(comp);
    setCompanies(updated);
  };

  const handleDeleteCompany = (id: string) => {
    const updated = storageService.deleteCompany(id);
    setCompanies(updated);
  };

  const handleSaveTeamMember = (member: TeamMember) => {
    const updated = storageService.saveTeamMember(member);
    setTeam(updated);
  };

  const handleDeleteTeamMember = (id: string) => {
    const updated = storageService.deleteTeamMember(id);
    setTeam(updated);
  };

  const handleSaveRDO = (savedRDO: RDO) => {
    const updated = storageService.saveRDO(savedRDO);
    setRdos(updated);
    setIsFormOpen(false);
    setEditingRDO(null);

    // If finalized, go straight to PDF preview
    if (savedRDO.status === 'Finalizado') {
      setViewingPDFRDO(savedRDO);
    } else {
      setActiveTab('rdos');
    }
  };

  const handleDeleteRDO = (id: string) => {
    const updated = storageService.deleteRDO(id);
    setRdos(updated);
  };

  // Voice AI -> Pre-fill RDO Form
  const handleApplyAIDraft = (draft: AIStructureResult, obraId: string) => {
    const targetObra = obras.find((o) => o.id === obraId) || obras[0];
    const nextSeq = targetObra ? storageService.getNextRDONumber(targetObra.id) : 1;

    // Convert AI Labor to LaborItems
    const mappedLabor = (draft.maoDeObra || []).map((m, idx) => ({
      id: `ai-l-${idx}`,
      funcao: m.funcao,
      quantidade: m.quantidade,
      empresa: m.empresa || 'Própria',
    }));

    // Convert AI Equipments
    const mappedEquip = (draft.equipamentos || []).map((e, idx) => ({
      id: `ai-eq-${idx}`,
      nome: e.nome,
      quantidade: e.quantidade,
      status: (e.status as any) || 'Operando',
    }));

    // Convert AI Materials
    const mappedMaterials = (draft.materiais || []).map((mat, idx) => ({
      id: `ai-mat-${idx}`,
      descricao: mat.descricao,
      quantidade: mat.quantidade,
      unidade: mat.unidade || 'un.',
      tipo: (mat.tipo as any) || 'Recebido',
    }));

    const prefilledRDO: RDO = {
      id: 'rdo-ai-' + Date.now(),
      numeroSequencial: nextSeq,
      codigoIdentificador: `RDO #${String(nextSeq).padStart(3, '0')}/${new Date().getFullYear()}`,
      data: new Date().toISOString().split('T')[0],
      obraId: targetObra?.id || '',
      obraNome: targetObra?.nome || '',
      responsavelPreenchimento: currentUser?.name || 'Engenheiro Residente',
      responsavelRole: currentUser?.crea || 'CREA-SP',
      climaManha: {
        tempo: draft.climaManha?.toLowerCase().includes('chuva') ? 'Chuvoso' : 'Ensolarado',
        condicaoTrabalho: draft.climaManha?.toLowerCase().includes('chuva')
          ? 'Parcialmente Praticável'
          : 'Praticável',
      },
      climaTarde: {
        tempo: 'Ensolarado',
        condicaoTrabalho: 'Praticável',
      },
      etapasFrentes: draft.etapasFrentes || 'Estrutura - Serviços gerais de campo',
      atividadesExecutadas: draft.atividadesExecutadas || '',
      avancoInformado: draft.avancoPercentual || 0,
      maoDeObra: mappedLabor.length > 0 ? mappedLabor : [{ id: '1', funcao: 'Pedreiro', quantidade: 2, empresa: 'Própria' }],
      equipamentos: mappedEquip,
      materiais: mappedMaterials,
      ocorrencias: draft.ocorrencias || '',
      seguranca: draft.seguranca || 'DDS realizado. Nenhum acidente registrado.',
      observacoes: draft.observacoes || '',
      fotos: [],
      status: 'Rascunho',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    setEditingRDO(prefilledRDO);
    setSelectedObraId(targetObra?.id || 'all');
    setIsFormOpen(true);
  };

  // 1. Loading State Guard (Never show unauthenticated internal data)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black animate-pulse mb-4 shadow-lg shadow-amber-500/20">
          <HardHat className="w-7 h-7" />
        </div>
        <div className="text-sm font-bold text-slate-200">RDO INTELIGENTE</div>
        <p className="text-xs text-slate-500 mt-1">Verificando sessão de acesso seguro...</p>
      </div>
    );
  }

  // 2. Unauthenticated Gate -> Show Landing Page Only
  if (!currentUser) {
    return <LandingPage />;
  }

  // 3. Authenticated Content
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Internal Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsFormOpen(false);
          setViewingPDFRDO(null);
        }}
        obras={obras}
        selectedObraId={selectedObraId}
        onSelectObra={(id) => setSelectedObraId(id)}
        onOpenVoiceAI={() => setIsVoiceAIModalOpen(true)}
        onOpenNewRDO={() => {
          setEditingRDO(null);
          setIsFormOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* PDF VIEW SUB-PAGE */}
        {viewingPDFRDO ? (
          <RDOPDFView
            rdo={viewingPDFRDO}
            obra={obras.find((o) => o.id === viewingPDFRDO.obraId)}
            company={companies[0]}
            onBack={() => setViewingPDFRDO(null)}
          />
        ) : isFormOpen ? (
          /* FORM CREATE/EDIT SUB-PAGE */
          <RDOForm
            initialRDO={editingRDO}
            obras={obras}
            defaultObraId={selectedObraId !== 'all' ? selectedObraId : undefined}
            onSave={handleSaveRDO}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingRDO(null);
            }}
            onOpenVoiceAI={() => setIsVoiceAIModalOpen(true)}
          />
        ) : (
          /* REGULAR TAB VIEWS */
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                obras={obras}
                rdos={rdos}
                selectedObraId={selectedObraId}
                onSelectObra={setSelectedObraId}
                onOpenVoiceAI={() => setIsVoiceAIModalOpen(true)}
                onOpenNewRDO={() => {
                  setEditingRDO(null);
                  setIsFormOpen(true);
                }}
                onViewRDO={(rdo) => setViewingPDFRDO(rdo)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'obras' && (
              <ObrasList
                obras={obras}
                companies={companies}
                onSaveObra={handleSaveObra}
                onDeleteObra={handleDeleteObra}
                onSelectObra={setSelectedObraId}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'rdos' && (
              <RDOList
                rdos={rdos}
                obras={obras}
                selectedObraId={selectedObraId}
                onSelectObra={setSelectedObraId}
                onOpenNewRDO={() => {
                  setEditingRDO(null);
                  setIsFormOpen(true);
                }}
                onOpenVoiceAI={() => setIsVoiceAIModalOpen(true)}
                onEditRDO={(rdo) => {
                  setEditingRDO(rdo);
                  setIsFormOpen(true);
                }}
                onViewRDO={(rdo) => setViewingPDFRDO(rdo)}
                onDeleteRDO={handleDeleteRDO}
              />
            )}

            {activeTab === 'empresas' && (
              <EmpresasList
                companies={companies}
                onSaveCompany={handleSaveCompany}
                onDeleteCompany={handleDeleteCompany}
              />
            )}

            {activeTab === 'equipe' && (
              <EquipeList
                team={team}
                obras={obras}
                onSaveMember={handleSaveTeamMember}
                onDeleteMember={handleDeleteTeamMember}
              />
            )}

            {activeTab === 'documentos' && (
              <DocumentosDrive
                obras={obras}
                selectedObraId={selectedObraId}
                onSelectObra={setSelectedObraId}
              />
            )}

            {activeTab === 'usuarios' && <UsuariosList />}

            {activeTab === 'configuracoes' && (
              <ConfiguracoesView onDataReset={loadAllData} />
            )}
          </>
        )}
      </main>

      {/* Voice AI Modal (Always accessible via shortcut) */}
      <VoiceAIModal
        isOpen={isVoiceAIModalOpen}
        onClose={() => setIsVoiceAIModalOpen(false)}
        obras={obras}
        selectedObraId={selectedObraId}
        onApplyDraftToRDO={handleApplyAIDraft}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
