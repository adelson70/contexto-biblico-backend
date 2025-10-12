import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BcryptService } from '../../common/services/bcrypt.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

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
  providers: [AuthService, BcryptService, Logger, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
