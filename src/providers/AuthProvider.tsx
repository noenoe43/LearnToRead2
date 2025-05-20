
import React from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useAuthProvider } from '@/hooks/useAuthProvider';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
