import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HardHat, ShieldCheck, Sparkles, Building2, FileText, CheckCircle2, AlertCircle, ArrowRight, Lock, KeyRound } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, loginAsDemoUser, resetPassword, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email) {
      setErrorMessage('Por favor, digite seu e-mail corporativo.');
      return;
    }
    if (!password) {
      setErrorMessage('Por favor, digite sua senha de acesso.');
      return;
    }

    const res = await loginWithEmail(email, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  };

  const handleGoogleSubmit = async () => {
    setErrorMessage('');
    const res = await loginWithGoogle();
    if (!res.success) {
      setErrorMessage(res.error || 'Falha ao autenticar com a conta Google.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotFeedback({ type: 'error', text: 'Informe seu e-mail para receber as instruções.' });
      return;
    }
    const res = await resetPassword(forgotEmail);
    setForgotFeedback({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-300">Oficina Prática: IA na Engenharia Civil</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline">Engenharia de Prompts e Criação de Apps</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>MÉTODO LARISSA</span>
            <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
              ACESSO SEGURO
            </span>
          </div>
        </div>
      </div>

      {/* Main Hero & Auth Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 justify-center">
        {/* Left Column: Brand & Engineering Value Proposition */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Engenharia Civil + Inteligência Artificial
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950">
              <HardHat className="w-7 h-7" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans">
              RDO <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Inteligente</span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl font-medium text-slate-200 mb-4 tracking-tight">
            Gestão inteligente do dia a dia da sua obra
          </p>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
            Transforme relatos de campo por voz ou texto em Relatórios Diários de Obra padronizados, 
            estruturados com IA Gemini, prontos para emissão em PDF e arquivamento seguro no Google Drive.
          </p>

          {/* Core Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left mb-8">
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-md bg-blue-500/10 text-blue-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Preenchimento por Voz</h4>
                <p className="text-xs text-slate-400">Grave áudio direto no canteiro. A IA estrutura mão de obra, maquinário e clima.</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Revisão Humana Rigorosa</h4>
                <p className="text-xs text-slate-400">A IA nunca inventa dados. Itens ambíguos sinalizam confirmação antes de salvar.</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-md bg-amber-500/10 text-amber-400 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">PDF Técnico & Assinaturas</h4>
                <p className="text-xs text-slate-400">Emissão de relatórios fotográficos com padrão CREA/CAU e campos de aprovação.</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-md bg-purple-500/10 text-purple-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Perfis Editor & Visualizador</h4>
                <p className="text-xs text-slate-400">Segregação estrita por empresa, obra e permissão de acesso.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Form Card */}
        <div className="w-full max-w-md">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-white mb-1">Acesso ao Sistema</h2>
              <p className="text-xs text-slate-400">
                Entre com suas credenciais autorizadas ou teste com os perfis de demonstração
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="email-input">
                  E-mail Profissional
                </label>
                <div className="relative">
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engenheiro@obra.com.br"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300" htmlFor="password-input">
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotFeedback(null);
                      setForgotEmail(email);
                      setForgotModalOpen(true);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-semibold py-2.5 px-4 rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-3 text-slate-500 font-mono">ou acesse com</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleSubmit}
              disabled={isLoading}
              className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-3 cursor-pointer mb-5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Entrar com Google</span>
            </button>

            {/* Quick Demonstration Access - Requirement: Identificar como DADOS DE DEMONSTRAÇÃO */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400">
                  Acesso de Avaliação Rápida
                </span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono">
                  DADOS DE DEMONSTRAÇÃO
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => loginAsDemoUser('Editor')}
                  className="p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[11px] text-amber-400 font-bold group-hover:text-amber-300">
                    Engenheiro (Editor)
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Criar, editar e finalizar</div>
                </button>

                <button
                  type="button"
                  onClick={() => loginAsDemoUser('Visualizador')}
                  className="p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[11px] text-blue-400 font-bold group-hover:text-blue-300">
                    Fiscal (Visualizador)
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Somente consulta e PDFs</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Recuperação de Senha</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Informe o e-mail cadastrado da sua empresa. Um link de redefinição de credencial será enviado.
            </p>

            {forgotFeedback && (
              <div
                className={`p-3 rounded-lg text-xs mb-4 ${
                  forgotFeedback.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                    : 'bg-red-950/60 border border-red-800 text-red-200'
                }`}
              >
                {forgotFeedback.text}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="seu.email@empresa.com.br"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
                >
                  Enviar Instruções
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Institutional Footer inspired by CONFEA / CREA / MÚTUA from Workshop Slide */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-6">
            <span className="font-bold tracking-wider text-slate-400 uppercase text-[11px]">
              CONFEA <span className="text-slate-600">|</span> CREA-SP <span className="text-slate-600">|</span> MÚTUA
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400">Oficina Prática de Engenharia de Prompts</span>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-500">
            © 2026 RDO Inteligente • Sistema em conformidade com as Boas Práticas de Engenharia
          </div>
        </div>
      </footer>
    </div>
  );
};
