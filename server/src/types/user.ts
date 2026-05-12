export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}