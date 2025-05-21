import httpClient from './httpClient';
import { useAuthStore } from '@/store/authStore';

// Types for authentication
export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  role: string;
  created_at: string;
}

export interface LoginRequest {
  username: string; // API uses 'username' field for email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
    role: string;
    created_at: string;
  }
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface MessageResponse {
  message: string;
}

/**
 * Authentication Service for William Travel API
 * Handles all authentication-related API calls
 */
class AuthService {
  private apiVersion = '/v1';
  private authEndpoint = `${this.apiVersion}/auth`;

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise with user data
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await httpClient.post<RegisterResponse>(
        `${this.authEndpoint}/register`,
        userData
      );
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Log in a user and store authentication token
   * @param credentials User login credentials
   * @returns Promise with login response including token
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Create form data as the API expects form-urlencoded data
      const formData = new URLSearchParams();
      formData.append('username', credentials.username); // API uses 'username' for email
      formData.append('password', credentials.password);

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const response = await httpClient.post<LoginResponse>(
        `${this.authEndpoint}/login`,
        formData.toString(),
        config
      );

      // Store auth data in the store
      if (response && response.access_token) {
        const { access_token, user } = response;
        const authStore = useAuthStore.getState();
        authStore.login(access_token, user);
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Log out the current user
   * @returns Promise with logout message
   */
  async logout(): Promise<MessageResponse> {
    try {
      const response = await httpClient.post<MessageResponse>(
        `${this.authEndpoint}/logout`
      );

      // Clean up auth store regardless of API response
      const authStore = useAuthStore.getState();
      authStore.logout();

      return response;
    } catch (error) {
      console.error('Logout failed:', error);

      // Still clean up auth store on error
      const authStore = useAuthStore.getState();
      authStore.logout();

      throw error;
    }
  }

  /**
   * Request password reset email
   * @param email User's email address
   * @returns Promise with message response
   */
  async forgotPassword(email: string): Promise<MessageResponse> {
    try {
      const response = await httpClient.post<MessageResponse>(
        `${this.authEndpoint}/forgot-password`,
        { email }
      );
      return response;
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  }

  /**
   * Reset password using token from email
   * @param resetData Token and new password
   * @returns Promise with message response
   */
  async resetPassword(resetData: ResetPasswordRequest): Promise<MessageResponse> {
    try {
      const response = await httpClient.post<MessageResponse>(
        `${this.authEndpoint}/reset-password`,
        resetData
      );
      return response;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns True if user is authenticated
   */
  isAuthenticated(): boolean {
    const authStore = useAuthStore.getState();
    return !!authStore.token;
  }

  /**
   * Get current user's token
   * @returns The auth token or null
   */
  getToken(): string | null {
    const authStore = useAuthStore.getState();
    return authStore.token;
  }

  /**
   * Get current user data
   * @returns User data or null if not logged in
   */
  getCurrentUser() {
    const authStore = useAuthStore.getState();
    return authStore.user;
  }
}

export const authService = new AuthService();
export default authService;
