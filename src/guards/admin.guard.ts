import { Injectable, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    // Valida o JWT primeiro usando o JwtAuthGuard
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Primeiro verifica se há erro ou usuário não existe
    if (err || !user) {
      throw err || new UnauthorizedException('Token de acesso inválido ou expirado');
    }

    // Verifica se o usuário é admin
    if (!user.isAdmin) {
      throw new ForbiddenException('Apenas administradores podem acessar esta rota');
    }

    return user;
  }
}

