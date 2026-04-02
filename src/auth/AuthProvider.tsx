import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, HttpError } from "./api";
import type { User } from "./types";

type AuthState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: User }
  | { status: "anonymous"; user: null };

type AuthContextValue = {
  state: AuthState;
  refreshMe: () => Promise<void>;
  login: (login: string, password: string) => Promise<void>;
  register: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });

  const refreshMe = useCallback(async () => {
    try {
      const user = await api.me();
      setState({ status: "authenticated", user });
    } catch (e) {
      if (e instanceof HttpError && e.status === 401) {
        setState({ status: "anonymous", user: null });
      } else {
        // treat as anonymous but keep app usable
        setState({ status: "anonymous", user: null });
      }
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  const login = useCallback(
    async (loginValue: string, password: string) => {
      await api.login(loginValue, password);
      await refreshMe();
    },
    [refreshMe]
  );

  const register = useCallback(
    async (loginValue: string, password: string) => {
      await api.register(loginValue, password);
      await refreshMe();
    },
    [refreshMe]
  );

  const logout = useCallback(async () => {
    await api.logout();
    await refreshMe();
  }, [refreshMe]);

  const value = useMemo<AuthContextValue>(
    () => ({ state, refreshMe, login, register, logout }),
    [state, refreshMe, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

