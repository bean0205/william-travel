import apiClient from './apiClient';
import { AuthUser, UserRole } from '@/store/authStore';

// For demo purposes, we'll use this mock users data
// In a real application, you would replace this with actual API calls
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123', // In real app, password would be hashed server-side
    name: 'Demo User',
    role: 'user',
    permissions: ['view_locations', 'view_guides', 'add_favorite']
  },
  {
    id: '2',
    email: 'guide@example.com',
    password: 'password123',
    name: 'Demo Guide',
    role: 'guide',
    permissions: ['view_locations', 'view_guides', 'add_favorite', 'create_guide', 'edit_own_guide']
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
    role: 'admin',
    permissions: ['view_locations', 'view_guides', 'add_favorite', 'create_guide', 'edit_any_guide', 'add_location', 'edit_location', 'delete_location', 'manage_users']
  }
];

interface AuthResponse {
  user: AuthUser;
  token: string;
}

// Login user
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  // In a real app, you would do:
  // const { data } = await apiClient.post('/auth/login', { email, password });
  // return data;
  
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
  
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const { password: _, ...userData } = user;
  
  return {
    user: userData,
    token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 10),
  };
};

// Register user
export const registerUser = async (
  email: string, 
  password: string, 
  name?: string
): Promise<AuthResponse> => {
  // In a real app, you would do:
  // const { data } = await apiClient.post('/auth/register', { email, password, name });
  // return data;
  
  await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulated delay
  
  // Check if user already exists
  const userExists = mockUsers.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  
  if (userExists) {
    throw new Error('User with this email already exists');
  }
  
  // In a real app, you would not be modifying this array
  // This is just for demo purposes
  const newUser = {
    id: (mockUsers.length + 1).toString(),
    email,
    password,
    name: name || email.split('@')[0], // Use part of email as name if not provided
    role: UserRole.USER, // Default role for new users
    permissions: ['view_locations', 'view_guides', 'add_favorite'] // Default permissions
  };
  
  mockUsers.push(newUser);
  
  const { password: _, ...userData } = newUser;
  
  return {
    user: userData,
    token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 10),
  };
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<void> => {
  // In a real app, you would do:
  // await apiClient.post('/auth/reset-password/request', { email });
  
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulated delay
  
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  
  if (!user) {
    throw new Error('No user found with this email');
  }
  
  // In a real app, this would trigger an email with a reset link
  // This is just for demo purposes
};

// Reset password with token
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  // In a real app, you would do:
  // await apiClient.post('/auth/reset-password/confirm', { token, newPassword });
  
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
  
  // This would validate the token and update the password in a real app
  // For demo, we'll just validate the token format
  if (!token || !token.includes('-')) {
    throw new Error('Invalid reset token');
  }
  
  // We would update the user's password here in a real app
};

// Verify JWT token
export const verifyToken = async (token: string): Promise<AuthUser> => {
  // In a real app, you would do:
  // const { data } = await apiClient.get('/auth/me', {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // return data;
  
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay
  
  // For demo, we'll assume the token is valid if it starts with our prefix
  if (!token.startsWith('mock-jwt-token-')) {
    throw new Error('Invalid token');
  }
  
  // In a real app, the server would decode the token and return the user data
  // For demo, return a default user
  return {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    role: UserRole.USER,
    permissions: ['view_locations', 'view_guides', 'add_favorite']
  };
};
