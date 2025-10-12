import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../modules/auth/auth.service';
import type { Request, Response } from 'express';

@Injectable()
export class JwtAuthWithRefreshGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      // Tentar validar o access token primeiro
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      // Access token inválido ou expirado - tentar usar refresh token
      const refreshToken = request?.cookies?.refresh_token;

      if (!refreshToken) {
        // Não tem refresh token - retornar erro com flag para limpar
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Token de acesso inválido ou expirado',
          clearAuth: true,
        });
      }

      try {
        // Validar e decodificar o refresh token
        const payload = await this.authService.validateRefreshToken(refreshToken);

        if (!payload) {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'Refresh token inválido',
            clearAuth: true,
          });
        }

        // Verificar se o refresh token corresponde ao hash no banco
        const user = await this.authService.getUserIfRefreshTokenMatches(
          payload.sub,
          refreshToken,
        );

        if (!user) {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'Refresh token inválido ou revogado',
            clearAuth: true,
          });
        }

        // Gerar novos tokens (rotação)
        const tokens = await this.authService.refreshTokens(
          user.id,
          user.email,
          user.isAdmin,
        );

        // Atualizar cookie com novo refresh token
        const isProduction = process.env.NODE_ENV === 'production';
        response.cookie('refresh_token', tokens.refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: 'strict',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        });

        // Adicionar novo access token ao header da resposta
        response.setHeader('X-New-Access-Token', tokens.accessToken);

        // Anexar usuário ao request para continuar o fluxo
        request.user = {
          userId: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
        };

        return true;
      } catch (refreshError) {
        // Refresh token também falhou - retornar erro com flag para limpar
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Sessão expirada. Faça login novamente.',
          clearAuth: true,
        });
      }
    }
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException({
        statusCode: 401,
        message: 'Token de acesso inválido ou expirado',
        clearAuth: true,
      });
    }
    return user;
  }
}

