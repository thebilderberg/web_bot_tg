import React, { createContext, useContext, useMemo, useState } from "react";
import type { RouteKey } from "./types";

type NavContextValue = {
  route: RouteKey;
  navigate: (to: RouteKey) => void;
};

const NavContext = createContext<NavContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<RouteKey>("home");

  const value = useMemo<NavContextValue>(
    () => ({
      route,
      navigate: setRoute
    }),
    [route]
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNavigation() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}

