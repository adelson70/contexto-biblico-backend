import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BcryptService } from '../../common/services/bcrypt.service';
import { GeolocalizacaoService } from '../../common/services/geolocalizacao.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AdminGuard } from '../../guards/admin.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'your-secret-key-change-this',
      signOptions: { expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, GeolocalizacaoService, Logger, JwtStrategy, JwtRefreshStrategy, AdminGuard, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
