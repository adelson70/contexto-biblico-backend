export interface JwtPayload {
  sub: number; // ID do usuário
  email: string;
  isAdmin: boolean;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

