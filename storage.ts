import { Company, Obra, TeamMember, RDO, User, DriveFolderItem } from '../types';

const STORAGE_KEYS = {
  COMPANIES: 'rdo_empresas_v1',
  OBRAS: 'rdo_obras_v1',
  TEAM: 'rdo_equipe_v1',
  RDOS: 'rdo_relatorios_v1',
  DRIVE_FILES: 'rdo_drive_files_v1',
  USERS: 'rdo_usuarios_v1',
};

// Initial Seed Data clearly marked as DADOS DE DEMONSTRAÇÃO
const INITIAL_COMPANIES: Company[] = [
  {
    id: 'emp-001',
    razaoSocial: 'Construtora Horizonte Engenharia & Obras Ltda',
    nomeFantasia: 'Horizonte Engenharia',
    cnpj: '18.423.901/0001-44',
    contato: '(11) 3244-5500 / contato@horizonteeng.com.br',
    responsavelTecnico: 'Eng. Carlos Eduardo Ribeiro',
    creaCau: 'CREA-SP 506.912.443-8',
    isDemo: true,
  },
  {
    id: 'emp-002',
    razaoSocial: 'Fundape Estruturas e Fundações Eireli',
    nomeFantasia: 'Fundape Engenharia',
    cnpj: '09.312.784/0001-92',
    contato: '(11) 2981-1200 / engenharia@fundape.com.br',
    responsavelTecnico: 'Engª. Larissa Freitas',
    creaCau: 'CREA-SP 507.819.330-1',
    isDemo: true,
  },
];

const INITIAL_OBRAS: Obra[] = [
  {
    id: 'obra-001',
    codigo: 'OBR-2026-001',
    nome: 'Edifício Residencial Splendor Towers',
    cliente: 'Splendor Incorporadora e Empreendimentos',
    endereco: 'Av. Paulista, 1850 - Bela Vista, São Paulo - SP',
    responsavelTecnico: 'Eng. Carlos Eduardo Ribeiro',
    creaCau: 'CREA-SP 506.912.443-8',
    dataInicio: '2026-01-15',
    terminoPrevisto: '2027-06-30',
    status: 'Em andamento',
    avancoFisico: 42,
    driveFolderUrl: 'https://drive.google.com/drive/folders/1A_Demo_Splendor_Towers_Drive',
    empresaId: 'emp-001',
    isDemo: true,
  },
  {
    id: 'obra-002',
    codigo: 'OBR-2026-002',
    nome: 'Complexo Logístico Alpha Distribution Center',
    cliente: 'Alpha Logística & Transportes S.A.',
    endereco: 'Rod. dos Bandeirantes, km 38 - Cajamar - SP',
    responsavelTecnico: 'Engª. Larissa Freitas',
    creaCau: 'CREA-SP 507.819.330-1',
    dataInicio: '2026-03-01',
    terminoPrevisto: '2026-12-15',
    status: 'Em andamento',
    avancoFisico: 68,
    driveFolderUrl: 'https://drive.google.com/drive/folders/1B_Demo_Alpha_Logistica_Drive',
    empresaId: 'emp-002',
    isDemo: true,
  },
  {
    id: 'obra-003',
    codigo: 'OBR-2026-003',
    nome: 'Centro Médico Especializado Vida Nova',
    cliente: 'Rede Saúde São Paulo',
    endereco: 'Rua Vergueiro, 900 - Liberdade, São Paulo - SP',
    responsavelTecnico: 'Eng. Carlos Eduardo Ribeiro',
    creaCau: 'CREA-SP 506.912.443-8',
    dataInicio: '2026-06-01',
    terminoPrevisto: '2027-11-20',
    status: 'Planejamento',
    avancoFisico: 5,
    driveFolderUrl: 'https://drive.google.com/drive/folders/1C_Demo_Centro_Medico_Drive',
    empresaId: 'emp-001',
    isDemo: true,
  },
];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-001',
    nome: 'Carlos Eduardo Ribeiro',
    funcao: 'Engenheiro Residente',
    empresa: 'Horizonte Engenharia',
    contato: '(11) 98765-4321',
    creaCau: 'CREA-SP 506.912.443-8',
    obrasIds: ['obra-001', 'obra-003'],
    isDemo: true,
  },
  {
    id: 'team-002',
    nome: 'Larissa Freitas',
    funcao: 'Engenheiro Residente',
    empresa: 'Fundape Engenharia',
    contato: '(11) 99123-4567',
    creaCau: 'CREA-SP 507.819.330-1',
    obrasIds: ['obra-002'],
    isDemo: true,
  },
  {
    id: 'team-003',
    nome: 'Antônio Marcos Silveira',
    funcao: 'Mestre de Obras',
    empresa: 'Horizonte Engenharia',
    contato: '(11) 97654-3210',
    obrasIds: ['obra-001'],
    isDemo: true,
  },
  {
    id: 'team-004',
    nome: 'Roberto Dias Santos',
    funcao: 'Encarregado',
    empresa: 'Fundape Engenharia',
    contato: '(11) 96543-2109',
    obrasIds: ['obra-002'],
    isDemo: true,
  },
  {
    id: 'team-005',
    nome: 'Mariana Lima Souza',
    funcao: 'Estagiário',
    empresa: 'Horizonte Engenharia',
    contato: '(11) 95432-1098',
    obrasIds: ['obra-001', 'obra-002'],
    isDemo: true,
  },
];

const INITIAL_RDOS: RDO[] = [
  {
    id: 'rdo-001',
    numeroSequencial: 142,
    codigoIdentificador: 'RDO #142/2026',
    data: '2026-10-07',
    obraId: 'obra-001',
    obraNome: 'Edifício Residencial Splendor Towers',
    responsavelPreenchimento: 'Eng. Carlos Eduardo Ribeiro',
    responsavelRole: 'Engenheiro Residente (CREA-SP 506.912.443-8)',
    climaManha: {
      tempo: 'Chuvoso',
      condicaoTrabalho: 'Parcialmente Praticável',
    },
    climaTarde: {
      tempo: 'Nublado',
      condicaoTrabalho: 'Praticável',
    },
    etapasFrentes: 'Estrutura - Vigas e lajes do 2º pavimento',
    atividadesExecutadas: 'Concretagem das vigas e lajes do segundo pavimento da Torre A. Montagem de armaduras complementares e posicionamento de eletrodutos embutidos. Realizada desforma lateral dos pilares do 1º pavimento.',
    avancoInformado: 80,
    maoDeObra: [
      { id: 'l1', funcao: 'Pedreiro', quantidade: 4, empresa: 'Horizonte Engenharia' },
      { id: 'l2', funcao: 'Servente', quantidade: 6, empresa: 'Horizonte Engenharia' },
      { id: 'l3', funcao: 'Carpinteiro', quantidade: 2, empresa: 'Subempreiteira Alpha' },
      { id: 'l4', funcao: 'Armador', quantidade: 2, empresa: 'Subempreiteira Alpha' },
    ],
    equipamentos: [
      { id: 'eq1', nome: 'Bomba de concreto estacionária', quantidade: 1, status: 'Operando' },
      { id: 'eq2', nome: 'Vibrador de imersão 38mm', quantidade: 2, status: 'Operando' },
      { id: 'eq3', nome: 'Guincho de coluna 500kg', quantidade: 1, status: 'Operando' },
    ],
    materiais: [
      { id: 'mat1', descricao: 'Concreto Usinado fck 30 MPa (Slump 12±2)', quantidade: '24', unidade: 'm³', tipo: 'Recebido' },
      { id: 'mat2', descricao: 'Cimento Portland CP-II F 32', quantidade: '50', unidade: 'sacos', tipo: 'Recebido' },
      { id: 'mat3', descricao: 'Aço CA-50 10.0mm', quantidade: '400', unidade: 'kg', tipo: 'Utilizado' },
    ],
    ocorrencias: 'Paralisação temporária das frentes descobertas entre 09:30 e 10:30 (aproximadamente 1 hora) devido à pancada de chuva matinal. Equipe realocada para ajustes internos de formas e amarração.',
    seguranca: 'DDS realizado às 07:00 com tema "Uso obrigatório de cinto de segurança para trabalhos em altura acima de 2m e proteção coletiva guarda-corpo". Nenhum acidente registrado no dia.',
    observacoes: 'Programado ensaio de slump-test para todos os caminhões betoneira que adentraram o canteiro (corpos de prova moldados para 7, 14 e 28 dias).',
    fotos: [
      {
        id: 'foto-1',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
        legenda: 'Concretagem das vigas e lajes do 2º pavimento com bomba estacionária',
        dataUpload: '2026-10-07 14:30',
      },
      {
        id: 'foto-2',
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        legenda: 'Conferência de armação e espaçadores plásticos pré-concretagem',
        dataUpload: '2026-10-07 10:15',
      },
    ],
    status: 'Finalizado',
    criadoEm: '2026-10-07T08:00:00.000Z',
    atualizadoEm: '2026-10-07T17:30:00.000Z',
    finalizadoEm: '2026-10-07T17:30:00.000Z',
    isDemo: true,
  },
  {
    id: 'rdo-002',
    numeroSequencial: 89,
    codigoIdentificador: 'RDO #089/2026',
    data: '2026-10-08',
    obraId: 'obra-002',
    obraNome: 'Complexo Logístico Alpha Distribution Center',
    responsavelPreenchimento: 'Engª. Larissa Freitas',
    responsavelRole: 'Engenheira Coordenadora (CREA-SP 507.819.330-1)',
    climaManha: {
      tempo: 'Ensolarado',
      condicaoTrabalho: 'Praticável',
    },
    climaTarde: {
      tempo: 'Ensolarado',
      condicaoTrabalho: 'Praticável',
    },
    etapasFrentes: 'Piso Industrial e Cobertura Metálica',
    atividadesExecutadas: 'Aplicação de endurecedor de superfície e corte de juntas de dilatação no módulo B. Montagem das terças metálicas da cobertura no módulo C.',
    avancoInformado: 75,
    maoDeObra: [
      { id: 'l10', funcao: 'Acabador de Piso', quantidade: 5, empresa: 'Fundape Engenharia' },
      { id: 'l11', funcao: 'Montador de Estrutura', quantidade: 6, empresa: 'MetalAlpha Estruturas' },
      { id: 'l12', funcao: 'Servente', quantidade: 4, empresa: 'Fundape Engenharia' },
    ],
    equipamentos: [
      { id: 'eq10', nome: 'Acabadora de piso dupla (Helicóptero)', quantidade: 2, status: 'Operando' },
      { id: 'eq11', nome: 'Plataforma elevatória tesoura 12m', quantidade: 2, status: 'Operando' },
      { id: 'eq12', nome: 'Serra cortadora de piso clipper', quantidade: 1, status: 'Operando' },
    ],
    materiais: [
      { id: 'mat10', descricao: 'Endurecedor de superfície à base de silicato', quantidade: '12', unidade: 'tambores 200L', tipo: 'Utilizado' },
      { id: 'mat11', descricao: 'Selante poliuretano para juntas PU40', quantidade: '80', unidade: 'bisnagas', tipo: 'Utilizado' },
    ],
    ocorrencias: 'Nenhuma ocorrência ou paralisação. Ritmo produtivo acima da média devido às excelentes condições meteorológicas.',
    seguranca: 'DDS às 07:15 sobre trabalho com plataformas aéreas e linha de vida. Sem acidentes.',
    observacoes: 'Liberação do módulo A para tráfego leve de empilhadeiras em 72 horas.',
    fotos: [
      {
        id: 'foto-3',
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        legenda: 'Polimento e acabamento mecanizado do piso industrial de alta resistência',
        dataUpload: '2026-10-08 15:00',
      },
    ],
    status: 'Finalizado',
    criadoEm: '2026-10-08T07:30:00.000Z',
    atualizadoEm: '2026-10-08T16:00:00.000Z',
    finalizadoEm: '2026-10-08T16:00:00.000Z',
    isDemo: true,
  },
  {
    id: 'rdo-003',
    numeroSequencial: 143,
    codigoIdentificador: 'RDO #143/2026',
    data: '2026-10-08',
    obraId: 'obra-001',
    obraNome: 'Edifício Residencial Splendor Towers',
    responsavelPreenchimento: 'Eng. Carlos Eduardo Ribeiro',
    responsavelRole: 'Engenheiro Residente (CREA-SP 506.912.443-8)',
    climaManha: {
      tempo: 'Nublado',
      condicaoTrabalho: 'Praticável',
    },
    climaTarde: {
      tempo: 'Ensolarado',
      condicaoTrabalho: 'Praticável',
    },
    etapasFrentes: 'Estrutura - Cura úmida do 2º pavimento e armação dos pilares do 3º pavimento',
    atividadesExecutadas: 'Manutenção de cura úmida por aspersão contínua nas lajes recém concretadas. Início da marcação topográfica e posicionamento de armaduras verticais dos pilares P1 a P18 do 3º pavimento.',
    avancoInformado: 45,
    maoDeObra: [
      { id: 'l20', funcao: 'Armador', quantidade: 4, empresa: 'Subempreiteira Alpha' },
      { id: 'l21', funcao: 'Pedreiro', quantidade: 3, empresa: 'Horizonte Engenharia' },
      { id: 'l22', funcao: 'Servente', quantidade: 5, empresa: 'Horizonte Engenharia' },
    ],
    equipamentos: [
      { id: 'eq20', nome: 'Guincho de coluna', quantidade: 1, status: 'Operando' },
      { id: 'eq21', nome: 'Estação total topográfica', quantidade: 1, status: 'Operando' },
    ],
    materiais: [
      { id: 'mat20', descricao: 'Aço CA-50 12.5mm', quantidade: '600', unidade: 'kg', tipo: 'Utilizado' },
      { id: 'mat21', descricao: 'Arame recozido 18', quantidade: '25', unidade: 'kg', tipo: 'Utilizado' },
    ],
    ocorrencias: 'Atraso de 40 minutos na entrega de espaçadores plásticos pela transportadora, resolvido com estoque pulmão da obra.',
    seguranca: 'Checklist matinal de ferramentas manuais e extensões elétricas. Nenhum acidente.',
    observacoes: 'Rascunho em aberto para conferência final pelo encarregado no término do turno.',
    fotos: [],
    status: 'Rascunho',
    criadoEm: '2026-10-08T08:30:00.000Z',
    atualizadoEm: '2026-10-08T11:45:00.000Z',
    isDemo: true,
  },
];

const INITIAL_DRIVE_FILES: DriveFolderItem[] = [
  {
    id: 'drv-01',
    obraId: 'obra-001',
    tipo: 'RDOs',
    nomeArquivo: 'RDO_142_Edificio_Splendor_2026-10-07.pdf',
    tamanho: '1.8 MB',
    dataModificacao: '2026-10-07 17:35',
    url: '#',
  },
  {
    id: 'drv-02',
    obraId: 'obra-001',
    tipo: 'Fotos',
    nomeArquivo: 'IMG_Concretagem_Laje_02_Pav.jpg',
    tamanho: '3.4 MB',
    dataModificacao: '2026-10-07 14:32',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'drv-03',
    obraId: 'obra-001',
    tipo: 'Documentos',
    nomeArquivo: 'ART_Execucao_Estrutural_Carlos_Ribeiro.pdf',
    tamanho: '450 KB',
    dataModificacao: '2026-01-20 10:00',
    url: '#',
  },
  {
    id: 'drv-04',
    obraId: 'obra-002',
    tipo: 'RDOs',
    nomeArquivo: 'RDO_089_Alpha_Logistica_2026-10-08.pdf',
    tamanho: '1.4 MB',
    dataModificacao: '2026-10-08 16:05',
    url: '#',
  },
  {
    id: 'drv-05',
    obraId: 'obra-002',
    tipo: 'Fotos',
    nomeArquivo: 'IMG_Piso_Industrial_Acabamento.jpg',
    tamanho: '2.9 MB',
    dataModificacao: '2026-10-08 15:02',
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
  },
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Eng. Carlos Eduardo Ribeiro',
    email: 'carlos.ribeiro@rdo.engenharia.com',
    role: 'Editor',
    crea: 'CREA-SP 506.912.443-8',
    avatar: 'CR',
  },
  {
    id: 'usr-2',
    name: 'Engª. Larissa Freitas',
    email: 'larissa.freitas@rdo.engenharia.com',
    role: 'Editor',
    crea: 'CREA-SP 507.819.330-1',
    avatar: 'LF',
  },
  {
    id: 'usr-3',
    name: 'Fiscal Fernando Antunes',
    email: 'fiscal.antunes@auditoria.com',
    role: 'Visualizador',
    crea: 'CREA-SP 501.320.119-0',
    avatar: 'FA',
  },
];

export const storageService = {
  // Companies
  getCompanies(): Company[] {
    const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
      return INITIAL_COMPANIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_COMPANIES;
    }
  },

  saveCompany(company: Company): Company[] {
    const list = this.getCompanies();
    const index = list.findIndex((c) => c.id === company.id);
    if (index >= 0) {
      list[index] = company;
    } else {
      list.push(company);
    }
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(list));
    return list;
  },

  deleteCompany(id: string): Company[] {
    const list = this.getCompanies().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(list));
    return list;
  },

  // Obras
  getObras(): Obra[] {
    const data = localStorage.getItem(STORAGE_KEYS.OBRAS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.OBRAS, JSON.stringify(INITIAL_OBRAS));
      return INITIAL_OBRAS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_OBRAS;
    }
  },

  saveObra(obra: Obra): Obra[] {
    const list = this.getObras();
    const index = list.findIndex((o) => o.id === obra.id);
    if (index >= 0) {
      list[index] = obra;
    } else {
      list.unshift(obra);
    }
    localStorage.setItem(STORAGE_KEYS.OBRAS, JSON.stringify(list));
    return list;
  },

  deleteObra(id: string): Obra[] {
    const list = this.getObras().filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.OBRAS, JSON.stringify(list));
    return list;
  },

  // Team
  getTeam(): TeamMember[] {
    const data = localStorage.getItem(STORAGE_KEYS.TEAM);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
      return INITIAL_TEAM;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TEAM;
    }
  },

  saveTeamMember(member: TeamMember): TeamMember[] {
    const list = this.getTeam();
    const index = list.findIndex((m) => m.id === member.id);
    if (index >= 0) {
      list[index] = member;
    } else {
      list.unshift(member);
    }
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(list));
    return list;
  },

  deleteTeamMember(id: string): TeamMember[] {
    const list = this.getTeam().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(list));
    return list;
  },

  // RDOs
  getRDOs(): RDO[] {
    const data = localStorage.getItem(STORAGE_KEYS.RDOS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.RDOS, JSON.stringify(INITIAL_RDOS));
      return INITIAL_RDOS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_RDOS;
    }
  },

  saveRDO(rdo: RDO): RDO[] {
    const list = this.getRDOs();
    const index = list.findIndex((r) => r.id === rdo.id);
    if (index >= 0) {
      list[index] = { ...rdo, atualizadoEm: new Date().toISOString() };
    } else {
      list.unshift({ ...rdo, criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.RDOS, JSON.stringify(list));

    // Also auto-generate Drive reference file when finalized
    if (rdo.status === 'Finalizado') {
      this.syncRDOToDrive(rdo);
    }

    return list;
  },

  deleteRDO(id: string): RDO[] {
    const list = this.getRDOs().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RDOS, JSON.stringify(list));
    return list;
  },

  getNextRDONumber(obraId: string): number {
    const rdos = this.getRDOs().filter((r) => r.obraId === obraId);
    if (rdos.length === 0) return 1;
    const maxNum = Math.max(...rdos.map((r) => r.numeroSequencial || 0));
    return maxNum + 1;
  },

  // Google Drive Files
  getDriveFiles(obraId?: string): DriveFolderItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.DRIVE_FILES);
    let files: DriveFolderItem[] = INITIAL_DRIVE_FILES;
    if (data) {
      try {
        files = JSON.parse(data);
      } catch {
        files = INITIAL_DRIVE_FILES;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.DRIVE_FILES, JSON.stringify(INITIAL_DRIVE_FILES));
    }

    if (obraId) {
      return files.filter((f) => f.obraId === obraId);
    }
    return files;
  },

  syncRDOToDrive(rdo: RDO) {
    const files = this.getDriveFiles();
    const fileName = `RDO_${rdo.numeroSequencial}_${rdo.data}.pdf`;
    const exists = files.find((f) => f.obraId === rdo.obraId && f.nomeArquivo === fileName);
    if (!exists) {
      const newFile: DriveFolderItem = {
        id: 'drv-' + Date.now(),
        obraId: rdo.obraId,
        tipo: 'RDOs',
        nomeArquivo: fileName,
        tamanho: '1.5 MB',
        dataModificacao: new Date().toLocaleString('pt-BR'),
        url: '#',
      };
      files.unshift(newFile);
      localStorage.setItem(STORAGE_KEYS.DRIVE_FILES, JSON.stringify(files));
    }
  },

  addDriveFile(file: DriveFolderItem): DriveFolderItem[] {
    const files = this.getDriveFiles();
    files.unshift(file);
    localStorage.setItem(STORAGE_KEYS.DRIVE_FILES, JSON.stringify(files));
    return files;
  },

  // Users
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUser(user: User): User[] {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
    return list;
  },

  // Reset to Demo
  resetAllDemoData() {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
    localStorage.setItem(STORAGE_KEYS.OBRAS, JSON.stringify(INITIAL_OBRAS));
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
    localStorage.setItem(STORAGE_KEYS.RDOS, JSON.stringify(INITIAL_RDOS));
    localStorage.setItem(STORAGE_KEYS.DRIVE_FILES, JSON.stringify(INITIAL_DRIVE_FILES));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  },
};
