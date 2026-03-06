export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UpdateRequest {
  newUsername?: string;
  newEmail?: string;
  newPassword?: string;
  password: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface MessageResponse {
  message: string;
}
