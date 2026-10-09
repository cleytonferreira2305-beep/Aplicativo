import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginAsDemoUser: (role: UserRole) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'rdo_auth_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check auth state on load before rendering internal content
  useEffect(() => {
    try {
      const savedSession = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        const parsed: User = JSON.parse(savedSession);
        // Clean session verification
        if (parsed && parsed.id && parsed.email) {
          setCurrentUser(parsed);
        }
      }
    } catch (e) {
      console.warn('Erro ao restaurar sessão de autenticação', e);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulate authentication verification
    await new Promise((r) => setTimeout(r, 600));

    if (!email || !email.includes('@')) {
      setIsLoading(false);
      return { success: false, error: 'Por favor, insira um endereço de e-mail válido.' };
    }

    if (!pass || pass.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'A senha deve conter no mínimo 6 caracteres.' };
    }

    // Role assignment based on email prefix or default to Editor
    const isViewer = email.toLowerCase().includes('fiscal') || email.toLowerCase().includes('visualizador');
    const role: UserRole = isViewer ? 'Visualizador' : 'Editor';

    const user: User = {
      id: 'usr-' + btoa(email).substring(0, 8),
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      role,
      crea: role === 'Editor' ? 'CREA-SP 506.912.443-8' : 'CREA-SP 501.320.119-0',
      avatar: email.substring(0, 2).toUpperCase(),
    };

    setCurrentUser(user);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setIsLoading(false);
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const googleUser: User = {
      id: 'usr-google-8891',
      name: 'Eng. Convidado Google',
      email: 'engenharia@google-auth.com.br',
      role: 'Editor',
      crea: 'CREA-SP 508.112.990-2',
      avatar: 'G',
    };

    setCurrentUser(googleUser);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
    setIsLoading(false);
    return { success: true };
  };

  const loginAsDemoUser = (role: UserRole) => {
    setIsLoading(true);
    const demoUser: User = role === 'Editor'
      ? {
          id: 'demo-editor-01',
          name: 'Eng. Carlos Eduardo Ribeiro',
          email: 'carlos.ribeiro@horizonteeng.com.br',
          role: 'Editor',
          crea: 'CREA-SP 506.912.443-8',
          avatar: 'CR',
        }
      : {
          id: 'demo-viewer-02',
          name: 'Fiscal Fernando Antunes',
          email: 'fiscal.antunes@auditoriaobras.com.br',
          role: 'Visualizador',
          crea: 'CREA-SP 501.320.119-0',
          avatar: 'FA',
        };

    setCurrentUser(demoUser);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    setIsLoading(false);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((r) => setTimeout(r, 500));
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Informe um e-mail válido para redefinição.' };
    }
    return {
      success: true,
      message: `Link de recuperação de senha enviado com sucesso para ${email}. Verifique sua caixa de entrada.`,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        loginAsDemoUser,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
