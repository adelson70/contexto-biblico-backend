import { Injectable, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  constructor(authService: AuthService) {
    super(authService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Valida o JWT primeiro usando o JwtAuthGuard (com renovação automática)
    const result = await super.canActivate(context);
    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    // Primeiro verifica se há erro ou usuário não existe
    if (err || !user) {
      throw err || new UnauthorizedException({
        statusCode: 401,
        message: 'Token de acesso inválido ou expirado',
        clearAuth: true,
      });
    }

    // Verifica se o usuário é admin
    if (!user.isAdmin) {
      throw new ForbiddenException('Apenas administradores podem acessar esta rota');
    }

    return user;
  }
}

