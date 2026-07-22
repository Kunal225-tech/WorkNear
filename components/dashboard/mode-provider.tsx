"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type DashboardMode = "employer" | "worker";

interface DashboardModeContextType {
  mode: DashboardMode;
  toggleMode: () => void;
  setMode: (mode: DashboardMode) => void;
  isMounted: boolean;
}

const DashboardModeContext = createContext<DashboardModeContextType | undefined>(undefined);

export function DashboardModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DashboardMode>("worker");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedMode = localStorage.getItem("worknear-dashboard-mode") as DashboardMode;
      if (savedMode === "employer" || savedMode === "worker") {
        setModeState(savedMode);
      }
    } catch (e) {
      console.error("Failed to access localStorage for dashboard mode", e);
    }
  }, []);

  const setMode = (newMode: DashboardMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem("worknear-dashboard-mode", newMode);
    } catch (e) {
      console.error("Failed to set localStorage for dashboard mode", e);
    }
  };

  const toggleMode = () => {
    setMode(mode === "worker" ? "employer" : "worker");
  };

  return (
    <DashboardModeContext.Provider value={{ mode, toggleMode, setMode, isMounted }}>
      {children}
    </DashboardModeContext.Provider>
  );
}

export function useDashboardMode() {
  const context = useContext(DashboardModeContext);
  if (context === undefined) {
    throw new Error("useDashboardMode must be used within a DashboardModeProvider");
  }
  return context;
}
