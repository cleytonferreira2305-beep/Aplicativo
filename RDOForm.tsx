import React, { useState, useEffect } from 'react';
import { RDO, Obra, Company, LaborItem, EquipmentItem, MaterialItem, RDOPhoto, ClimatePeriod } from '../types';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage';
import {
  Save,
  CheckCircle,
  Sparkles,
  Camera,
  Plus,
  Trash2,
  Calendar,
  CloudSun,
  Layers,
  Users,
  Wrench,
  Package,
  AlertTriangle,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  HardHat,
  Image as ImageIcon,
} from 'lucide-react';

interface RDOFormProps {
  initialRDO?: RDO | null;
  obras: Obra[];
  defaultObraId?: string;
  onSave: (savedRDO: RDO) => void;
  onCancel: () => void;
  onOpenVoiceAI: () => void;
}

export const RDOForm: React.FC<RDOFormProps> = ({
  initialRDO,
  obras,
  defaultObraId,
  onSave,
  onCancel,
  onOpenVoiceAI,
}) => {
  const { currentUser } = useAuth();

  // Tab index for mobile-friendly step navigation (1 to 5)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [selectedObraId, setSelectedObraId] = useState<string>(
    initialRDO?.obraId || defaultObraId || obras[0]?.id || ''
  );
  const [dataRDO, setDataRDO] = useState<string>(
    initialRDO?.data || new Date().toISOString().split('T')[0]
  );
  const [numeroSequencial, setNumeroSequencial] = useState<number>(
    initialRDO?.numeroSequencial || (selectedObraId ? storageService.getNextRDONumber(selectedObraId) : 1)
  );
  const [responsavel, setResponsavel] = useState<string>(
    initialRDO?.responsavelPreenchimento || currentUser?.name || 'Engenheiro Residente'
  );
  const [responsavelRole, setResponsavelRole] = useState<string>(
    initialRDO?.responsavelRole || (currentUser?.crea ? `Responsável Técnico (${currentUser.crea})` : 'Engenheiro Civil')
  );

  // Clima
  const [climaManha, setClimaManha] = useState<ClimatePeriod>(
    initialRDO?.climaManha || { tempo: 'Ensolarado', condicaoTrabalho: 'Praticável' }
  );
  const [climaTarde, setClimaTarde] = useState<ClimatePeriod>(
    initialRDO?.climaTarde || { tempo: 'Ensolarado', condicaoTrabalho: 'Praticável' }
  );

  // Atividades & Avanço
  const [etapasFrentes, setEtapasFrentes] = useState<string>(initialRDO?.etapasFrentes || '');
  const [atividadesExecutadas, setAtividadesExecutadas] = useState<string>(
    initialRDO?.atividadesExecutadas || ''
  );
  const [avancoInformado, setAvancoInformado] = useState<number>(initialRDO?.avancoInformado || 0);

  // Mão de Obra
  const [maoDeObra, setMaoDeObra] = useState<LaborItem[]>(
    initialRDO?.maoDeObra || [
      { id: '1', funcao: 'Pedreiro', quantidade: 2, empresa: 'Própria' },
      { id: '2', funcao: 'Servente', quantidade: 4, empresa: 'Própria' },
    ]
  );

  // Equipamentos
  const [equipamentos, setEquipamentos] = useState<EquipmentItem[]>(
    initialRDO?.equipamentos || [
      { id: '1', nome: 'Betoneira 400L', quantidade: 1, status: 'Operando' },
    ]
  );

  // Materiais
  const [materiais, setMateriais] = useState<MaterialItem[]>(
    initialRDO?.materiais || [
      { id: '1', descricao: 'Cimento CP-II', quantidade: '20', unidade: 'sacos', tipo: 'Recebido' },
    ]
  );

  // Ocorrências e Segurança
  const [ocorrencias, setOcorrencias] = useState<string>(initialRDO?.ocorrencias || '');
  const [seguranca, setSeguranca] = useState<string>(
    initialRDO?.seguranca || 'DDS diário realizado. Nenhum acidente registrado.'
  );
  const [observacoes, setObservacoes] = useState<string>(initialRDO?.observacoes || '');

  // Fotos
  const [fotos, setFotos] = useState<RDOPhoto[]>(initialRDO?.fotos || []);
  const [newPhotoLegenda, setNewPhotoLegenda] = useState<string>('');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');

  // Update sequential number if obra changes on a new RDO
  useEffect(() => {
    if (!initialRDO && selectedObraId) {
      setNumeroSequencial(storageService.getNextRDONumber(selectedObraId));
    }
  }, [selectedObraId, initialRDO]);

  // Add / Remove helpers
  const handleAddLabor = () => {
    const newItem: LaborItem = {
      id: String(Date.now()),
      funcao: 'Servente',
      quantidade: 1,
      empresa: 'Própria',
    };
    setMaoDeObra([...maoDeObra, newItem]);
  };

  const handleRemoveLabor = (id: string) => {
    setMaoDeObra(maoDeObra.filter((item) => item.id !== id));
  };

  const handleAddEquipment = () => {
    const newItem: EquipmentItem = {
      id: String(Date.now()),
      nome: 'Vibrador de Imersão',
      quantidade: 1,
      status: 'Operando',
    };
    setEquipamentos([...equipamentos, newItem]);
  };

  const handleRemoveEquipment = (id: string) => {
    setEquipamentos(equipamentos.filter((item) => item.id !== id));
  };

  const handleAddMaterial = () => {
    const newItem: MaterialItem = {
      id: String(Date.now()),
      descricao: '',
      quantidade: '1',
      unidade: 'un.',
      tipo: 'Recebido',
    };
    setMateriais([...materiais, newItem]);
  };

  const handleRemoveMaterial = (id: string) => {
    setMateriais(materiais.filter((item) => item.id !== id));
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const newPhoto: RDOPhoto = {
      id: 'foto-' + Date.now(),
      url: newPhotoUrl.trim(),
      legenda: newPhotoLegenda.trim() || 'Registro fotográfico da execução de serviço',
      dataUpload: new Date().toLocaleString('pt-BR'),
    };
    setFotos([...fotos, newPhoto]);
    setNewPhotoUrl('');
    setNewPhotoLegenda('');
  };

  const handleUploadLocalPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photo: RDOPhoto = {
          id: 'foto-' + Date.now(),
          url: reader.result as string,
          legenda: newPhotoLegenda.trim() || `Foto de campo: ${file.name}`,
          dataUpload: new Date().toLocaleString('pt-BR'),
        };
        setFotos([...fotos, photo]);
        setNewPhotoLegenda('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (id: string) => {
    setFotos(fotos.filter((f) => f.id !== id));
  };

  // Save handler (Rascunho or Finalizado)
  const handleSubmitForm = (statusToSave: 'Rascunho' | 'Finalizado') => {
    const targetObra = obras.find((o) => o.id === selectedObraId);

    const rdoToSave: RDO = {
      id: initialRDO?.id || 'rdo-' + Date.now(),
      numeroSequencial,
      codigoIdentificador: `RDO #${String(numeroSequencial).padStart(3, '0')}/${dataRDO.split('-')[0] || '2026'}`,
      data: dataRDO,
      obraId: selectedObraId,
      obraNome: targetObra?.nome || 'Obra',
      responsavelPreenchimento: responsavel,
      responsavelRole,
      climaManha,
      climaTarde,
      etapasFrentes: etapasFrentes || 'Serviços gerais',
      atividadesExecutadas: atividadesExecutadas || 'Conforme planejamento da obra',
      avancoInformado: Number(avancoInformado) || 0,
      maoDeObra,
      equipamentos,
      materiais,
      ocorrencias,
      seguranca,
      observacoes,
      fotos,
      status: statusToSave,
      criadoEm: initialRDO?.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      finalizadoEm: statusToSave === 'Finalizado' ? new Date().toISOString() : undefined,
    };

    onSave(rdoToSave);
  };

  const stepsList = [
    { num: 1, label: '1. Dados Gerais & Clima', icon: CloudSun },
    { num: 2, label: '2. Atividades & Avanço', icon: Layers },
    { num: 3, label: '3. Equipe & Equipamentos', icon: Users },
    { num: 4, label: '4. Materiais & Ocorrências', icon: AlertTriangle },
    { num: 5, label: '5. Fotos & Conclusão', icon: Camera },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <HardHat className="w-6 h-6 text-amber-500" />
              {initialRDO ? `Editar Relatório Diário de Obra #${initialRDO.numeroSequencial}` : 'Novo Relatório Diário de Obra (RDO)'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 ml-8">
            Preenchimento padronizado de campo com apoio de IA e emissão de documento comprobatório
          </p>
        </div>

        {/* AI Voice Assistant Highlight Button */}
        <button
          type="button"
          onClick={onOpenVoiceAI}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Preencher com IA por Voz</span>
        </button>
      </div>

      {/* Mobile-Friendly Stepper Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[580px] gap-1">
          {stepsList.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.num;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FORM CONTENT BY STEP */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl">
        {/* STEP 1: DADOS GERAIS & CLIMA */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                Informações da Obra & Condições Climáticas
              </h2>
              <p className="text-xs text-slate-400">Identificação básica e interferência meteorológica</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Obra Correspondente *
                </label>
                <select
                  value={selectedObraId}
                  onChange={(e) => setSelectedObraId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {obras.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.codigo} - {o.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Data do Relatório (DD/MM/AAAA) *
                </label>
                <input
                  type="date"
                  value={dataRDO}
                  onChange={(e) => setDataRDO(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Número Sequencial
                </label>
                <input
                  type="number"
                  value={numeroSequencial}
                  onChange={(e) => setNumeroSequencial(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Responsável pelo Preenchimento *
                </label>
                <input
                  type="text"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  placeholder="Nome do engenheiro ou encarregado"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cargo / CREA
                </label>
                <input
                  type="text"
                  value={responsavelRole}
                  onChange={(e) => setResponsavelRole(e.target.value)}
                  placeholder="Ex: Engenheiro Residente (CREA-SP 506.912.443-8)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Climate Conditions by Period */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Condições Climáticas por Período
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Manhã */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Período da Manhã</span>
                    <span className="text-[10px] text-slate-400 font-mono">07:00 - 12:00</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tempo:</label>
                    <select
                      value={climaManha.tempo}
                      onChange={(e) =>
                        setClimaManha({ ...climaManha, tempo: e.target.value as any })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Ensolarado">Ensolarado (Claro)</option>
                      <option value="Nublado">Nublado</option>
                      <option value="Chuvoso">Chuvoso (Chuva Leve)</option>
                      <option value="Chuva Forte">Chuva Forte / Temporal</option>
                      <option value="Impraticável">Impraticável</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Condição do Trabalho:</label>
                    <select
                      value={climaManha.condicaoTrabalho}
                      onChange={(e) =>
                        setClimaManha({ ...climaManha, condicaoTrabalho: e.target.value as any })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Praticável">Praticável (Sem impacto)</option>
                      <option value="Parcialmente Praticável">Parcialmente Praticável (Com restrições)</option>
                      <option value="Impraticável">Impraticável (Serviços paralisados)</option>
                    </select>
                  </div>
                </div>

                {/* Tarde */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Período da Tarde</span>
                    <span className="text-[10px] text-slate-400 font-mono">13:00 - 17:00</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tempo:</label>
                    <select
                      value={climaTarde.tempo}
                      onChange={(e) =>
                        setClimaTarde({ ...climaTarde, tempo: e.target.value as any })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Ensolarado">Ensolarado (Claro)</option>
                      <option value="Nublado">Nublado</option>
                      <option value="Chuvoso">Chuvoso (Chuva Leve)</option>
                      <option value="Chuva Forte">Chuva Forte / Temporal</option>
                      <option value="Impraticável">Impraticável</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Condição do Trabalho:</label>
                    <select
                      value={climaTarde.condicaoTrabalho}
                      onChange={(e) =>
                        setClimaTarde({ ...climaTarde, condicaoTrabalho: e.target.value as any })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Praticável">Praticável (Sem impacto)</option>
                      <option value="Parcialmente Praticável">Parcialmente Praticável (Com restrições)</option>
                      <option value="Impraticável">Impraticável (Serviços paralisados)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ATIVIDADES & AVANÇO */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Etapas, Frentes de Serviço & Avanço Físico
              </h2>
              <p className="text-xs text-slate-400">Detalhamento técnico da produção do dia</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Etapas e Frentes de Serviço *
              </label>
              <input
                type="text"
                value={etapasFrentes}
                onChange={(e) => setEtapasFrentes(e.target.value)}
                placeholder="Ex: Fundação profunda, Estrutura - Laje do 2º pavimento, Alvenaria bloco cerâmico"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Atividades Executadas no Dia *
              </label>
              <textarea
                rows={5}
                value={atividadesExecutadas}
                onChange={(e) => setAtividadesExecutadas(e.target.value)}
                placeholder="Descreva minuciosamente o que foi feito no canteiro de obras..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Percentual de Execução / Avanço Informado:
                </label>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {avancoInformado}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={avancoInformado}
                onChange={(e) => setAvancoInformado(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MÃO DE OBRA & EQUIPAMENTOS */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Mão de Obra & Equipamentos no Canteiro
              </h2>
              <p className="text-xs text-slate-400">Controle do efetivo diário e parque de máquinas</p>
            </div>

            {/* Mão de Obra */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Mão de Obra por Função e Empresa ({maoDeObra.reduce((acc, m) => acc + (m.quantidade || 0), 0)} operários totais)
                </h3>
                <button
                  type="button"
                  onClick={handleAddLabor}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Função
                </button>
              </div>

              <div className="space-y-2">
                {maoDeObra.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                  >
                    <div className="sm:col-span-5">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Função</label>
                      <input
                        type="text"
                        value={item.funcao}
                        onChange={(e) => {
                          const updated = [...maoDeObra];
                          updated[index].funcao = e.target.value;
                          setMaoDeObra(updated);
                        }}
                        placeholder="Ex: Pedreiro, Carpinteiro"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => {
                          const updated = [...maoDeObra];
                          updated[index].quantidade = parseInt(e.target.value, 10) || 0;
                          setMaoDeObra(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Empresa</label>
                      <input
                        type="text"
                        value={item.empresa}
                        onChange={(e) => {
                          const updated = [...maoDeObra];
                          updated[index].empresa = e.target.value;
                          setMaoDeObra(updated);
                        }}
                        placeholder="Própria / Terceirizada"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveLabor(item.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-950/40 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipamentos */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Equipamentos & Maquinários
                </h3>
                <button
                  type="button"
                  onClick={handleAddEquipment}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Equipamento
                </button>
              </div>

              <div className="space-y-2">
                {equipamentos.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                  >
                    <div className="sm:col-span-6">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Nome / Modelo</label>
                      <input
                        type="text"
                        value={item.nome}
                        onChange={(e) => {
                          const updated = [...equipamentos];
                          updated[index].nome = e.target.value;
                          setEquipamentos(updated);
                        }}
                        placeholder="Ex: Guincho de Coluna 500kg"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => {
                          const updated = [...equipamentos];
                          updated[index].quantidade = parseInt(e.target.value, 10) || 0;
                          setEquipamentos(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Status Operacional</label>
                      <select
                        value={item.status}
                        onChange={(e) => {
                          const updated = [...equipamentos];
                          updated[index].status = e.target.value as any;
                          setEquipamentos(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="Operando">Operando Normalmente</option>
                        <option value="Parado">Parado (Aguardando)</option>
                        <option value="Manutenção">Em Manutenção</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment(item.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-950/40 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MATERIAIS, OCORRÊNCIAS & SEGURANÇA */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                Materiais, Ocorrências & Segurança
              </h2>
              <p className="text-xs text-slate-400">Entradas, saídas de insumos, atrasos e DDS</p>
            </div>

            {/* Materiais */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Materiais Recebidos ou Utilizados
                </h3>
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Material
                </button>
              </div>

              <div className="space-y-2">
                {materiais.map((mat, index) => (
                  <div
                    key={mat.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                  >
                    <div className="sm:col-span-5">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Descrição do Material</label>
                      <input
                        type="text"
                        value={mat.descricao}
                        onChange={(e) => {
                          const updated = [...materiais];
                          updated[index].descricao = e.target.value;
                          setMateriais(updated);
                        }}
                        placeholder="Ex: Cimento CP-II, Concreto Usinado"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Quantidade</label>
                      <input
                        type="text"
                        value={mat.quantidade}
                        onChange={(e) => {
                          const updated = [...materiais];
                          updated[index].quantidade = e.target.value;
                          setMateriais(updated);
                        }}
                        placeholder="Ex: 50"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Unidade</label>
                      <input
                        type="text"
                        value={mat.unidade}
                        onChange={(e) => {
                          const updated = [...materiais];
                          updated[index].unidade = e.target.value;
                          setMateriais(updated);
                        }}
                        placeholder="sacos, m³, kg"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-500 block mb-0.5">Fluxo</label>
                      <select
                        value={mat.tipo}
                        onChange={(e) => {
                          const updated = [...materiais];
                          updated[index].tipo = e.target.value as any;
                          setMateriais(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="Recebido">Recebido na Obra</option>
                        <option value="Utilizado">Utilizado no Dia</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(mat.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-950/40 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ocorrências e Imprevistos */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Ocorrências, Imprevistos e Paralisações
              </label>
              <textarea
                rows={3}
                value={ocorrencias}
                onChange={(e) => setOcorrencias(e.target.value)}
                placeholder="Ex: Paralisação de 1h devido à chuva forte; atraso na entrega de armaduras..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Segurança */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Segurança do Trabalho & DDS (Diálogo Diário de Segurança)
              </label>
              <textarea
                rows={2}
                value={seguranca}
                onChange={(e) => setSeguranca(e.target.value)}
                placeholder="Ex: DDS realizado às 07:00 com o tema 'Uso de EPI em altura'. Nenhum acidente registrado."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Observações Gerais */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Observações Gerais e Próximos Passos
              </label>
              <textarea
                rows={2}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Ex: Visita do cliente agendada para amanhã às 14h..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* STEP 5: FOTOS & FINALIZAÇÃO */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                Relatório Fotográfico & Conclusão do RDO
              </h2>
              <p className="text-xs text-slate-400">Registros visuais de campo com legenda técnica</p>
            </div>

            {/* Photo Addition Form */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Adicionar Foto do Canteiro
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">URL da Imagem / Link</label>
                  <input
                    type="text"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="https://... ou faça upload do celular"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Legenda Técnica da Foto</label>
                  <input
                    type="text"
                    value={newPhotoLegenda}
                    onChange={(e) => setNewPhotoLegenda(e.target.value)}
                    placeholder="Ex: Concretagem das vigas da laje L2"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Carregar do Dispositivo / Celular</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleUploadLocalPhoto}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleAddPhoto}
                  disabled={!newPhotoUrl.trim()}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Foto por URL</span>
                </button>
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300">
                Fotos Anexadas a este RDO ({fotos.length})
              </h3>

              {fotos.length === 0 ? (
                <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">
                  Nenhuma foto anexada ainda. Você pode tirar fotos pelo celular ou inserir imagens da obra.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fotos.map((foto) => (
                    <div
                      key={foto.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow group flex flex-col"
                    >
                      <div className="relative h-44 bg-slate-900">
                        <img
                          src={foto.url}
                          alt={foto.legenda}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(foto.id)}
                          className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-500 text-white p-1.5 rounded-lg shadow opacity-90 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-slate-200 font-medium leading-snug mb-1">
                          {foto.legenda}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {foto.dataUpload}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP FOOTER CONTROLS */}
        <div className="pt-6 mt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Etapa Anterior</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeStep < 5 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Próxima Etapa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {/* Salvar como Rascunho */}
            <button
              type="button"
              onClick={() => handleSubmitForm('Rascunho')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar como Rascunho</span>
            </button>

            {/* Finalizar RDO */}
            <button
              type="button"
              onClick={() => handleSubmitForm('Finalizado')}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Finalizar RDO & Emitir PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
