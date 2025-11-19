import React, { createContext, useContext, useState } from 'react';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  const [tick, setTick] = useState(0);
  const notify = () => setTick((t) => t + 1);
  return (
    <SyncContext.Provider value={{ tick, notify }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return ctx;
}
