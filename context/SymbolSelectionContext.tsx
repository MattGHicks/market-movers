'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SymbolSelectionContextType {
  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string) => void;
}

const SymbolSelectionContext = createContext<SymbolSelectionContextType | undefined>(undefined);

export function SymbolSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  return (
    <SymbolSelectionContext.Provider value={{ selectedSymbol, setSelectedSymbol }}>
      {children}
    </SymbolSelectionContext.Provider>
  );
}

export function useSymbolSelection() {
  const context = useContext(SymbolSelectionContext);
  if (!context) {
    throw new Error('useSymbolSelection must be used within a SymbolSelectionProvider');
  }
  return context;
}
