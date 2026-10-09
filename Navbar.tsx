import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Obra } from '../types';
import {
  HardHat,
  LayoutDashboard,
  Building2,
  FileText,
  Briefcase,
  Users2,
  FolderGit2,
  UserCheck,
  Settings,
  LogOut,
  Mic,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'obras'
  | 'rdos'
  | 'empresas'
  | 'equipe'
  | 'documentos'
  | 'usuarios'
  | 'configuracoes';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  obras: Obra[];
  selectedObraId: string;
  onSelectObra: (id: string) => void;
  onOpenVoiceAI: () => void;
  onOpenNewRDO: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  obras,
  selectedObraId,
  onSelectObra,
  onOpenVoiceAI,
  onOpenNewRDO,
}) => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'obras' as ActiveTab, label: 'Obras', icon: Building2 },
    { id: 'rdos' as ActiveTab, label: 'RDOs', icon: FileText },
    { id: 'empresas' as ActiveTab, label: 'Empresas', icon: Briefcase },
    { id: 'equipe' as ActiveTab, label: 'Equipe', icon: Users2 },
    { id: 'documentos' as ActiveTab, label: 'Documentos', icon: FolderGit2 },
    { id: 'usuarios' as ActiveTab, label: 'Usuários', icon: UserCheck },
    { id: 'configuracoes' as ActiveTab, label: 'Configurações', icon: Settings },
  ];

  const isEditor = currentUser?.role === 'Editor';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-md">
      {/* Top Engineering Strip */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <HardHat className="w-3.5 h-3.5" />
            <span className="tracking-tight">RDO INTELIGENTE</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <label htmlFor="obra-select-header" className="text-slate-400 text-[11px]">
              Obra Ativa:
            </label>
            <select
              id="obra-select-header"
              value={selectedObraId}
              onChange={(e) => onSelectObra(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-0.5 focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="all">Todas as Obras (Visão Geral)</option>
              {obras.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.codigo} - {o.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* User Info & Role Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isEditor
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              }`}
            >
              Perfil: {currentUser?.role}
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 text-slate-200 hover:text-white text-xs cursor-pointer focus:outline-none py-1"
            >
              <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-[10px] text-amber-400">
                {currentUser?.avatar || 'U'}
              </div>
              <span className="hidden md:inline font-medium">{currentUser?.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 text-xs"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-700 text-slate-300">
                  <div className="font-semibold text-white truncate">{currentUser?.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
                  {currentUser?.crea && (
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5">{currentUser.crea}</div>
                  )}
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setActiveTab('configuracoes');
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-slate-700/70 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Configurações do Perfil</span>
                  </button>
                </div>

                <div className="border-t border-slate-700 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-1.5 text-red-400 hover:bg-red-950/40 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={logout}
            title="Encerrar sessão"
            className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Brand Link */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight leading-none block">
                RDO <span className="text-amber-400">Inteligente</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase block">
                Controle de Canteiro
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Voice AI & New RDO */}
        <div className="flex items-center gap-2">
          {/* AI Voice Assistant Button with highlighted gradient */}
          <button
            type="button"
            onClick={onOpenVoiceAI}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gravar com IA</span>
          </button>

          {isEditor && (
            <button
              type="button"
              onClick={onOpenNewRDO}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Novo RDO</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <div className="mb-3 pt-1 pb-2 border-b border-slate-800">
            <label htmlFor="obra-select-mobile" className="block text-slate-400 text-xs mb-1">
              Selecionar Obra Ativa:
            </label>
            <select
              id="obra-select-mobile"
              value={selectedObraId}
              onChange={(e) => {
                onSelectObra(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2"
            >
              <option value="all">Todas as Obras (Visão Geral)</option>
              {obras.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.codigo} - {o.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs text-left cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
