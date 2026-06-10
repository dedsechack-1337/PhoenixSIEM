import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  username: string;
  role: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo credentials
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  analyst1: {
    password: 'soc@1337',
    user: { username: 'analyst1', role: 'SOC Analyst L2', email: 'analyst1@phoenixsiem.io', avatar: 'A1' },
  },
  admin: {
    password: 'admin@1337',
    user: { username: 'admin', role: 'SOC Administrator', email: 'admin@phoenixsiem.io', avatar: 'AD' },
  },
  viewer: {
    password: 'view@1337',
    user: { username: 'viewer', role: 'Read-Only Analyst', email: 'viewer@phoenixsiem.io', avatar: 'VW' },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem('phoenix_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    const entry = DEMO_USERS[username.toLowerCase()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      sessionStorage.setItem('phoenix_user', JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('phoenix_user');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
