import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Helper to get GoogleGenAI instance safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI structuring prompt for civil engineering daily reports
const RDO_STRUCTURING_SYSTEM_PROMPT = `Você é um Engenheiro Civil e Especialista em Relatórios Diários de Obra (RDO) do sistema "RDO Inteligente".
Sua tarefa é extrair e estruturar com precisão cirúrgica as informações fornecidas no relato falado ou digitado por engenheiros, mestres ou fiscais de obra.

REGRAS CRÍTICAS E OBRIGATÓRIAS:
1. NUNCA invente informações ausentes. Se uma informação não foi dita no relato, deixe o campo vazio ou nulo.
2. Quando alguma informação estiver incerta ou ambígua, adicione-a à lista "itensIncertos" com a indicação explicita "Requer confirmação".
3. Identifique rigorosamente:
   - Condições climáticas (ex: Manhã e Tarde)
   - Etapas e frentes de serviço
   - Atividades detalhadas executadas
   - Avanço físico (%) informado explicitamente
   - Mão de obra (cargo/função e quantidade numérica)
   - Equipamentos e maquinários mencionados
   - Materiais recebidos ou utilizados (quantidade e unidade)
   - Ocorrências, imprevistos ou paralisações com tempo de duração
   - Segurança do trabalho (DDS, acidentes ou ausência de acidentes)
   - Observações gerais relevantes
4. Responda ESTRITAMENTE em formato JSON compatível com o schema solicitado.`;

// API route to structure spoken/written report using Gemini
app.post('/api/ai/structure-report', async (req, res) => {
  try {
    const { text, audioBase64, mimeType } = req.body;

    if (!text && !audioBase64) {
      return res.status(400).json({ error: 'Relato em texto ou áudio não fornecido.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback parser if GEMINI_API_KEY is not yet attached
      const fallbackResult = parseTextRuleBased(text || '');
      return res.json({
        ...fallbackResult,
        warning: 'Processado com mecanismo local. Adicione sua chave Gemini para processamento avançado por IA.',
      });
    }

    let promptContents: any;

    if (audioBase64) {
      promptContents = {
        parts: [
          {
            inlineData: {
              data: audioBase64.replace(/^data:[^;]+;base64,/, ''),
              mimeType: mimeType || 'audio/webm',
            },
          },
          {
            text: 'Transcreva este áudio do canteiro de obras e estruture todas as informações de acordo com as regras de RDO.',
          },
        ],
      };
    } else {
      promptContents = `Relato de campo do usuário:
"${text}"

Analise o relato e estruture estritamente as informações presentes no JSON conforme as regras.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptContents,
      config: {
        systemInstruction: RDO_STRUCTURING_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcricaoIntegral: {
              type: Type.STRING,
              description: 'Texto transcrito do relato original na íntegra.',
            },
            climaManha: {
              type: Type.STRING,
              description: 'Condição do tempo pela manhã (Ex: Chuvoso, Ensolarado, Nublado, Impraticável) ou vazio.',
            },
            climaTarde: {
              type: Type.STRING,
              description: 'Condição do tempo pela tarde ou vazio.',
            },
            etapasFrentes: {
              type: Type.STRING,
              description: 'Etapa ou frente de serviço identificada (ex: Estrutura - Vigas do 2º pavimento).',
            },
            atividadesExecutadas: {
              type: Type.STRING,
              description: 'Descrição clara e técnica das atividades realizadas.',
            },
            avancoPercentual: {
              type: Type.NUMBER,
              description: 'Número de porcentagem do avanço informado (ex: 80 para 80%), ou null se não citado.',
            },
            maoDeObra: {
              type: Type.ARRAY,
              description: 'Lista de funções e quantidades de trabalhadores identificados.',
              items: {
                type: Type.OBJECT,
                properties: {
                  funcao: { type: Type.STRING },
                  quantidade: { type: Type.INTEGER },
                  empresa: { type: Type.STRING, description: 'Nome da empresa ou "Própria"' },
                },
                required: ['funcao', 'quantidade'],
              },
            },
            equipamentos: {
              type: Type.ARRAY,
              description: 'Equipamentos ou maquinários citados.',
              items: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  quantidade: { type: Type.INTEGER },
                  status: { type: Type.STRING, description: 'Ex: Operando, Parado, Manutenção' },
                },
                required: ['nome', 'quantidade'],
              },
            },
            materiais: {
              type: Type.ARRAY,
              description: 'Materiais recebidos ou utilizados.',
              items: {
                type: Type.OBJECT,
                properties: {
                  descricao: { type: Type.STRING },
                  quantidade: { type: Type.STRING },
                  unidade: { type: Type.STRING },
                  tipo: { type: Type.STRING, description: 'Recebido ou Utilizado' },
                },
                required: ['descricao', 'quantidade'],
              },
            },
            ocorrencias: {
              type: Type.STRING,
              description: 'Ocorrências, atrasos, chuvas, paralisações citadas com detalhes ou vazio.',
            },
            seguranca: {
              type: Type.STRING,
              description: 'Informações sobre segurança (ex: "Nenhum acidente informado", DDS, EPIs).',
            },
            observacoes: {
              type: Type.STRING,
              description: 'Observações complementares.',
            },
            itensIncertos: {
              type: Type.ARRAY,
              description: 'Lista de dados que precisam de confirmação humana.',
              items: {
                type: Type.OBJECT,
                properties: {
                  campo: { type: Type.STRING },
                  detalhe: { type: Type.STRING },
                  status: { type: Type.STRING, description: 'Sempre "Requer confirmação"' },
                },
                required: ['campo', 'detalhe', 'status'],
              },
            },
          },
          required: ['atividadesExecutadas'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Erro na chamada Gemini:', error);
    // Return fallback with rule parsing so user is never blocked
    const fallback = parseTextRuleBased(req.body.text || '');
    return res.json({
      ...fallback,
      warning: 'IA temporariamente indisponível. Estruturação preliminar gerada pelo sistema de regras de engenharia.',
      errorDetails: error.message,
    });
  }
});

// Rule-based fallback if offline or API key is absent
function parseTextRuleBased(text: string) {
  const result: any = {
    transcricaoIntegral: text,
    climaManha: '',
    climaTarde: '',
    etapasFrentes: '',
    atividadesExecutadas: text,
    avancoPercentual: null,
    maoDeObra: [],
    equipamentos: [],
    materiais: [],
    ocorrencias: '',
    seguranca: 'Nenhum acidente informado',
    observacoes: '',
    itensIncertos: [],
  };

  const lower = text.toLowerCase();

  // Climate
  if (lower.includes('chuva') || lower.includes('chuvoso')) {
    result.climaManha = 'Chuvoso pela manhã';
  } else if (lower.includes('sol') || lower.includes('ensolarado')) {
    result.climaManha = 'Ensolarado';
  }

  // Work percentage
  const matchPct = text.match(/(\d+)%/);
  if (matchPct) {
    result.avancoPercentual = parseInt(matchPct[1], 10);
  }

  // Workforce extraction
  const laborMatches = [
    { regex: /(\d+)\s*(?:de\s*)?pedreiros?/i, funcao: 'Pedreiro' },
    { regex: /(\d+)\s*(?:de\s*)?serventes?/i, funcao: 'Servente' },
    { regex: /(\d+)\s*(?:de\s*)?carpinteiros?/i, funcao: 'Carpinteiro' },
    { regex: /(\d+)\s*(?:de\s*)?armadores?/i, funcao: 'Armador' },
    { regex: /(\d+)\s*(?:de\s*)?eletricistas?/i, funcao: 'Eletricista' },
    { regex: /(\d+)\s*(?:de\s*)?encanadores?/i, funcao: 'Encanador' },
    { regex: /(\d+)\s*(?:de\s*)?pintores?/i, funcao: 'Pintor' },
  ];

  laborMatches.forEach((item) => {
    const match = text.match(item.regex);
    if (match) {
      result.maoDeObra.push({
        funcao: item.funcao,
        quantidade: parseInt(match[1], 10),
        empresa: 'Própria',
      });
    }
  });

  // Materials
  const cementMatch = text.match(/(\d+)\s*(?:sacos?\s*(?:de\s*)?cimento)/i);
  if (cementMatch) {
    result.materiais.push({
      descricao: 'Cimento CP-II',
      quantidade: cementMatch[1],
      unidade: 'sacos',
      tipo: 'Recebido',
    });
  }

  // Occurrences
  if (lower.includes('parado') || lower.includes('paralisa')) {
    result.ocorrencias = 'Paralisação temporária dos serviços devido às condições climáticas.';
  }

  if (lower.includes('não houve acidente') || lower.includes('sem acidentes')) {
    result.seguranca = 'Nenhum acidente registrado no dia.';
  }

  return result;
}

// Health route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RDO Inteligente server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
