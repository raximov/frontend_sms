
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { UserProfile, UserRole } from '../types';

// Safe storage wrapper to prevent "SecurityError: The operation is insecure"
// in environments that block localStorage (like some preview sandboxes).
const createSafeStorage = (): StateStorage => {
  try {
    // Check if localStorage is available and writable
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    console.warn('LocalStorage is blocked or unavailable. Falling back to in-memory storage.');
    // In-memory fallback
    const memoryStorage = new Map<string, string>();
    return {
      getItem: (name: string) => memoryStorage.get(name) ?? null,
      setItem: (name: string, value: string) => memoryStorage.set(name, value),
      removeItem: (name: string) => memoryStorage.delete(name),
    };
  }
};

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'eduquest-auth-storage-v2',
      storage: createJSONStorage(() => createSafeStorage()),
    }
  )
);
