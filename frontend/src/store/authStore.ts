import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService, LoginRequest } from '@/services/api/authService';
import { User, userService } from '@/services/api/userService';

export enum UserRole {
  USER = 'user',
  GUIDE = 'guide',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPERUSER = 'superuser'
}

interface AuthState {
  user: User | null;
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
  updateProfile: (data: { email?: string; full_name?: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
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

            const loginData: LoginRequest = { username: email, password };
            const loginResponse = await authService.login(loginData);

            if (!loginResponse.success) {
              throw new Error(loginResponse.error || 'Login failed');
            }

            const { access_token, token_type } = loginResponse.data!;
            
            // Update the store with the token
            set({ token: access_token });

            // Fetch the user profile after login
            const userResponse = await userService.getCurrentUser();

            if (!userResponse.success) {
              throw new Error(userResponse.error || 'Failed to fetch user profile');
            }

            set({
              user: userResponse.data,
              token: access_token,
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

            // Implement registration when API is available
            // For now, just simulate a registration
            console.log('Registration not implemented in API yet');

            set({ isLoading: false });
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
        
        logout: async () => {
          // Call logout endpoint if token exists
          const token = get().token;
          if (token) {
            try {
              // Try to logout from server-side
              await authService.logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }

          // Reset auth state
          set({
            user: null, 
            token: null, 
            isAuthenticated: false 
          });
        },
        
        requestResetPassword: async (email: string) => {
          try {
            set({ isLoading: true, error: null });
            const response = await authService.requestPasswordReset({ email });

            if (!response.success) {
              throw new Error(response.error || 'Failed to request password reset');
            }

            set({ isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Password reset request failed',
              isLoading: false
            });
            throw error;
          }
        },
        
        resetUserPassword: async (token: string, newPassword: string) => {
          try {
            set({ isLoading: true, error: null });
            const response = await authService.resetPassword({ token, password: newPassword });

            if (!response.success) {
              throw new Error(response.error || 'Failed to reset password');
            }            const { access_token } = response.data!;

            // Update token in the store (persistence is handled by zustand middleware)
            set({ token: access_token });

            // Fetch the user profile
            await get().fetchUserProfile();

            set({ isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Password reset failed',
              isLoading: false
            });
            throw error;
          }
        },

        updateProfile: async (data) => {
          try {
            set({ isLoading: true, error: null });
            const response = await userService.updateCurrentUser(data);

            if (!response.success) {
              throw new Error(response.error || 'Failed to update profile');
            }

            set({
              user: response.data,
              isLoading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Profile update failed',
              isLoading: false
            });
            throw error;
          }
        },

        updatePassword: async (currentPassword: string, newPassword: string) => {
          try {
            set({ isLoading: true, error: null });
            const response = await userService.updatePassword({
              current_password: currentPassword,
              new_password: newPassword
            });

            if (!response.success) {
              throw new Error(response.error || 'Failed to update password');
            }

            set({ isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Password update failed',
              isLoading: false
            });
            throw error;
          }
        },

        fetchUserProfile: async () => {
          try {
            set({ isLoading: true, error: null });
            const response = await userService.getCurrentUser();

            if (!response.success) {
              throw new Error(response.error || 'Failed to fetch user profile');
            }

            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch user profile',
              isLoading: false,
              isAuthenticated: false,
              user: null
            });
            throw error;
          }
        },
          checkAuth: async () => {
          try {
            // Get token from store (which is persisted to localStorage via middleware)
            const token = get().token;

            if (!token) {
              set({ isAuthenticated: false });
              return false;
            }

            set({ isLoading: true });
            const response = await userService.getCurrentUser();

            if (!response.success) {
              set({ isAuthenticated: false, user: null, token: null, isLoading: false });
              return false;
            }

            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false 
            });
            return true;
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Authentication check failed',
              isAuthenticated: false,
              user: null,
              token: null,
              isLoading: false
            });
            localStorage.removeItem('access_token');
            return false;
          }
        },
        
        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'auth-storage',
        // Only persist these fields to localStorage
        partialize: (state) => ({ token: state.token }),
      }
    )
  )
);
