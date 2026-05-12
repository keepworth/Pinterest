export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}