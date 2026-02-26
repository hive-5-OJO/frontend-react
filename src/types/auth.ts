export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  adminId: string;
  email: string;
  role: string;
}

export interface User {
  adminId: string;
  email: string;
  role: string;
}
