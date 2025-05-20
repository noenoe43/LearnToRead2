
import React, { createContext } from 'react';
import { Session, User } from '@supabase/supabase-js';

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: object) => Promise<{data: any, user: User | null} | void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  updateTimeSpent: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
