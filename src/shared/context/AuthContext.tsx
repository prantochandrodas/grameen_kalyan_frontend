// ================= START: src/shared/context/AuthContext.tsx =================
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AUTH_EVENT,
  IUser,
  getSessionUser,
  logout as doLogout,
} from '@/shared/utils/authService';

interface IAuthContext {
  user: IUser | null;
  ready: boolean;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  ready: false,
  logout: () => undefined,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUser(getSessionUser());
      setReady(true);
    };
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const value = useMemo(
    () => ({ user, ready, logout: doLogout }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
// ================== END: src/shared/context/AuthContext.tsx ==================