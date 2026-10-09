import React, { useState, useRef, useEffect } from 'react';
import { aiService, SAMPLE_AUDIO_TRANSCRIPT } from '../services/aiService';
import { AIStructureResult, Obra } from '../types';
import {
  Mic,
  Square,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  X,
  Volume2,
  FileCheck,
  Calendar,
  Layers,
  Users,
  Wrench,
  Package,
  AlertOctagon,
  ShieldAlert,
} from 'lucide-react';

export type AIModalStep = 'gravando' | 'processando com IA' | 'rascunho gerado' | 'revisar' | 'confirmar';

interface VoiceAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  obras: Obra[];
  selectedObraId: string;
  onApplyDraftToRDO: (structuredData: AIStructureResult, obraId: string) => void;
}

export const VoiceAIModal: React.FC<VoiceAIModalProps> = ({
  isOpen,
  onClose,
  obras,
  selectedObraId,
  onApplyDraftToRDO,
}) => {
  const [currentStep, setCurrentStep] = useState<AIModalStep>('gravando');
  const [targetObraId, setTargetObraId] = useState<string>(
    selectedObraId !== 'all' ? selectedObraId : obras[0]?.id || ''
  );
  const [inputText, setInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [result, setResult] = useState<AIStructureResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Editable review states
  const [reviewAtividades, setReviewAtividades] = useState<string>('');
  const [reviewClima, setReviewClima] = useState<string>('');
  const [reviewAvanco, setReviewAvanco] = useState<string>('');
  const [reviewOcorrencias, setReviewOcorrencias] = useState<string>('');
  const [reviewSeguranca, setReviewSeguranca] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (selectedObraId !== 'all') {
      setTargetObraId(selectedObraId);
    } else if (obras.length > 0 && !targetObraId) {
      setTargetObraId(obras[0].id);
    }
  }, [selectedObraId, obras]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // 1. Microphone Start
  const startRecording = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microfone indisponível ou permissão negada:', err);
      setErrorMsg(
        'Acesso ao microfone não concedido ou indisponível. Você pode digitar ou usar o relato exemplo.'
      );
    }
  };

  // 2. Microphone Stop
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // 3. Process AI
  const handleProcessAI = async () => {
    setErrorMsg('');
    setCurrentStep('processando com IA');

    try {
      let structured: AIStructureResult;

      if (audioBlob) {
        structured = await aiService.structureReportFromAudio(audioBlob);
      } else if (inputText.trim()) {
        structured = await aiService.structureReportFromText(inputText.trim());
      } else {
        throw new Error('Nenhum áudio ou texto foi fornecido para estruturação.');
      }

      setResult(structured);
      setReviewAtividades(structured.atividadesExecutadas || '');
      setReviewClima(structured.climaManha || '');
      setReviewAvanco(structured.avancoPercentual ? String(structured.avancoPercentual) : '');
      setReviewOcorrencias(structured.ocorrencias || '');
      setReviewSeguranca(structured.seguranca || 'Nenhum acidente informado');

      setCurrentStep('rascunho gerado');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao processar relato com IA.');
      setCurrentStep('gravando');
    }
  };

  // 4. Fill with Demo Audio Transcript Example
  const handleLoadDemoExample = () => {
    setInputText(SAMPLE_AUDIO_TRANSCRIPT);
    setAudioBlob(null);
  };

  // 5. Final Confirmation
  const handleConfirmAndApply = () => {
    if (!result) return;

    const finalDraft: AIStructureResult = {
      ...result,
      atividadesExecutadas: reviewAtividades,
      climaManha: reviewClima,
      avancoPercentual: reviewAvanco ? parseFloat(reviewAvanco) : null,
      ocorrencias: reviewOcorrencias,
      seguranca: reviewSeguranca,
    };

    onApplyDraftToRDO(finalDraft, targetObraId);
    onClose();
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header with Title & Flow Stepper */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Gravar RDO com IA
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                  Gemini 3.8 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Transforme relatos falados no canteiro em campos estruturados com revisão obrigatória
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Progress Indicator (as required by PDF prompt) */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            {[
              { id: 'gravando', label: '1. Gravando' },
              { id: 'processando com IA', label: '2. Processando IA' },
              { id: 'rascunho gerado', label: '3. Rascunho Gerado' },
              { id: 'revisar', label: '4. Revisar' },
              { id: 'confirmar', label: '5. Confirmar' },
            ].map((step, idx) => {
              const stepsOrder: AIModalStep[] = [
                'gravando',
                'processando com IA',
                'rascunho gerado',
                'revisar',
                'confirmar',
              ];
              const currentIndex = stepsOrder.indexOf(currentStep);
              const stepIndex = stepsOrder.indexOf(step.id as AIModalStep);
              const isActive = currentStep === step.id;
              const isPast = stepIndex < currentIndex;

              return (
                <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40 ring-2 ring-amber-400/50'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`hidden md:inline text-[11px] font-medium ${
                      isActive ? 'text-amber-400 font-bold' : isPast ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg text-xs text-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Target Obra Selector */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs text-slate-300 font-medium">Obra para este Relatório:</span>
            <select
              value={targetObraId}
              onChange={(e) => setTargetObraId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:border-amber-500"
            >
              {obras.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.codigo} - {o.nome}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 1: GRAVANDO / ENTRADA */}
          {currentStep === 'gravando' && (
            <div className="space-y-4">
              {/* Voice Recording Control */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-6 text-center flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 animate-pulse cursor-pointer"
                    >
                      <Square className="w-8 h-8 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Mic className="w-9 h-9" />
                    </button>
                  )}
                </div>

                <div className="text-sm font-semibold text-white mb-1">
                  {isRecording ? (
                    <span className="text-red-400 flex items-center gap-2 justify-center">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      Gravando relato de campo... [{formatTimer(recordDuration)}]
                    </span>
                  ) : audioBlob ? (
                    <span className="text-emerald-400 flex items-center gap-1.5 justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                      Áudio gravado com sucesso ({formatTimer(recordDuration)})
                    </span>
                  ) : (
                    'Toque para iniciar a gravação do relato por voz'
                  )}
                </div>

                <p className="text-xs text-slate-400 max-w-md">
                  {isRecording
                    ? 'Fale com clareza sobre as atividades, clima, equipe, maquinários, materiais recebidos e segurança.'
                    : 'Fale diretamente pelo celular no canteiro. A IA irá transcrever e estruturar os dados.'}
                </p>
              </div>

              {/* Text Fallback & Example Trigger */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    Ou digite/cole o relato de campo:
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadDemoExample}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    Carregar Exemplo Real do PDF
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (audioBlob) setAudioBlob(null);
                  }}
                  placeholder="Exemplo: Hoje trabalhamos na concretagem das vigas do segundo pavimento. Foram 12 funcionários, sendo 4 pedreiros, 6 serventes e 2 carpinteiros..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500">
                    * A IA é proibida de inventar informações ausentes.
                  </span>
                  <button
                    type="button"
                    onClick={handleProcessAI}
                    disabled={!audioBlob && !inputText.trim()}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Estruturar com IA</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROCESSANDO COM IA */}
          {currentStep === 'processando com IA' && (
            <div className="py-16 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Analisando Relato de Engenharia...</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                O modelo Gemini está transcrevendo, segregando mão de obra, maquinário, condições de tempo e
                validando incertezas sem inventar dados.
              </p>
            </div>
          )}

          {/* STEP 3 & 4: RASCUNHO GERADO & REVISAR */}
          {(currentStep === 'rascunho gerado' || currentStep === 'revisar') && result && (
            <div className="space-y-4 animate-in fade-in">
              {/* Warnings / Rules Reminder */}
              <div className="bg-amber-950/40 border border-amber-800/60 rounded-lg p-3 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Revisão Humana Obrigatória:</span>
                  Verifique e edite os dados extraídos abaixo antes de incorporar definitivamente ao RDO.
                </div>
              </div>

              {/* Uncertain Items Alert if any */}
              {result.itensIncertos && result.itensIncertos.length > 0 && (
                <div className="bg-red-950/50 border border-red-800 rounded-lg p-3 text-xs text-red-200">
                  <div className="font-bold flex items-center gap-1.5 text-red-400 mb-1">
                    <AlertOctagon className="w-4 h-4" />
                    Itens que requerem confirmação expressa do engenheiro:
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {result.itensIncertos.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.campo}:</strong> {item.detalhe} (
                        <span className="text-amber-400 font-semibold">{item.status}</span>)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Transcription Original */}
              {result.transcricaoIntegral && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs">
                  <span className="text-slate-400 font-semibold block mb-1">Transcrição do Relato:</span>
                  <p className="text-slate-300 italic">"{result.transcricaoIntegral}"</p>
                </div>
              )}

              {/* Review Forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" /> Clima Identificado:
                  </label>
                  <input
                    type="text"
                    value={reviewClima}
                    onChange={(e) => setReviewClima(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-amber-400" /> Avanço Físico Estimado (%):
                  </label>
                  <input
                    type="number"
                    value={reviewAvanco}
                    onChange={(e) => setReviewAvanco(e.target.value)}
                    placeholder="Ex: 80"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-amber-400" /> Atividades Executadas (Revisão):
                </label>
                <textarea
                  rows={3}
                  value={reviewAtividades}
                  onChange={(e) => setReviewAtividades(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              {/* Extracted Labor Summary */}
              {result.maoDeObra && result.maoDeObra.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-2">
                    <Users className="w-3.5 h-3.5 text-amber-400" /> Mão de Obra Identificada ({result.maoDeObra.length} funções):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {result.maoDeObra.map((lab, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-2 rounded text-xs flex justify-between">
                        <span className="text-slate-200">{lab.funcao}</span>
                        <span className="font-bold text-amber-400">{lab.quantidade} un.</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials and Equipment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.materiais && result.materiais.length > 0 && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                    <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-400" /> Materiais Identificados:
                    </span>
                    <ul className="text-xs space-y-1 text-slate-300">
                      {result.materiais.map((mat, i) => (
                        <li key={i} className="flex justify-between border-b border-slate-800/60 pb-0.5">
                          <span>{mat.descricao}</span>
                          <span className="font-semibold text-emerald-400">
                            {mat.quantidade} {mat.unidade || ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.equipamentos && result.equipamentos.length > 0 && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                    <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" /> Maquinários:
                    </span>
                    <ul className="text-xs space-y-1 text-slate-300">
                      {result.equipamentos.map((eq, i) => (
                        <li key={i} className="flex justify-between border-b border-slate-800/60 pb-0.5">
                          <span>{eq.nome}</span>
                          <span className="font-semibold text-amber-400">{eq.quantidade} un.</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Occurrences & Safety */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" /> Ocorrências & Imprevistos:
                  </label>
                  <textarea
                    rows={2}
                    value={reviewOcorrencias}
                    onChange={(e) => setReviewOcorrencias(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-emerald-400" /> Segurança do Trabalho:
                  </label>
                  <textarea
                    rows={2}
                    value={reviewSeguranca}
                    onChange={(e) => setReviewSeguranca(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMAR PREVIEW */}
          {currentStep === 'confirmar' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Revisão Concluída!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                As informações estruturadas e revisadas por você serão inseridas no formulário do RDO da obra selecionada.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          {currentStep !== 'gravando' ? (
            <button
              type="button"
              onClick={() => {
                setCurrentStep('gravando');
                setResult(null);
              }}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Gravar Novamente</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>

            {currentStep === 'rascunho gerado' && (
              <button
                type="button"
                onClick={() => setCurrentStep('revisar')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-lg text-xs cursor-pointer"
              >
                Prosseguir para Revisão
              </button>
            )}

            {currentStep === 'revisar' && (
              <button
                type="button"
                onClick={() => setCurrentStep('confirmar')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Dados Revisados</span>
              </button>
            )}

            {currentStep === 'confirmar' && (
              <button
                type="button"
                onClick={handleConfirmAndApply}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Incorporar ao RDO</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
