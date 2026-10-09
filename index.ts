export type UserRole = 'Editor' | 'Visualizador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  crea?: string;
  avatar?: string;
}

export interface Company {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  contato: string;
  responsavelTecnico: string;
  creaCau: string;
  isDemo?: boolean;
}

export interface Obra {
  id: string;
  codigo: string;
  nome: string;
  cliente: string;
  endereco: string;
  responsavelTecnico: string;
  creaCau: string;
  dataInicio: string; // YYYY-MM-DD
  terminoPrevisto: string; // YYYY-MM-DD
  status: 'Em andamento' | 'Concluída' | 'Pausada' | 'Planejamento';
  avancoFisico: number; // 0 - 100
  driveFolderId?: string;
  driveFolderUrl?: string;
  empresaId?: string;
  isDemo?: boolean;
}

export interface TeamMember {
  id: string;
  nome: string;
  funcao: 'Engenheiro Residente' | 'Engenheiro de Segurança' | 'Mestre de Obras' | 'Encarregado' | 'Estagiário' | 'Técnico em Edificações' | 'Outro';
  empresa: string;
  contato: string;
  obrasIds: string[];
  creaCau?: string;
  isDemo?: boolean;
}

export interface ClimatePeriod {
  tempo: 'Ensolarado' | 'Nublado' | 'Chuvoso' | 'Chuva Forte' | 'Impraticável';
  condicaoTrabalho: 'Praticável' | 'Parcialmente Praticável' | 'Impraticável';
}

export interface LaborItem {
  id: string;
  funcao: string;
  quantidade: number;
  empresa: string;
}

export interface EquipmentItem {
  id: string;
  nome: string;
  quantidade: number;
  status: 'Operando' | 'Parado' | 'Manutenção';
}

export interface MaterialItem {
  id: string;
  descricao: string;
  quantidade: string;
  unidade: string;
  tipo: 'Recebido' | 'Utilizado';
}

export interface RDOPhoto {
  id: string;
  url: string;
  legenda: string;
  dataUpload: string;
}

export interface RDO {
  id: string;
  numeroSequencial: number; // 1, 2, 3...
  codigoIdentificador: string; // ex: RDO-001/2026
  data: string; // YYYY-MM-DD or DD/MM/YYYY
  obraId: string;
  obraNome?: string;
  responsavelPreenchimento: string;
  responsavelRole?: string;
  
  // Clima
  climaManha: ClimatePeriod;
  climaTarde: ClimatePeriod;
  
  // Atividades
  etapasFrentes: string;
  atividadesExecutadas: string;
  avancoInformado: number; // %
  
  // Recursos
  maoDeObra: LaborItem[];
  equipamentos: EquipmentItem[];
  materiais: MaterialItem[];
  
  // Ocorrências e Segurança
  ocorrencias: string;
  seguranca: string;
  observacoes: string;
  
  // Fotos
  fotos: RDOPhoto[];
  
  // Status
  status: 'Rascunho' | 'Finalizado';
  
  // Metadados
  criadoEm: string;
  atualizadoEm: string;
  finalizadoEm?: string;
  isDemo?: boolean;
}

export interface AIUncertainItem {
  campo: string;
  detalhe: string;
  status: 'Requer confirmação';
}

export interface AIStructureResult {
  transcricaoIntegral?: string;
  climaManha?: string;
  climaTarde?: string;
  etapasFrentes?: string;
  atividadesExecutadas: string;
  avancoPercentual?: number | null;
  maoDeObra?: Array<{ funcao: string; quantidade: number; empresa?: string }>;
  equipamentos?: Array<{ nome: string; quantidade: number; status?: string }>;
  materiais?: Array<{ descricao: string; quantidade: string; unidade?: string; tipo?: string }>;
  ocorrencias?: string;
  seguranca?: string;
  observacoes?: string;
  itensIncertos?: AIUncertainItem[];
  warning?: string;
}

export interface DriveFolderItem {
  id: string;
  obraId: string;
  tipo: 'RDOs' | 'Fotos' | 'Documentos';
  nomeArquivo: string;
  tamanho: string;
  dataModificacao: string;
  url: string;
}
