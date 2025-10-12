import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'your-secret-key-change-this',
    });
  }

  async validate(payload: JwtPayload) {
    // Verificar se o usuário ainda existe e não foi deletado
    const user = await this.prisma.usuarios.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Usuário não encontrado ou foi removido');
    }

    // Retornar os dados do usuário que serão anexados ao request
    return {
      userId: payload.sub,
      email: payload.email,
      isAdmin: payload.isAdmin,
    };
  }
}

