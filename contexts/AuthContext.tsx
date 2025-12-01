'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'judge' | 'admin'; // ユーザーロール（現状は全員審査員として扱う）
}

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

  useEffect(() => {
    // localStorageから認証状態を復元（SSR対応）
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('animehub_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('animehub_user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('animehub_user');
    }
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
