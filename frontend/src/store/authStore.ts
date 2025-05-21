import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authService from '@/services/api/authService';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  permissions?: string[];
}

export enum UserRole {
  USER = 'user',
  GUIDE = 'guide',
  ADMIN = 'admin'
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  requestResetPassword: (email: string) => Promise<void>;
  resetUserPassword: (token: string, newPassword: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        
        login: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            const response = await authService.login({ username: email, password });
            const { user, access_token: token } = response;
            set({
              user, 
              token, 
              isAuthenticated: true,
              isLoading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Login failed',
              isLoading: false 
            });
            throw error;
          }
        },
        
        register: async (email: string, password: string, name?: string) => {
          try {
            set({ isLoading: true, error: null });
            const user = await authService.register({
              email,
              password,
              full_name: name || '',
              role: 'user'
            });
            // After registration, proceed with login
            await get().login(email, password);
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Registration failed',
              isLoading: false 
            });
            throw error;
          }
        },
        
        logout: () => {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
          });
        },
        
        requestResetPassword: async (email: string) => {
          try {
            set({ isLoading: true, error: null });
            await authService.requestPasswordReset(email);
            set({ isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to request password reset',
              isLoading: false 
            });
            throw error;
          }
        },
        
        resetUserPassword: async (token: string, newPassword: string) => {
          try {
            set({ isLoading: true, error: null });
            await authService.resetPassword(token, newPassword);
            set({ isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to reset password',
              isLoading: false 
            });
            throw error;
          }
        },
        
        checkAuth: async () => {
          const { token } = get();
          if (!token) {
            set({ isAuthenticated: false, user: null });
            return false;
          }
          
          try {
            set({ isLoading: true, error: null });
            const user = await authService.verifyToken(token);
            set({
              user, 
              isAuthenticated: true,
              isLoading: false 
            });
            return true;
          } catch (error) {
            set({ 
              user: null, 
              token: null, 
              isAuthenticated: false,
              isLoading: false,
              error: null // Don't show error for token verification
            });
            return false;
          }
        },
        
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ token: state.token }),
      }
    )
  )
);
