import { AIStructureResult } from '../types';

export const SAMPLE_AUDIO_TRANSCRIPT = `Hoje trabalhamos na concretagem das vigas do segundo pavimento. Foram 12 funcionários, sendo 4 pedreiros, 6 serventes e 2 carpinteiros. A concretagem chegou a aproximadamente 80%. Pela manhã tivemos chuva e o serviço ficou parado por cerca de uma hora. Recebemos 50 sacos de cimento. Não houve acidente.`;

export const aiService = {
  async structureReportFromText(text: string): Promise<AIStructureResult> {
    const response = await fetch('/api/ai/structure-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Falha no servidor: ${response.statusText}`);
    }

    return await response.json();
  },

  async structureReportFromAudio(audioBlob: Blob, mimeType: string = 'audio/webm'): Promise<AIStructureResult> {
    const base64 = await blobToBase64(audioBlob);

    const response = await fetch('/api/ai/structure-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioBase64: base64,
        mimeType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Falha no processamento de áudio: ${response.statusText}`);
    }

    return await response.json();
  },
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
