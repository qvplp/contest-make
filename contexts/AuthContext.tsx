'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import type { User } from '@/modules/account/domain/User';
import { LocalStorageAuthRepository } from '@/modules/account/infra/LocalStorageAuthRepository';
import { GetCurrentUser } from '@/modules/account/application/GetCurrentUser';
import { Login } from '@/modules/account/application/Login';
import { Logout } from '@/modules/account/application/Logout';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isJudge: boolean; // 審査員かどうか（現状は全員true）
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const authRepo = useMemo(() => new LocalStorageAuthRepository(), []);
  const getCurrentUser = useMemo(() => new GetCurrentUser(authRepo), [authRepo]);
  const loginUC = useMemo(() => new Login(authRepo), [authRepo]);
  const logoutUC = useMemo(() => new Logout(authRepo), [authRepo]);

  useEffect(() => {
    const current = getCurrentUser.execute();
    if (current) {
      setUser(current);
      setIsLoggedIn(true);
    }
  }, [getCurrentUser]);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    loginUC.execute(userData);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    logoutUC.execute();
  };

  // 現状は全員審査員として扱う（ロール実装がないため）
  const isJudge = isLoggedIn;

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isJudge, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
