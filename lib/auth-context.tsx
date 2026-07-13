'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isDemoMode } from './firebase';
import { demoUsers, demoPasswords } from './demo-data';
import type { AppUser, Role } from './types';

interface AuthCtx {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AppUser>;
  registerUser: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null, loading: true,
  login: async () => { throw new Error('not ready'); },
  registerUser: async () => {},
  logout: async () => {},
});

const DEMO_KEY = 'fsos-demo-session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      const saved = localStorage.getItem(DEMO_KEY);
      if (saved) {
        const u = demoUsers.find((d) => d.uid === saved);
        if (u) setUser(u);
      }
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth!, async (fbUser) => {
      if (!fbUser) { setUser(null); setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db!, 'users', fbUser.uid));
        if (snap.exists()) {
          setUser({ uid: fbUser.uid, ...(snap.data() as Omit<AppUser, 'uid'>) });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string): Promise<AppUser> => {
    if (isDemoMode) {
      const u = demoUsers.find((d) => d.email === email);
      if (!u || demoPasswords[email] !== password) throw new Error('invalid-credentials');
      if (!u.approved) throw new Error('pending-approval');
      localStorage.setItem(DEMO_KEY, u.uid);
      setUser(u);
      return u;
    }
    const cred = await signInWithEmailAndPassword(auth!, email, password);
    const snap = await getDoc(doc(db!, 'users', cred.user.uid));
    if (!snap.exists()) throw new Error('no-profile');
    const profile = { uid: cred.user.uid, ...(snap.data() as Omit<AppUser, 'uid'>) };
    if (!profile.approved) {
      await signOut(auth!);
      throw new Error('pending-approval');
    }
    setUser(profile);
    return profile;
  };

  const registerUser = async (email: string, password: string, name: string, role: Role) => {
    if (isDemoMode) throw new Error('demo-no-register');
    const cred = await createUserWithEmailAndPassword(auth!, email, password);
    const profile: Omit<AppUser, 'uid'> = {
      email, name, role,
      approved: false,
      createdAt: Date.now(),
    };
    await setDoc(doc(db!, 'users', cred.user.uid), profile);
    await signOut(auth!);
  };

  const logout = async () => {
    if (isDemoMode) {
      localStorage.removeItem(DEMO_KEY);
      setUser(null);
      return;
    }
    await signOut(auth!);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
