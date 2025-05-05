// src/contexts/NavigationContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Definição do tipo para os nomes dos componentes
export type ActiveComponentType = 'home' | 'empreendimentos' | 'oferta-ativa' | 'marketing' | 'capacitacao' | 'links-uteis' | 'configuracao';

interface NavigationContextType {
  activeComponent: ActiveComponentType;
  setActiveComponent: (component: ActiveComponentType) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeComponent, setActiveComponent] = useState<ActiveComponentType>('home');

  return (
    <NavigationContext.Provider value={{ activeComponent, setActiveComponent }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
