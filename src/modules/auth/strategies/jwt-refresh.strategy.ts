import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extrair o refresh token do cookie
          return request?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const refreshToken = request?.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    // Verificar se o refresh token ainda é válido no banco de dados
    const user = await this.authService.getUserIfRefreshTokenMatches(
      payload.sub,
      refreshToken,
    );

    if (!user) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Retornar os dados do usuário que serão anexados ao request
    return {
      userId: payload.sub,
      email: payload.email,
      isAdmin: payload.isAdmin,
    };
  }
}

